## Context

HAL-ERP already has all the building blocks for transactional email — `MailServiceImpl` ([mail.service.impl.ts](src/common/infrastructure/mail/infrastructure/mail.service.impl.ts)) sits on top of `@nestjs-modules/mailer`, the `JwtModule` is wired in [mail.module.ts](src/common/infrastructure/mail/mail.module.ts) with a 3-day default expiry, and the codebase already proves the pattern of "sign a JWT, embed it in a template" in [sendMail-User.usecase.ts](src/common/infrastructure/mail/application/sendMail-User.usecase.ts). What is missing is a domain-aware endpoint that lets an authenticated user pick recipients and a target `approval-workflows` id, and dispatches an action-link email pointing at the external approval API (`PUT http://134.209.101.30:3000/api/approval-workflows/approve`).

The external approval system already has a configured base URL (`APPROVAL_API_URL` in `.env`, used by [send-otp.util.ts](src/common/utils/server/send-otp.util.ts)), but that variable points at the *server-to-server* endpoint and may differ from the *public, click-able* URL the email recipient must hit. We will introduce a separate `APPROVAL_PUBLIC_URL` so the two concerns don't collide.

Stakeholders: ERP backend (this repo), external approval API at `134.209.101.30:3000`, end-user approvers (email recipients), and the requester (typically a document/workflow initiator).

## Goals / Non-Goals

**Goals:**
- One internal REST endpoint that accepts `{ workflowId, userIds[] }` and dispatches an email per recipient.
- Each email contains an action URL of the form `${APPROVAL_PUBLIC_URL}/api/approval-workflows/approve?workflowId=<id>&token=<jwt>` (exact query/route to match what the external service expects — see Open Questions).
- The JWT payload binds the recipient (`userId` / `email`) to the specific `workflowId` and has a short expiry (default: 3 days, configurable).
- Recipient validation: each user id must resolve to a user with a non-empty email, scoped to the requester's company per the standard `UserContextService` pattern.
- Reuse existing infrastructure — no new npm dependencies.

**Non-Goals:**
- Persisting an "email-sent log" or audit table (out of scope for this change; can be a follow-up).
- Implementing the *receiver* side of the approval link (that lives in the external `134.209.101.30:3000` service, not in this repo).
- Rejection emails or other approval-status variants — this change is scoped to the "approve" CTA only. A future change can parameterize the status.
- Localization beyond what the existing mail templates already support (Handlebars file per language is out of scope).
- Throttling / rate-limit logic on the dispatch endpoint.

## Decisions

### 1. Place the feature in the `manage` module, not in `common/infrastructure/mail`
The endpoint is a domain operation ("dispatch approval email for workflow X to users Y"), not a generic mail primitive. Following the CQRS layout already used across `src/modules/manage/`, we create:
- `controllers/approval-email.controller.ts`
- `application/commands/approval-email/send-approval-email.command.ts` + `handler/send-approval-email-command.handler.ts`
- `application/dto/create/send-approval-email.dto.ts`

The handler depends on `IMailService` (already exported by `MailModule`) and the existing user repository. **Alternative considered**: adding the use case directly under `common/infrastructure/mail/application/`. Rejected because the rule "validate user IDs scoped to company" is domain-aware and belongs in the manage module — `common/` is meant to be domain-neutral.

### 2. Use a CQRS command + handler (not a plain service method)
Every write-style operation in this codebase goes through `ICommandHandler` (per [CLAUDE.md](CLAUDE.md) "CQRS Handler Patterns"). Even though no DB rows are written, "send N emails" is a side-effectful write. Keeping it as a command preserves consistency and lets us add a send-log table later without changing the controller contract.

### 3. JWT payload shape and signing key
Sign with the existing `JwtService` already provided by `MailModule` (secret hard-coded to `phetaibtc@gmail.com`, see [mail.module.ts](src/common/infrastructure/mail/mail.module.ts#L12-L20)). Payload:
```json
{ "workflowId": "<uuid>", "userId": "<uuid>", "email": "<recipient>", "purpose": "approval-action" }
```
Expiry: 3 days by default (matches existing `JwtModule` config), overridable per-call via the handler. The `purpose` claim lets the external service distinguish this token from other JWTs that might share the same secret.

**Alternative considered**: minting a brand-new HS256 secret just for approval links. Rejected for this change because the existing approval API trusts a separate `x-secret-key` header rather than the JWT itself, so secret rotation is a separate concern. Recorded as an Open Question.

### 4. New env var `APPROVAL_PUBLIC_URL`
Distinct from `APPROVAL_API_URL` (which is the server-to-server base used by `send-otp.util.ts`). Default for dev: same as `APPROVAL_API_URL`. Production: `http://134.209.101.30:3000`. Resolved via `ConfigService` inside the handler so it is overridable per environment without touching code.

### 5. Recipient validation and partial-failure semantics
- All `userIds` are resolved in a single read against the user repository, scoped to the caller's company (per the SUPER_ADMIN/ADMIN rule documented in [CLAUDE.md](CLAUDE.md)).
- If **any** id resolves to a user without an email or to a user outside the caller's company scope, the whole request fails with a 400 (atomic validation). We do not silently skip.
- If validation passes but an individual `mailerService.sendMail` call throws, the handler continues sending the remaining recipients and returns a summary `{ sent: [...], failed: [{userId, reason}, ...] }`. Email delivery is inherently best-effort and partial success is more useful than rolling back the others.

**Alternative considered**: all-or-nothing semantics on send failure. Rejected because SMTP failures for one address (bad mailbox) shouldn't block the rest.

### 6. Template choice
Add a new Handlebars template `approval-action.hbs` next to the existing templates ([src/common/infrastructure/mail/templates/](src/common/infrastructure/mail/templates/)). Context variables: `recipientName`, `workflowId`, `approveUrl`, `expiresInLabel`. Keep markup minimal — a single CTA button plus a plain-text fallback URL.

## Risks / Trade-offs

- **JWT secret is hard-coded in `mail.module.ts`** → The external approver service must be told the same secret out-of-band to validate the token, or it must accept the token as opaque. If we ever rotate the secret we break in-flight emails. **Mitigation**: document the secret-rotation procedure; consider moving the secret into `ConfigService` in a follow-up change.
- **No send-log persisted** → Operators have no in-DB record of who was emailed for which workflow. **Mitigation**: SMTP relay logs and application logs remain available; add a `approval_email_log` table in a follow-up if audit demand emerges.
- **Email is best-effort** → Recipients may not receive the link (spam, typo'd address). **Mitigation**: partial-success response (decision #5) surfaces failures so the caller can retry or escalate.
- **Public approval URL is unauthenticated by ERP standards** → Anyone with the link can approve. **Mitigation**: short JWT expiry (3 days), one-time-use semantics enforced by the external service (out of our scope), and the token is bound to a specific `workflowId` + `userId`.
- **Hard-coded production IP `134.209.101.30:3000`** → Brittle. **Mitigation**: introduce `APPROVAL_PUBLIC_URL` env var so the IP never appears in source. The proposal lists this as an impact item.

## Migration Plan

This is a pure additive change:
1. Add `APPROVAL_PUBLIC_URL` to `.env` and `.env.example`.
2. Deploy backend with the new endpoint and template.
3. No DB migrations, no breaking API changes.

**Rollback**: revert the commit; the new endpoint disappears. No data to clean up.

## Open Questions

- **Exact URL shape the external service expects.** The proposal assumes `?workflowId=<id>&token=<jwt>` but `PUT /api/approval-workflows/approve` may instead expect the id in the path (`/api/approval-workflows/<id>/approve`) or the token in an `Authorization` header that the recipient's browser cannot natively send. → **To confirm with the owner of `134.209.101.30:3000` before implementation.**
- **Should the token be single-use?** Single-use requires the external service to track a nonce. Out of scope for this change but should be confirmed.
- **Should we also support a `reject` CTA in the same email?** Current scope is approve-only (per the user request). If yes, the template grows two buttons and the token payload may need a `status` claim.

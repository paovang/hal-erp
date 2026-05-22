## 1. Config & environment

- [ ] 1.1 Add `APPROVAL_PUBLIC_URL` to `.env` (dev default e.g. `http://localhost:3001`) and to `.env.example`
- [ ] 1.2 Wire `APPROVAL_PUBLIC_URL` access via `ConfigService` and add a fail-fast check at app boot (throw on missing value)

## 2. Mail template

- [ ] 2.1 Create `src/common/infrastructure/mail/templates/approval-action.hbs` with context vars: `recipientName`, `workflowId`, `approveUrl`, `expiresInLabel`
- [ ] 2.2 Verify the template loads via the existing Handlebars adapter (smoke-render in dev with hard-coded context)

## 3. Inject keys & DTOs (manage module)

- [ ] 3.1 Add inject key constant for the new command handler in `src/modules/manage/application/constants/inject-key.const.ts` (follow existing naming pattern)
- [ ] 3.2 Create `SendApprovalEmailDto` at `src/modules/manage/application/dto/create/send-approval-email.dto.ts` — fields: `workflowId: string` (UUID, `@IsDefined @IsUUID`), `userIds: string[]` (non-empty array of UUIDs, `@ArrayNotEmpty @IsUUID('all', { each: true })`)
- [ ] 3.3 Create response DTO `SendApprovalEmailResponseDto` with shape `{ sent: string[]; failed: { userId: string; reason: string }[] }`

## 4. Command + handler (CQRS)

- [ ] 4.1 Create `SendApprovalEmailCommand` at `src/modules/manage/application/commands/approval-email/send-approval-email.command.ts` carrying `workflowId`, `userIds`, and the authenticated user context
- [ ] 4.2 Create `SendApprovalEmailCommandHandler` at `src/modules/manage/application/commands/approval-email/handler/send-approval-email-command.handler.ts`
- [ ] 4.3 Handler step: resolve all `userIds` via the user repository, scoped to the caller's company (respect SUPER_ADMIN/ADMIN override per `UserContextService`)
- [ ] 4.4 Handler step: atomic validation — if any id is missing, out-of-scope, or has no email, throw a domain exception that maps to HTTP 400 (use the existing exception/i18n pattern)
- [ ] 4.5 Handler step: for each validated recipient, sign a JWT via the mail-module `JwtService` with payload `{ workflowId, userId, email, purpose: 'approval-action' }` and 3-day expiry
- [ ] 4.6 Handler step: build the approval URL `${APPROVAL_PUBLIC_URL}/api/approval-workflows/approve?workflowId=<id>&token=<jwt>` (final query shape to be confirmed against the external service — see design.md Open Questions)
- [ ] 4.7 Handler step: send each email via `IMailService.sendMail` using the `approval-action.hbs` template; catch per-recipient errors and collect into a `failed` array; do not abort the loop on individual failure
- [ ] 4.8 Handler step: return `{ sent, failed }` summary

## 5. Controller

- [ ] 5.1 Create `ApprovalEmailController` at `src/modules/manage/controllers/approval-email.controller.ts` with route prefix `approval-email`
- [ ] 5.2 Add `POST /dispatch` endpoint that accepts `SendApprovalEmailDto` and dispatches `SendApprovalEmailCommand` via `CommandBus`
- [ ] 5.3 Add Swagger decorators (`@ApiTags`, `@ApiOperation`, `@ApiBody`, `@ApiResponse`) describing the request and response shapes
- [ ] 5.4 Confirm the endpoint is protected by the global JWT guard (no `@Public()`)

## 6. Provider registration & module wiring

- [ ] 6.1 Add `SendApprovalEmailCommandHandler` to the manage module's `AllRegisterProviders` array (`src/modules/manage/application/providers/index.ts`)
- [ ] 6.2 Register `ApprovalEmailController` in the manage module's controllers array
- [ ] 6.3 Ensure `MailModule` is imported (or re-exported) so `IMailService` and `JwtService` are injectable in the handler

## 7. Smoke verification

- [ ] 7.1 Boot the app locally (`pnpm run start:dev`) and confirm no startup errors with `APPROVAL_PUBLIC_URL` set
- [ ] 7.2 Hit `POST /api/approval-email/dispatch` with a valid JWT, a real `workflowId`, and one real `userId` in the caller's company; confirm an email is received and the embedded link uses the configured base URL
- [ ] 7.3 Hit the endpoint with an invalid `userId` (different company) and confirm HTTP 400 with the i18n-formatted error and no email sent
- [ ] 7.4 Decode the JWT from a received email and confirm `workflowId`, `userId`, `email`, `purpose: "approval-action"`, and `exp` ≤ 3 days
- [ ] 7.5 Per memory `feedback_unit_tests.md` — no unit tests are required for this change; confirm with the user before adding any `*.spec.ts`

## Why

Approvers currently have no email-driven entry point into the external approval workflow. Today there is only an OTP-send utility ([send-otp.util.ts](src/common/utils/server/send-otp.util.ts)) and a generic mail service; nothing links a selected approver to a one-click "approve" action against the external endpoint `PUT http://134.209.101.30:3000/api/approval-workflows/approve` with body `{ "status": "approved" }`. We need an internal API that lets the system dispatch an approval email — containing a signed token plus the `approval-workflows` id — to one or more selected users so approval can happen out-of-band from the ERP UI.

## What Changes

- Add a new REST endpoint under the `manage` module to dispatch an approval email for a given `approval-workflows` id to one or more selected users (selected by user id).
- Build the email body from a new Handlebars template that renders an approval CTA URL embedding (a) a short-lived signed token bound to the selected user + workflow and (b) the `approval-workflows` id.
- Reuse the existing `MailServiceImpl` ([mail.service.impl.ts](src/common/infrastructure/mail/infrastructure/mail.service.impl.ts)) and the `JwtModule` already wired in [mail.module.ts](src/common/infrastructure/mail/mail.module.ts) for token signing.
- Add an env-configurable approval base URL (e.g. `APPROVAL_PUBLIC_URL`) so the embedded link points at `http://134.209.101.30:3000/api/approval-workflows/approve` in production without hard-coding.
- Validate selected recipients against the user repository (must exist and have an email) and scope the lookup to the requester's company.

## Capabilities

### New Capabilities
- `approval-email-dispatch`: Sending approval-action emails to selected users for a given approval-workflows id, including signed-token + workflow-id payload, recipient validation, and template-based rendering.

### Modified Capabilities
<!-- None. No existing spec in openspec/specs/ owns approval-email or mail behavior. -->

## Impact

- **New code**:
  - Controller, command, command handler, DTOs, and mapper under `src/modules/manage/` for the new endpoint.
  - New Handlebars template under [src/common/infrastructure/mail/templates/](src/common/infrastructure/mail/templates/) (e.g. `approval-action.hbs`).
  - Provider registration in the manage module's `AllRegisterProviders`.
- **Config**:
  - New env var `APPROVAL_PUBLIC_URL` (default value for dev; production set to `http://134.209.101.30:3000`).
- **Dependencies**: No new npm packages — reuses `@nestjs-modules/mailer`, `@nestjs/jwt`, existing user repository.
- **External systems**: Email recipients receive a link to the external approval API; no new outbound calls from this service.
- **No DB migrations**: Endpoint is stateless w.r.t. the ERP DB (it only reads users; it does not persist a send-log in this change).

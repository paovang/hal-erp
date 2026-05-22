## ADDED Requirements

### Requirement: Approval-email dispatch endpoint
The system SHALL expose an authenticated REST endpoint that accepts an approval-workflows id and a list of user ids, and dispatches one approval-action email per recipient.

#### Scenario: Valid request dispatches one email per recipient
- **WHEN** an authenticated user sends `POST /api/approval-email/dispatch` with body `{ "workflowId": "<uuid>", "userIds": ["<u1>", "<u2>"] }` and all user ids resolve to users in the caller's company who have a non-empty email
- **THEN** the system sends one email per recipient via the configured mail service, and returns a response of shape `{ "sent": ["<u1>", "<u2>"], "failed": [] }` with HTTP 200

#### Scenario: Unauthenticated request is rejected
- **WHEN** a client without a valid JWT calls `POST /api/approval-email/dispatch`
- **THEN** the system rejects the request with HTTP 401 and does not send any email

#### Scenario: Empty recipient list
- **WHEN** the request body's `userIds` is missing or empty
- **THEN** the system rejects the request with HTTP 400 (validation error) and does not send any email

### Requirement: Recipient validation is atomic
The system SHALL validate every requested recipient before sending any email. If any recipient cannot be resolved to a user within the caller's company scope, or resolves to a user without an email, the entire request SHALL be rejected and no emails sent.

#### Scenario: One id is outside the caller's company
- **WHEN** the request contains a `userId` that exists but belongs to a different company than the caller's (and the caller is not SUPER_ADMIN/ADMIN)
- **THEN** the system rejects the whole request with HTTP 400 and no emails are sent

#### Scenario: One id resolves to a user with no email
- **WHEN** the request contains a `userId` for a user whose `email` field is null or empty
- **THEN** the system rejects the whole request with HTTP 400 and no emails are sent

#### Scenario: One id does not exist
- **WHEN** the request contains a `userId` that does not match any user row
- **THEN** the system rejects the whole request with HTTP 400 and no emails are sent

### Requirement: Email contains a signed token bound to recipient and workflow
The system SHALL embed a JWT in each email's approval link. The JWT payload MUST include at least `workflowId`, `userId`, `email`, and a `purpose` claim set to `"approval-action"`. The token MUST be signed with the existing mail-module JWT secret and MUST have a finite expiry (default 3 days).

#### Scenario: Token is unique per recipient
- **WHEN** the dispatch endpoint sends emails to two different users for the same `workflowId`
- **THEN** each email contains a JWT whose `userId` claim matches that specific recipient (the tokens are not identical)

#### Scenario: Token carries the workflow id
- **WHEN** an email is dispatched for `workflowId = X`
- **THEN** the JWT in that email decodes to a payload containing `workflowId: "X"` and `purpose: "approval-action"`

#### Scenario: Token has a finite expiry
- **WHEN** an email is dispatched without an explicit expiry override
- **THEN** the JWT carries an `exp` claim no more than 3 days in the future

### Requirement: Approval URL points at the configured public approval host
The system SHALL construct the email's approval URL from a configurable base (`APPROVAL_PUBLIC_URL` env var) so that the literal host `134.209.101.30:3000` does not appear in source code. The URL SHALL target the external endpoint `PUT /api/approval-workflows/approve` with the `workflowId` and `token` discoverable from the URL.

#### Scenario: Production-style base URL
- **WHEN** `APPROVAL_PUBLIC_URL` is set to `http://134.209.101.30:3000`
- **THEN** the email's approval link starts with `http://134.209.101.30:3000/api/approval-workflows/approve`

#### Scenario: Dev-style base URL
- **WHEN** `APPROVAL_PUBLIC_URL` is set to `http://localhost:3001`
- **THEN** the email's approval link starts with `http://localhost:3001/api/approval-workflows/approve`

#### Scenario: Missing config
- **WHEN** `APPROVAL_PUBLIC_URL` is not set in the environment at application boot
- **THEN** the application fails fast at startup with a clear configuration error

### Requirement: Partial-failure semantics on send errors
The system SHALL continue dispatching to the remaining recipients if an individual send fails (e.g. SMTP error), and SHALL report per-recipient outcomes in the response.

#### Scenario: One SMTP failure does not block other sends
- **WHEN** the mail service throws while sending to `<u1>` but succeeds for `<u2>`
- **THEN** the response is `{ "sent": ["<u2>"], "failed": [{ "userId": "<u1>", "reason": "<error message>" }] }` with HTTP 200

#### Scenario: All sends fail
- **WHEN** the mail service throws for every recipient
- **THEN** the response lists every recipient in `failed` with their reason, and the response status is HTTP 200 (the dispatch itself ran; delivery is best-effort)

### Requirement: Email is rendered from a Handlebars template
The system SHALL render the email body from a Handlebars template (`approval-action.hbs`) that exposes at least `recipientName`, `workflowId`, `approveUrl`, and `expiresInLabel` as context variables.

#### Scenario: Template variables are populated
- **WHEN** the dispatch handler renders an email for recipient `Alice` with `workflowId = X` and a 3-day token
- **THEN** the rendered email contains Alice's name, the workflow id `X`, the constructed approval URL, and a human-readable expiry label (e.g. "3 days")

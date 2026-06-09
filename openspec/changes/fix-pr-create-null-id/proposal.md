## Why

`POST /api/purchase-requests` intermittently returns an opaque `500 Cannot read properties of null (reading 'id')`. The create handler performs several deep property accesses on values that can be `null` (the authenticated user, and currency/relation lookups), so a single missing relation or auth-context gap crashes the request with no actionable message and rolls back the whole transaction. Users cannot tell whether they sent bad data, are missing a setup step, or hit a server bug.

## What Changes

- Guard the unguarded null dereferences in the PR create flow ([create.command.handler.ts](../../../src/modules/manage/application/commands/purchaseRequest/handler/create.command.handler.ts)):
  - Authenticated user: `getAuthUser()?.user` then unguarded `user.id` (line ~191) → fail fast with a clear `401/400` when the auth context has no user.
  - Currency on the selected quota's vendor product: `quota.vendor_product.currency.id` / `.code` (lines ~320, ~559) → raise a domain `404/400` ("currency not configured for this vendor product") instead of dereferencing `null`.
  - Empty `purchase_request_items` (`purchaseRequestItems[0]` at line ~315) → validate non-empty before indexing.
- Replace silent `null` dereferences with `ManageDomainException`s that carry an i18n key and the offending entity, consistent with the rest of the handler.
- Remove the leftover debug `console.log('from_mail', ...)` (line ~193).
- Add a regression test to the existing [create.command.handler.spec.ts](../../../src/modules/manage/application/commands/purchaseRequest/handler/create.command.handler.spec.ts) covering the null-auth-user and null-currency paths.

## Capabilities

### New Capabilities
- `purchase-request-creation`: Defines the request-validation and error-handling contract for creating a purchase request — required inputs, the preconditions that must hold (authenticated user, configured currency, non-empty items), and that violations produce meaningful `4xx` domain errors rather than an opaque `500`.

### Modified Capabilities
<!-- None: no existing spec governs PR creation behavior. -->

## Impact

- **Code**: `src/modules/manage/application/commands/purchaseRequest/handler/create.command.handler.ts` (and its `.spec.ts`).
- **Behavior**: Failure responses for malformed/incomplete create requests change from `500` to specific `4xx` domain errors; the happy path is unchanged.
- **APIs**: `POST /api/purchase-requests` only.
- **Data/Dependencies**: None — no schema or dependency changes.

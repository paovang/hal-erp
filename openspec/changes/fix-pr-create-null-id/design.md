## Context

`POST /api/purchase-requests` is handled by `CreateCommandHandler.execute` ([create.command.handler.ts](../../../src/modules/manage/application/commands/purchaseRequest/handler/create.command.handler.ts)), which runs the whole creation inside a single `runInTransaction`. The handler reads several values via optional chaining or relation loads and then immediately dereferences nested properties without guarding for `null`:

- `const user = this._userContextService.getAuthUser()?.user;` then `const user_id = user.id;` (lines ~190–191). The optional chain admits `undefined`/`null`, but the next line dereferences unconditionally. A leftover `console.log('from_mail', from_mail, user)` (line ~193) indicates this was already under investigation.
- `quota.vendor_product.currency.code` (line ~320) and `quota.vendor_product.currency.id` (line ~559) — `currency` is a loaded relation that can be `null` even when `currency_id` is set (e.g. orphaned FK) or when the relation isn't present.
- `purchaseRequestItems[0].quota_company_id` (line ~315) — indexes the first item without verifying the list is non-empty.

The symptom reported in production is `500 Cannot read properties of null (reading 'id')`, which matches an unguarded `.id` access on a `null` object (auth user or currency). Current DB data shows no `vendor_products.currency_id IS NULL`, making the auth-user path the leading suspect, but both are real defects and cheap to guard.

## Goals / Non-Goals

**Goals:**
- Eliminate the opaque `500` by failing fast with specific, i18n-backed `4xx` domain errors for foreseeable null/missing conditions in the PR create flow.
- Keep the happy path and transaction semantics unchanged (still all-or-nothing).
- Add regression coverage for the null-auth-user and null-currency paths.

**Non-Goals:**
- No change to the data model, DTO validation pipeline, or the approval/notification flow.
- No broad refactor of the (large) handler; only targeted guards and the debug-log removal.
- Not fixing the same pattern in other handlers (PO/receipt) — out of scope for this change.

## Decisions

- **Guard at point of use with `ManageDomainException`, not optional-chaining-to-`undefined`.** Each risky dereference gets an explicit precondition check that throws `ManageDomainException` with an i18n key and the offending entity in `property`, matching the existing style used elsewhere in the same handler (e.g. the workflow/budget checks). Rationale: produces actionable messages and the correct HTTP status, and rolls the transaction back cleanly. Alternative considered: returning `undefined` and letting downstream fail — rejected, it just moves the opaque failure.
- **Auth user resolved once, validated immediately.** Replace `getAuthUser()?.user` + `user.id` with a check that throws an auth/`400` domain error when the user is absent, before any DB work. Rationale: cheapest possible failure, no partial transaction.
- **Currency presence validated where the quota is loaded.** Before reading `currency.id`/`currency.code`, assert `quota.vendor_product?.currency` exists; otherwise throw a `not_found`/`400` naming the vendor product or item. Applies to both the `insertItem` loop (line ~559) and the post-loop read (line ~320).
- **Non-empty items guard.** Validate `purchase_request_items.length > 0` before `items[0]` access. (DTO-level `@ArrayNotEmpty` is the ideal long-term home, but a handler guard is included to be defensive regardless of DTO state.)
- **Remove the debug `console.log`.** It leaks user info to stdout and signals unfinished work.

## Risks / Trade-offs

- **Risk: the true production root cause is a different null than the ones guarded.** → Mitigation: guard the full set of `.id`/`.code` dereferences identified in the create path, and add the regression test so the specific reported message can no longer reach the client as a `500`. If logs later pinpoint another line, it is a one-line follow-up under the same spec.
- **Risk: changing a `500` to `4xx` could alter client expectations.** → Mitigation: clients already cannot succeed on these inputs; a `4xx` with a message is strictly more useful and is the intended contract per the spec.
- **Trade-off: handler-level guards duplicate what stronger DTO validation could enforce.** Accepted for now to keep the change small and low-risk; DTO hardening can follow.

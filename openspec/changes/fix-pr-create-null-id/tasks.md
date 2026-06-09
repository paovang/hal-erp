## 1. Guard the authenticated user

- [ ] 1.1 In `create.command.handler.ts`, after `const user = this._userContextService.getAuthUser()?.user;`, throw a `ManageDomainException` (auth/`400`) with an i18n key when `user` (or `user.id`) is absent — before any DB writes.
- [ ] 1.2 Remove the leftover `console.log('from_mail', from_mail, user)` debug line.

## 2. Guard the vendor-product currency

- [ ] 2.1 In `insertItem`, before reading `quota.vendor_product.currency.id` (line ~559), assert `quota.vendor_product?.currency` exists; otherwise throw `ManageDomainException` (`errors.not_found`/`400`) naming the vendor product or item title.
- [ ] 2.2 Apply the same guard before reading `quota.vendor_product.currency.code` in `execute` (line ~320).

## 3. Guard the items array

- [ ] 3.1 Validate `query.dto.purchase_request_items` is non-empty before accessing `purchaseRequestItems[0]` (line ~315); throw a `400` validation domain error if empty.
- [ ] 3.2 Add an `i18n` message entry (en + lo) for any new error key introduced.

## 4. Tests

- [ ] 4.1 Extend `create.command.handler.spec.ts` with a case asserting a missing auth user yields a `4xx` (not `500`) and writes nothing.
- [ ] 4.2 Add a case asserting a null vendor-product currency yields the currency `4xx` domain error.
- [ ] 4.3 Add a case asserting an empty items list yields a `400` validation error.

## 5. Verify

- [ ] 5.1 Run `pnpm run build` and `pnpm run test -- create.command.handler.spec.ts`; confirm green.
- [ ] 5.2 Manually `POST /api/purchase-requests` with a payload that previously triggered the null deref and confirm the response is a meaningful `4xx`, not `500`.

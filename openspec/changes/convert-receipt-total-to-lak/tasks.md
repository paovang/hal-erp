## 1. Pre-flight audit

- [ ] 1.1 Run a SQL audit against staging: `SELECT DISTINCT payment_currency_id FROM receipt_items` and confirm every value has an active matching row in `exchange_rates` where `to_currency.code = 'LAK'`. Seed any missing rate rows before deploying.
- [ ] 1.2 Capture before-snapshot of `GET /api/receipts` and `GET /api/receipts/:id` for two or three representative receipts (all-LAK, single-foreign, mixed) to compare against post-deploy.

## 2. Fix exchange-rate lookup key in `ReceiptDataAccessMapper.toEntity`

- [x] 2.1 In [src/modules/manage/infrastructure/mappers/receipt.mapper.ts](src/modules/manage/infrastructure/mappers/receipt.mapper.ts), change the rate-map lookup inside both `reduce` calls (lines 75-103) from `rateMap.get(String(item.currency.id))` to `rateMap.get(String(item.payment_currency.id))`.
- [x] 2.2 Update both `BadRequestException` messages to identify the **payment** currency that is missing a `→ LAK` rate, e.g. `Exchange rate from <code> to LAK is not configured.`
- [x] 2.3 Short-circuit the lookup when the payment currency is already `LAK` (rate of 1) so all-LAK receipts do not require a row in `exchange_rates`.
- [x] 2.4 Extract a small private helper `convertItemToLak(item, rateMap): { paymentTotalLak: number; vatLak: number }` and use it from both reduce loops to remove duplicated rate-lookup logic.

## 3. Fix `calculateCurrencyTotalsFromItems` aggregation

- [x] 3.1 Replace the `currencyMap.set(currencyId, ...)` overwrite (lines 195-203) with a get-or-create + merge pattern so multiple items sharing one payment currency are summed, not replaced by the last one seen.
- [x] 3.2 Compute each entry's `total`, `vat`, `amount` from per-item LAK-converted values (using the same helper from 2.4) keyed by `payment_currency_id`, instead of receiving the already-summed top-level `sub_total`/`vat`/`total` parameters that flatten across currencies.
- [x] 3.3 Adjust the function signature accordingly (drop the `sub_total`/`vat`/`total` parameters since they are no longer the right input) and update the single call site in `toEntity` (line 160).
- [x] 3.4 Ensure `code` and `name` continue to come from the original payment currency (`item.payment_currency`), not LAK.

## 4. Update Swagger / response DTO documentation

- [x] 4.1 In [src/modules/manage/application/dto/response/receipt.response.ts](src/modules/manage/application/dto/response/receipt.response.ts), enrich the `@ApiProperty` decorators on `total`, `sub_total`, and `vat` with a description noting the value is denominated in **LAK**.
- [x] 4.2 Update the `@ApiProperty` on `currency_totals` to clarify that `total`/`vat`/`amount` are in LAK while `id`/`code`/`name` describe the original payment currency.

## 5. Verify application-layer mapper requires no changes

- [x] 5.1 Read [src/modules/manage/application/mappers/receipt.mapper.ts](src/modules/manage/application/mappers/receipt.mapper.ts) `toResponse` and confirm it forwards `entity.total`, `entity.sub_total`, `entity.vat`, and `entity.currencyTotals` unchanged. No edits expected; if any post-processing is found that re-applies a rate, remove it.

## 6. Tests

- [ ] 6.1 Add a unit test for `ReceiptDataAccessMapper.toEntity` covering: (a) all items in LAK → rate of 1 path, (b) all items in a single foreign currency → values multiplied correctly, (c) mixed-currency receipt → per-currency conversion, (d) missing rate → `BadRequestException` with the expected message.
- [ ] 6.2 Add a unit test for the `currency_totals` aggregation covering multiple items sharing one payment currency (must sum, not overwrite) and items spanning multiple payment currencies (one entry per currency).
- [ ] 6.3 Run `pnpm run test -- src/modules/manage/infrastructure/mappers/receipt.mapper.spec.ts` and confirm all new tests pass.
- [ ] 6.4 Run the full `pnpm run test` suite to confirm no regressions in other receipt-touching tests.

## 7. Manual / integration verification

- [ ] 7.1 Start the dev server (`pnpm run start:dev`) and hit `GET /api/receipts` against the staging dataset; confirm `total`, `sub_total`, `vat` match the manually computed LAK sums for the audit receipts captured in 1.2.
- [ ] 7.2 Hit `GET /api/receipts/:id` for the same receipts; confirm `currency_totals[]` length equals the number of distinct payment currencies on each receipt and that each entry's LAK values are correct.
- [ ] 7.3 Hit `GET /api/receipts/:id/print` and confirm the embedded receipt monetary values match the list/detail responses (consistency requirement).
- [ ] 7.4 Test the missing-rate path by temporarily deactivating one `→ LAK` rate row in a non-prod DB and confirming the API returns HTTP 400 with the expected message; restore the row afterward.

## 8. Release coordination

- [ ] 8.1 Notify the front-end team that the `total` / `sub_total` / `vat` / `currency_totals[].total/vat/amount` values now arrive in LAK; confirm any client-side conversion logic is removed in the same release window.
- [ ] 8.2 Update the changelog / release notes flagging this as a **BREAKING** response-value change for receipt list and detail endpoints.
- [ ] 8.3 Capture a post-deploy snapshot of the same audit receipts from 1.2 and diff against the before-snapshot to confirm only the values changed (LAK-correct) and the JSON shape did not.

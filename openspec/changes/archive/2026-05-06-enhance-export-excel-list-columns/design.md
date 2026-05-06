## Context

Three controllers expose a `GET /export-excel` endpoint that returns an `.xlsx` for a date range:

- `src/modules/manage/controllers/purchase-request.controller.ts`
- `src/modules/manage/controllers/purchase-order.controller.ts`
- `src/modules/manage/controllers/receipt.controller.ts`

Each controller delegates to a CQRS query handler (`GetAllForExportQueryHandler`) which calls the matching read repository's `findAllForExport`, maps each ORM entity into a flat row interface defined in `src/common/utils/excel-export.service.ts`, and returns an array of those rows. The controller then passes the array into one of three list-export methods on `ExcelExportService` (`exportPurchaseRequestListToExcel`, `exportPurchaseOrderListToExcel`, `exportReceiptListToExcel`), which builds an ExcelJS workbook with three or four columns and streams the buffer to the client.

Today the row interfaces only carry the document number, the requester username, the createdAt timestamp, and (for PO / Receipt) the total. The Excel output uses the same minimal column set, in the order `Number, CreatedAt, Requester [, Total]`. Users have asked for status visibility, creator visibility, a more scannable column order, and a sum-total summary on PO / Receipt sheets.

## Goals / Non-Goals

**Goals:**

- Add `Status` and `Created By` columns to all three list exports.
- Reorder columns to `Number, Username, Status, Created By, Created At [, Total]`.
- Add a `Sum Total` summary row at the bottom of the PO and Receipt sheets.
- Keep all changes localised to the export pipeline (row interface → query handler → excel service). No controller signature changes.

**Non-Goals:**

- No changes to the per-record `GET /export/:id` endpoints (only the list `export-excel`).
- No new query parameters, filters, sorting controls, or response schema changes.
- No translation / i18n of header labels in this change (headers remain English to match existing format).
- No re-styling of the workbook (fonts, colours, borders) beyond what is needed for the new sum-total row.
- No backfill of older exports — the change applies from deploy onwards.

## Decisions

### 1. Where new fields are sourced

- `status`: read from the document/PO/Receipt entity status field (e.g. `entity.status` or `entity.document?.status`, depending on which model owns workflow status). The query handler maps it to a string before returning so the Excel layer never touches domain enums.
- `createdBy`: the username of the user who created the row. Sourced from the audited `created_by` user relation on the document/PO/Receipt entity. If the entity already has a `createdBy` user relation eager-loaded, reuse it; otherwise extend `findAllForExport` to join it.

Rationale: keeping the lookup in the query handler preserves the layering — the Excel service stays a pure presenter that only knows about the row interface. Alternative considered: compute these in `ExcelExportService` from richer ORM entities. Rejected because it would leak ORM into a presentation utility and force every other caller of the service to load those joins.

### 2. Row interface shape

Add two new fields to each row interface:

```ts
export interface PrListExportRow {
  pr_number: string;
  requesterUsername: string;
  status: string;          // NEW
  createdBy: string;       // NEW
  createdAt: Date | null;
}

export interface PoListExportRow {
  po_number: string;
  requesterUsername: string;
  status: string;          // NEW
  createdBy: string;       // NEW
  createdAt: Date | null;
  total: number;
}

export interface ReceiptListExportRow {
  receipt_number: string;
  requesterUsername: string;
  status: string;          // NEW
  createdBy: string;       // NEW
  createdAt: Date | null;
  total: number;
}
```

The field declaration order is changed to match the new column order so the interface itself documents the layout. Both new fields are non-nullable strings; missing values become empty strings (matching existing `?? ''` handling for `requesterUsername`).

### 3. Excel column order

ExcelJS column definitions are rewritten in the new order. Column keys map directly to row interface field names:

| # | PR sheet         | PO sheet         | Receipt sheet     |
|---|------------------|------------------|-------------------|
| 1 | PR Number        | PO Number        | Receipt Number    |
| 2 | Username         | Username         | Username          |
| 3 | Status           | Status           | Status            |
| 4 | Created By       | Created By       | Created By        |
| 5 | Created At       | Created At       | Created At        |
| 6 | —                | Total            | Total             |

The header label "Requester" is renamed to "Username" to match the field-naming the user asked for and to make the meaning explicit alongside "Created By".

### 4. Sum-total row (PO / Receipt only)

After all data rows are written, append one extra row:

- Cell in column 1 (the document-number column): label `Sum Total` (right-aligned, bold).
- Cells in columns 2–5: empty (still styled with thin border for visual consistency).
- Cell in column 6 (Total): an ExcelJS sum formula referencing the data range — e.g. `{ formula: 'SUM(F2:F<lastDataRow>)' }` — so the workbook recomputes if a user edits values. Number format `#,##0.00`, right-aligned, bold.

Rationale: a formula is preferred over a precomputed JavaScript sum because (a) it stays correct if a user filters or edits the sheet, and (b) it costs the same to write. Alternative considered: write both a static value and the formula. Rejected as redundant.

PR has no monetary total and therefore no summary row. The PR sheet ends with the last data row.

### 5. Header / styling reuse

The existing `styleHeaderRow` and `styleBodyCell` helpers are reused unchanged. The sum-total row is styled with `styleBodyCell` plus a `font.bold = true` override on the label and total cells.

## Risks / Trade-offs

- **[Risk] Column order is a breaking change for any external script that reads cells by position** → Mitigation: communicate via release notes; consumers should switch to reading by header label. The endpoint is internal so impact is limited.
- **[Risk] `status` source field varies between PR, PO, and Receipt entities** → Mitigation: each query handler is responsible for its own mapping; the Excel layer just renders the string. Document the mapping in `tasks.md`.
- **[Risk] `createdBy` may require a new join in the read repository** → Mitigation: check each `findAllForExport` first; only add a `leftJoin` on the `created_by` user relation if not already present. Keep the join read-only on the read connection.
- **[Risk] Empty sheets** (no rows in date range) — placing `SUM(F2:F1)` is invalid → Mitigation: when `rows.length === 0`, skip the sum-total row entirely (or use `SUM(F2:F2)` against an empty cell, which evaluates to 0). Prefer skipping for cleanliness.
- **[Trade-off] Header renamed from "Requester" to "Username"** — slight loss of semantic clarity, but matches the user's requested layout terminology. Acceptable because "Username" sits next to the new "Created By" column which provides the disambiguation.

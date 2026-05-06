## ADDED Requirements

### Requirement: Receipt list export workbook structure

The system SHALL produce a single-worksheet `.xlsx` file titled `Receipts` for the `GET /receipts/export-excel` endpoint, with exactly six columns in this order:

1. `Receipt Number`
2. `Username` (the requester's username)
3. `Status`
4. `Created By` (the username of the user who created the receipt)
5. `Created At`
6. `Total`

Header row 1 SHALL be styled with the existing header style. Each data row SHALL be styled with the existing body style. The `Total` column SHALL use number format `#,##0.00` and right alignment.

#### Scenario: Workbook columns are emitted in the required order

- **WHEN** the endpoint returns receipts for a date range with at least one row
- **THEN** the workbook contains a worksheet named `Receipts`
- **AND** row 1 contains the headers `Receipt Number`, `Username`, `Status`, `Created By`, `Created At`, `Total` in columns A–F
- **AND** there are no additional columns

### Requirement: Receipt row content

For each receipt in the result set, the system SHALL emit one data row containing:

- `Receipt Number` ← the receipt's number, or empty string if missing
- `Username` ← the requester's username, or empty string if missing
- `Status` ← the receipt's current workflow status as a human-readable string, or empty string if missing
- `Created By` ← the username of the creator user, or empty string if missing
- `Created At` ← `createdAt` formatted as `YYYY-MM-DD HH:mm:ss`, or empty string if missing
- `Total` ← the receipt total as a number; missing or null totals SHALL be coerced to `0`

`Receipt Number`, `Username`, `Status` and `Created By` SHALL be left-aligned. `Created At` SHALL be center-aligned. `Total` SHALL be right-aligned.

#### Scenario: Each receipt produces exactly one row with all six columns populated

- **WHEN** a receipt `RC-0001` exists with requester `alice`, status `RECEIVED`, creator `bob`, createdAt `2026-04-12 09:30:15`, total `999.99`
- **THEN** a data row is written with `RC-0001`, `alice`, `RECEIVED`, `bob`, `2026-04-12 09:30:15`, `999.99` in columns A–F
- **AND** the `Total` cell uses number format `#,##0.00`

### Requirement: Receipt sum-total summary row

When the result set contains at least one receipt, the system SHALL append one summary row immediately after the last data row, structured as:

- Column A: the literal label `Sum Total`, bold, right-aligned
- Columns B–E: empty cells, styled with body borders
- Column F: an Excel `SUM` formula over the `Total` cells of all data rows (e.g. `SUM(F2:F<lastDataRow>)`), formatted with number format `#,##0.00`, bold, right-aligned

When the result set is empty, the system SHALL NOT append a summary row.

#### Scenario: Summary row totals all data rows via formula

- **WHEN** the workbook contains 2 receipt data rows with totals 50.25 and 49.75
- **THEN** an additional row is appended at row 4
- **AND** cell A4 contains `Sum Total`
- **AND** cell F4 contains a SUM formula evaluating to `100.00`
- **AND** cell F4 uses number format `#,##0.00` and is bold

#### Scenario: No summary row when result set is empty

- **WHEN** the workbook is generated for a date range that contains no receipts
- **THEN** the worksheet contains only the header row
- **AND** no `Sum Total` row is written

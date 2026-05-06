## ADDED Requirements

### Requirement: PR list export workbook structure

The system SHALL produce a single-worksheet `.xlsx` file titled `Purchase Requests` for the `GET /purchase-requests/export-excel` endpoint, with exactly five columns in this order:

1. `PR Number`
2. `Username` (the requester's username)
3. `Status`
4. `Created By` (the username of the user who created the purchase request)
5. `Created At`

Header row 1 SHALL be styled with the existing header style (Phetsarath OT bold 12pt, light-grey fill, thin borders, 22pt row height). Each data row SHALL be styled with the existing body style (Phetsarath OT 11pt, thin borders).

#### Scenario: Workbook columns are emitted in the required order

- **WHEN** the endpoint returns purchase requests for a date range with at least one row
- **THEN** the workbook contains a worksheet named `Purchase Requests`
- **AND** row 1 contains the headers `PR Number`, `Username`, `Status`, `Created By`, `Created At` in columns A–E
- **AND** there are no additional columns

### Requirement: PR row content

For each purchase request in the result set, the system SHALL emit one data row containing:

- `PR Number` ← the purchase request's PR number, or empty string if missing
- `Username` ← the requester's username, or empty string if missing
- `Status` ← the purchase request's current workflow status as a human-readable string, or empty string if missing
- `Created By` ← the username of the creator user, or empty string if missing
- `Created At` ← `createdAt` formatted as `YYYY-MM-DD HH:mm:ss` (local server time), or empty string if missing

`PR Number`, `Username`, `Status` and `Created By` SHALL be left-aligned. `Created At` SHALL be center-aligned.

#### Scenario: Each PR produces exactly one row with all five columns populated

- **WHEN** a purchase request `PR-0001` exists with requester `alice`, status `APPROVED`, creator `bob`, createdAt `2026-04-12 09:30:15`
- **THEN** a data row is written with values `PR-0001`, `alice`, `APPROVED`, `bob`, `2026-04-12 09:30:15` in columns A–E

#### Scenario: Missing values are rendered as empty strings

- **WHEN** a purchase request has no requester username and no status
- **THEN** the corresponding cells in the data row are empty strings, not `null`, `undefined`, or `"N/A"`

### Requirement: PR sheet has no summary row

Because purchase requests do not carry a monetary `Total`, the PR worksheet SHALL NOT contain a `Sum Total` summary row. The last row of the worksheet is the last data row.

#### Scenario: No summary row is appended

- **WHEN** the workbook for any date range is generated
- **THEN** the worksheet ends at the last data row
- **AND** no row labelled `Sum Total` exists in the worksheet

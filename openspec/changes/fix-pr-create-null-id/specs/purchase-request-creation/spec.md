## ADDED Requirements

### Requirement: Authenticated user is required to create a purchase request

The system SHALL resolve the authenticated user from the request context before creating a purchase request. If no authenticated user is present, the system SHALL reject the request with a clear authentication/authorization error and MUST NOT dereference a `null` user.

#### Scenario: Missing authenticated user
- **WHEN** a create request reaches the handler but the request context has no authenticated user
- **THEN** the system rejects the request with a `401` (or domain `400`) error carrying a meaningful message
- **AND** no purchase request, document, or approval records are written

#### Scenario: Valid authenticated user
- **WHEN** a create request reaches the handler with a valid authenticated user
- **THEN** the system proceeds to create the purchase request using that user's id

### Requirement: Selected vendor product must have a configured currency

The system SHALL verify that the currency of the vendor product behind each selected quota company is configured before computing LAK valuation. If the currency is missing, the system SHALL raise a domain error identifying the offending item and MUST NOT dereference a `null` currency.

#### Scenario: Vendor product has no currency
- **WHEN** a selected quota company's vendor product has no associated currency
- **THEN** the system rejects the request with a domain `404`/`400` error naming the affected vendor product/item
- **AND** the transaction is rolled back with no partial records

#### Scenario: Vendor product has a currency
- **WHEN** every selected quota company's vendor product has a configured currency
- **THEN** the system computes the LAK valuation and continues creating the purchase request

### Requirement: Purchase request must contain at least one item

The system SHALL require at least one purchase request item. The system MUST NOT index into the items array (e.g. `items[0]`) without first confirming it is non-empty.

#### Scenario: No items provided
- **WHEN** a create request contains an empty `purchase_request_items` list
- **THEN** the system rejects the request with a `400` validation error
- **AND** no records are written

### Requirement: Create failures return meaningful errors instead of opaque 500s

The system SHALL surface precondition failures during purchase request creation as specific `4xx` domain errors with i18n-backed messages. The system MUST NOT return a generic `500 "Cannot read properties of null (reading 'id')"` for these foreseeable conditions.

#### Scenario: Foreseeable precondition fails
- **WHEN** a create request fails a known precondition (missing user, missing currency, empty items, missing referenced entity)
- **THEN** the response status is a `4xx` appropriate to the cause
- **AND** the response message identifies what was missing or invalid

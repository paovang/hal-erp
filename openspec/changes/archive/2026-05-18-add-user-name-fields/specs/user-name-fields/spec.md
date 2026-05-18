## ADDED Requirements

### Requirement: User aggregate SHALL store first name and last name

The user aggregate SHALL include `firstName` and `lastName` as first-class properties. The `users` table SHALL have `first_name` and `last_name` columns of type varchar(255). Both columns SHALL be nullable at the database level to preserve existing rows that were created before this feature, but new and updated users MUST always have both values populated through the API.

#### Scenario: Legacy user row has null names

- **WHEN** the system loads a user record that was created before the migration ran
- **THEN** `firstName` and `lastName` on the returned user response MAY be `null`
- **AND** no error SHALL be raised when reading such a record

#### Scenario: New user row has populated names

- **WHEN** a new user is created via the API
- **THEN** the persisted row SHALL have non-null `first_name` and `last_name` values matching the request payload

---

### Requirement: Create user endpoint SHALL require first name and last name

`POST /users` SHALL require both `firstName` and `lastName` in the request body. Both fields MUST be non-empty strings. Requests missing either field SHALL be rejected with a 400 validation error before the command handler runs.

#### Scenario: Create request with both names

- **WHEN** the client sends `POST /users` with `firstName: "Somchai"` and `lastName: "Phongsavath"` and all other required fields
- **THEN** the system SHALL create the user
- **AND** the response SHALL include `first_name: "Somchai"` and `last_name: "Phongsavath"`

#### Scenario: Create request missing firstName

- **WHEN** the client sends `POST /users` without a `firstName` field
- **THEN** the system SHALL return HTTP 400 with a validation error indicating `firstName` is required
- **AND** no user row SHALL be created

#### Scenario: Create request with empty lastName

- **WHEN** the client sends `POST /users` with `lastName: ""`
- **THEN** the system SHALL return HTTP 400 with a validation error indicating `lastName` must not be empty

---

### Requirement: Update user endpoint SHALL require first name and last name

`PUT /users/:id` SHALL require both `firstName` and `lastName` in the request body. Both fields MUST be non-empty strings. Requests missing either field SHALL be rejected with a 400 validation error before the command handler runs. The update SHALL overwrite the existing `first_name` and `last_name` values on the target user row.

#### Scenario: Update changes both names

- **WHEN** the client sends `PUT /users/:id` with new `firstName` and `lastName` values
- **THEN** the persisted row SHALL be updated to the new values
- **AND** the GET response for the same user SHALL reflect the new values

#### Scenario: Update request missing lastName

- **WHEN** the client sends `PUT /users/:id` without a `lastName` field
- **THEN** the system SHALL return HTTP 400 with a validation error
- **AND** the target user row SHALL be unchanged

---

### Requirement: User response payloads SHALL expose first name and last name

All endpoints that return a user representation (`GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `GET /users/by-token/:token`) SHALL include `first_name` and `last_name` fields in the response body. These fields MAY be `null` for legacy user rows.

#### Scenario: List response includes name fields

- **WHEN** the client calls `GET /users`
- **THEN** each item in the paginated `data` array SHALL include `first_name` and `last_name` keys

#### Scenario: Get-one response includes name fields

- **WHEN** the client calls `GET /users/:id` for a user that has names populated
- **THEN** the response body SHALL include the user's `first_name` and `last_name` values

---

### Requirement: User list search SHALL match against name fields

`GET /users?search=<term>` SHALL match the term against `first_name` and `last_name` columns using a case-insensitive partial match, in addition to the existing matches against `username`, `email`, and `tel`. Matching SHALL use the same `ILIKE '%<term>%'` semantics as the existing search columns.

#### Scenario: Search matches first name

- **WHEN** the client calls `GET /users?search=somchai` and a user has `first_name: "Somchai"`
- **THEN** that user SHALL appear in the response

#### Scenario: Search matches partial last name

- **WHEN** the client calls `GET /users?search=phong` and a user has `last_name: "Phongsavath"`
- **THEN** that user SHALL appear in the response

#### Scenario: Search is case-insensitive

- **WHEN** the client calls `GET /users?search=SOMCHAI` and a user has `first_name: "somchai"`
- **THEN** that user SHALL appear in the response

#### Scenario: Search ignores legacy null names

- **WHEN** the client calls `GET /users?search=foo` and a user has `first_name: null`, `last_name: null`, and no match in `username`/`email`/`tel`
- **THEN** that user SHALL NOT appear in the response
- **AND** no error SHALL be raised on the null comparison

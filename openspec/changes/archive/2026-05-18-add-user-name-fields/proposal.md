## Why

The current `users` table only stores `username`, `email`, and `tel`, with no separate first/last name fields. Downstream features (UI displays, signed documents, mail templates, reporting) need a real person name and currently rely on `username`, which is an identifier — not a human name. Splitting into `firstName` and `lastName` lets the system render proper names everywhere a user is shown.

## What Changes

- Add `first_name` and `last_name` columns (varchar 255, nullable) to the `users` table via a new TypeORM migration. Columns are nullable so existing rows are preserved without a backfill.
- Extend the `UserEntity` domain model and its builder with `firstName` / `lastName` properties and setters.
- Update `CreateUserDto` and `UpdateUserDto` to require `firstName` and `lastName` on the request (even though the column itself is nullable) so all newly created or modified users are guaranteed to have names going forward.
- Update `UserResponse` to expose `first_name` and `last_name`.
- Map the new fields in both the application-layer mapper (`application/mappers/user.mapper.ts`) and the infrastructure-layer mapper (`infrastructure/mappers/user.mapper.ts`).
- Persist the new fields in the write repository (`create`, `createWithCompany`, `update`).
- Include `first_name` and `last_name` in the user list search (alongside `username`, `email`, `tel`) in the read repository.
- Update the user seeder to populate first/last name for seeded users.

## Capabilities

### New Capabilities
- `user-name-fields`: Captures the requirements around storing, validating, persisting, and exposing `firstName` and `lastName` on the user aggregate, including the search behavior on the user list endpoint.

### Modified Capabilities
<!-- No existing spec in openspec/specs/ describes user CRUD, so no delta is required. -->

## Impact

- **Database**: New migration adds two nullable columns to `users`. No downtime; no backfill required.
- **API**: `POST /users` and `PUT /users/:id` now require `firstName` and `lastName` in the request body — this is a **BREAKING** change for any external client posting to these endpoints. `GET /users` and `GET /users/:id` responses gain `first_name` and `last_name` fields (additive, non-breaking).
- **Search**: `GET /users?search=…` now also matches against the new name columns.
- **Code touched**: `user.orm.ts`, `user.entity.ts`, `user.builder.ts`, user create/update/response DTOs, both user mappers, user read/write repositories, user create/update command handlers (mapping only, no new validations), user seeder, and a new migration file.
- **No changes** to the controller, auth flow, change-password flow, or send-mail flow.

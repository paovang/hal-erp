## Context

The `users` table currently has no human-name columns. The application leans on `username` (an identifier, often an email-like or short handle) when it needs to render a person's name in UIs, emails, and approval documents. As more workflows surface user identity (signed receipts, approval chains, notification templates), the lack of `firstName` / `lastName` is becoming a real gap.

The user module follows the project's standard DDD + CQRS layering (see [CLAUDE.md](../../CLAUDE.md)):

- ORM entity: `src/common/infrastructure/database/typeorm/user.orm.ts`
- Domain entity + builder: `src/modules/manage/domain/entities/user.entity.ts`, `src/modules/manage/domain/builders/user.builder.ts`
- DTOs: `src/modules/manage/application/dto/create/user/{create,update}.dto.ts`, `src/modules/manage/application/dto/response/user.response.ts`
- Mappers: `src/modules/manage/application/mappers/user.mapper.ts` (DTO ↔ Domain), `src/modules/manage/infrastructure/mappers/user.mapper.ts` (Domain ↔ ORM)
- Repositories: `src/modules/manage/infrastructure/repositories/user/{read,write}.repository.ts`
- Handlers: `src/modules/manage/application/commands/user/handler/{create,update}-command.handler.ts`
- Seeder: `src/common/infrastructure/database/seeders/user.seeder.ts`

A real production database already has user rows. Any schema change must preserve those rows without forcing a backfill of name data we don't have.

## Goals / Non-Goals

**Goals:**
- Persist `first_name` and `last_name` on the `users` table.
- Make `firstName` and `lastName` first-class properties of `UserEntity` (with builder setters, mapper coverage, and response exposure).
- Require both fields on `POST /users` and `PUT /users/:id` so every newly created or edited user has a name from this point forward.
- Extend the user list search so callers can find a user by first or last name.
- Preserve all existing user rows without a data backfill.

**Non-Goals:**
- Renaming or deprecating `username`. It remains the unique identifier used for login.
- Backfilling first/last name for existing users.
- Composing a `fullName` virtual column or computed accessor — callers concatenate client-side as needed.
- Touching auth flows (`login`, `change-password`, `send-mail`) — those endpoints don't accept name data.
- Adding uniqueness constraints on the name fields (names aren't unique by nature).

## Decisions

### Decision 1: Nullable columns at the DB layer, required at the DTO layer

We add `first_name` and `last_name` as nullable `varchar(255)` columns, but mark `firstName` and `lastName` as required in `CreateUserDto` and `UpdateUserDto` (`@IsDefined()`, `@IsString()`, `@IsNotEmpty()`).

**Rationale:** Existing rows in production have no name data. A `NOT NULL` constraint would break the migration or force us to invent a placeholder backfill. Keeping the column nullable lets the migration run safely with no data movement. Validation at the DTO layer guarantees that any user *created or updated* after this change goes in with both names populated, which is the actual product requirement. Over time the nullable rows naturally heal as users are edited.

**Alternative considered:** `NOT NULL` columns with a backfill (e.g., copy `username` into both fields). Rejected — `username` is not a name and copying it pollutes user records with bogus data that's hard to undo. Better to accept transient nulls.

### Decision 2: Both fields required even on update

`UpdateUserDto` currently extends `CreateUserDto` and omits `password` / `permissionIds`. The new fields will be inherited as required (not optional).

**Rationale:** Keeps create/update symmetric — the existing DTO pattern in this module already treats core profile fields (`username`, `email`, `tel`) as required on update. Following the same convention avoids one-off optional logic in mappers and handlers.

**Trade-off:** A PUT that previously only intended to change roles must now also send `firstName` and `lastName`. Acceptable because the existing PUT already requires `username`, `email`, and `tel`, so clients are already sending the full user payload on every update.

### Decision 3: Mapper writes both fields unconditionally

Both `toEntity` flows (create + update) and the infrastructure `toOrmEntity` mapper assign `firstName` / `lastName` directly. No "skip if undefined" logic.

**Rationale:** Because the DTOs make the fields required, the mappers can rely on them always being present. This matches how `username`, `email`, and `tel` are handled today.

### Decision 4: Add name fields to the list search

The read repository's `findAll` currently `ILIKE`s on `users.username`, `users.email`, `users.tel`. We extend the same `ILIKE` clause to include `users.first_name` and `users.last_name`.

**Rationale:** Searching by name is the primary use case from a UI perspective once names exist. Reusing the same `ILIKE` pattern (no schema changes, no new index) keeps the change minimal. The performance impact is negligible at expected user-table sizes (thousands of rows).

**Alternative considered:** Adding a `tsvector` / trigram index. Overkill for this table size; revisit only if search latency becomes a problem.

### Decision 5: TypeORM migration, not schema sync

Per [CLAUDE.md](../../CLAUDE.md), database changes flow through migrations in `src/common/infrastructure/database/migrations/`. We will run `pnpm run migration:generate` after editing the ORM entity, review the generated SQL, and commit it alongside the code change.

## Risks / Trade-offs

- **Risk:** Clients calling `POST /users` or `PUT /users/:id` without sending the new fields will start getting 400 validation errors. → **Mitigation:** Call this out as **BREAKING** in the proposal and in the PR description. Coordinate with frontend before merging so the UI ships the fields in the same release.
- **Risk:** Nullable columns mean reports/exports that assume non-null names will need defensive null handling for legacy rows. → **Mitigation:** Spec the response shape as nullable; downstream code already null-checks other optional user fields like `tel`. Document in the spec that legacy rows may have `null` here.
- **Risk:** The migration generator might also pick up unrelated drift in the schema if the local DB is out of sync. → **Mitigation:** Inspect the generated migration before committing; only keep the `ADD COLUMN` statements for `first_name` and `last_name`.
- **Trade-off:** Search now scans two more columns per row in `ILIKE`. At current scale (small users table) this is negligible. If the table grows large we can add a trigram index later.

## Migration Plan

1. Modify `user.orm.ts` to add the two columns (nullable, length 255).
2. Run `pnpm run migration:generate` and review the generated migration. Strip out anything unrelated.
3. Apply locally with `pnpm run migration:run` and verify the table.
4. Update domain entity, builder, DTOs, mappers, repositories, and seeder.
5. Smoke-test create / update / list / get-one via the running dev server (`pnpm run start:dev`) — the user prefers smoke tests over new unit tests for areas with no existing spec coverage (see auto-memory `feedback_unit_tests`).
6. Deploy migration first, then the application code. The nullable column makes the order forgiving: old code that doesn't know about the columns will simply ignore them.

**Rollback:** Revert the application deploy, then `pnpm run migration:revert` to drop the columns. Because no data is backfilled and no code outside this change reads the columns, rollback is clean.

## Open Questions

- None. Field nullability, required-on-DTO behavior, and search inclusion were confirmed with the user before this design was written.

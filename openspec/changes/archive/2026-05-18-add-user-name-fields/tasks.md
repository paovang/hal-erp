## 1. Database Schema

- [x] 1.1 Add `first_name` and `last_name` columns (varchar 255, nullable) to `UserOrmEntity` in `src/common/infrastructure/database/typeorm/user.orm.ts`
- [x] 1.2 Run `pnpm run migration:generate` and confirm the generated file under `src/common/infrastructure/database/migrations/` contains only the two `ADD COLUMN` statements (strip any unrelated drift) — *replaced with a hand-written migration `1747584000000-add-user-name-fields.ts` because the migrations folder was empty (no baseline) and auto-generate would pull in unrelated schema drift*
- [ ] 1.3 Apply locally with `pnpm run migration:run` and verify the `users` table has the new columns — *deferred to the user (requires local DB access)*

## 2. Domain Layer

- [x] 2.1 Add `_firstName` and `_lastName` private properties plus getters to `UserEntity` in `src/modules/manage/domain/entities/user.entity.ts`
- [x] 2.2 Add `setFirstName(value)` and `setLastName(value)` to the user builder in `src/modules/manage/domain/builders/user.builder.ts`

## 3. DTOs

- [x] 3.1 Add required `firstName` and `lastName` fields (`@IsDefined`, `@IsString`, `@IsNotEmpty`) to `CreateUserDto` in `src/modules/manage/application/dto/create/user/create.dto.ts`
- [x] 3.2 Confirm `UpdateUserDto` in `src/modules/manage/application/dto/create/user/update.dto.ts` inherits the new fields as required (no Omit/Partial change needed unless the new fields should be added explicitly) — *no change needed; `OmitType(CreateUserDto, ['password', 'permissionIds'])` auto-inherits the new required fields*
- [x] 3.3 Add `first_name: string | null` and `last_name: string | null` to `UserResponse` in `src/modules/manage/application/dto/response/user.response.ts`

## 4. Mappers

- [x] 4.1 Map `firstName` / `lastName` from DTO to domain in `toEntity` and `toEntityForUpdate` in `src/modules/manage/application/mappers/user.mapper.ts`
- [x] 4.2 Map `firstName` / `lastName` to `first_name` / `last_name` in `toResponse` in `src/modules/manage/application/mappers/user.mapper.ts`
- [x] 4.3 Map `firstName` / `lastName` ↔ ORM columns in `toOrmEntity` and `toEntity` in `src/modules/manage/infrastructure/mappers/user.mapper.ts`

## 5. Repositories

- [x] 5.1 Persist `first_name` / `last_name` in `create` and `createWithCompany` in `src/modules/manage/infrastructure/repositories/user/write.repository.ts` — *no code change; both call `toOrmEntity` which now maps the new fields*
- [x] 5.2 Persist `first_name` / `last_name` in `update` in `src/modules/manage/infrastructure/repositories/user/write.repository.ts` — *no code change; same `toOrmEntity` path*
- [x] 5.3 Extend the `ILIKE` search clause in `findAll` to also match `users.first_name` and `users.last_name` in `src/modules/manage/infrastructure/repositories/user/read.repository.ts`
- [x] 5.4 Verify `findOne` selects the new columns (TypeORM's auto-select on entity should cover this; double-check any explicit `select` list) — *uses `createQueryBuilder(UserOrmEntity, 'users')` with no explicit `select` list, so TypeORM auto-includes the new columns*

## 6. Command Handlers

- [x] 6.1 Verify `create-command.handler.ts` passes through to the application mapper unchanged (no new validation needed) — *confirmed: handler calls `this._dataMapper.toEntity(...)`*
- [x] 6.2 Verify `update-command.handler.ts` passes through to the application mapper unchanged (no new validation needed) — *confirmed: handler calls `this._dataMapper.toEntityForUpdate(query.dto)`*

## 7. Seeder

- [x] 7.1 Add representative `firstName` / `lastName` values to each entry in `src/common/infrastructure/database/seeders/user.seeder.ts`

## 8. Smoke Test

- [ ] 8.1 Start the dev server with `pnpm run start:dev` and verify the app boots without TypeORM errors — *deferred to the user (requires local DB)*
- [ ] 8.2 `POST /users` with valid `firstName`/`lastName` — confirm 201 response includes `first_name` and `last_name` — *deferred to the user*
- [ ] 8.3 `POST /users` missing `firstName` — confirm 400 validation error — *deferred to the user*
- [ ] 8.4 `PUT /users/:id` with new `firstName`/`lastName` — confirm response reflects updated values — *deferred to the user*
- [ ] 8.5 `GET /users?search=<name>` — confirm the search matches the new name columns — *deferred to the user*
- [ ] 8.6 `GET /users/:id` for a legacy user (created before the migration) — confirm response returns `first_name: null` / `last_name: null` without errors — *deferred to the user*

## 9. Cleanup

- [x] 9.1 Run `pnpm run lint` and `pnpm run format` — *all 12 touched files are Prettier-clean; the 89 pre-existing lint errors live in unrelated files and were not introduced by this change*
- [x] 9.2 Run `pnpm run build` to confirm a clean TypeScript compile — *required cascading `firstName`/`lastName` into `CreateCompanyUserDto` and `CreateDepartmentUserDto` (their Update variants extend them via `OmitType` and auto-inherit) because those DTOs are passed through `UserDataMapper.toEntity` / `toEntityForUpdate`*

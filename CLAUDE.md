# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HAL-ERP is an Enterprise Resource Planning system built with **NestJS** and **TypeScript**, following **Domain-Driven Design (DDD)** principles with **CQRS** (Command Query Responsibility Segregation) pattern.

## Development Commands

```bash
# Build
pnpm run build

# Development (with hot reload)
pnpm run start:dev

# Production
pnpm run start:prod

# Testing
pnpm run test              # Unit tests
pnpm run test:e2e          # End-to-end tests
pnpm run test:cov          # Tests with coverage
pnpm run test:watch        # Watch mode
pnpm run test -- <path>    # Run specific test file (e.g., pnpm run test -- user.service.spec.ts)

# Database migrations
pnpm run migration:generate   # Generate migration from schema changes
pnpm run migration:run        # Run pending migrations
pnpm run migration:revert     # Revert last migration

# Database seeding
pnpm run db:seed

# Code quality
pnpm run lint              # Lint and auto-fix
pnpm run format            # Format with Prettier
```

## Architecture Overview

<<<<<<< HEAD
This is a **NestJS ERP system** following **Domain-Driven Design (DDD)** with **Clean Architecture** and **CQRS** patterns.

### Layer Structure

Each business module follows this three-layer structure:

```
src/modules/{module-name}/
├── application/                # Application services, use cases, CQRS handlers
│   ├── commands/              # Write operations (create, update, delete)
│   ├── queries/               # Read operations (get, list, search)
│   ├── services/              # Application services
│   ├── dto/                   # Data transfer objects (validation)
│   └── mappers/               # Map between entities and DTOs
├── domain/                    # Core business logic (no external dependencies)
│   ├── entities/              # Domain entities with business rules
│   ├── events/                # Domain events for cross-module communication
│   ├── repositories/          # Repository interfaces (contracts)
│   └── value-objects/         # Value objects (immutable)
└── infrastructure/            # External concerns
    ├── repositories/          # TypeORM repository implementations
    └── external/              # External API integrations
```

### Common Layer

`src/common/` contains shared functionality:

- **application/** - Global decorators, guards, interceptors, filters, pipes
- **domain/** - Base entities, domain events, value objects
- **infrastructure/** - Database, AWS S3, authentication, i18n, pagination

### Key Architectural Patterns

1. **CQRS** - Separate command (write) and query (read) handlers in `application/commands/` and `application/queries/`
2. **Repository Pattern** - Interfaces in `domain/repositories/`, implementations in `infrastructure/repositories/`
3. **Dependency Inversion** - Domain layer defines interfaces, infrastructure implements them
4. **Multi-Company Support** - All operations scoped to a company with data isolation

### Module Organization

Two main modules:

- **manage/** - Core business operations (users, organizations, procurement, budget, documents)
- **reports/** - Reporting and export functionality

## Import Path Aliases

```typescript
import { X } from '@src/modules/...'; // Points to src/
import { Y } from '@common/...'; // Points to src/common/
```

## Technology Stack

- **Framework**: NestJS 10.x with TypeScript
- **Database**: PostgreSQL with TypeORM 0.3.x
- **Authentication**: JWT via `@core-system/auth` package
- **Validation**: class-validator + class-transformer
- **File Storage**: AWS S3 + CloudFront
- **i18n**: nestjs-i18n (translation files in `assets/i18n/`)
- **Testing**: Jest

## Key Conventions

### Naming

- Controllers, Services, Repositories: PascalCase (e.g., `UserService`)
- Files: kebab-case directories, PascalCase files
- Repository interfaces: `{name}-repository.interface.ts`
- Repository implementations: `read.repository.ts`, `write.repository.ts` (or just `{name}.repository.ts`)

### Database Entities

- Use TypeORM decorators (`@Entity`, `@Column`, etc.)
- Soft deletes enabled (use `@DeleteDateColumn`)
- Timestamps with `@CreateDateColumn` and `@UpdateDateColumn`
- Multi-tenant: include `company_id` where applicable

### Validation

- DTOs use `class-validator` decorators
- Use `@IsDefined()`, `@IsString()`, `@IsOptional()`, etc.
- Auto-validation enabled globally via ValidationPipe

### Error Handling

- Use domain-specific exceptions in `application/exceptions/`
- Global exception filter with i18n support
- Standardized error response format

### Company Context

- Most operations require company scoping
- Use guards/decorators to extract company from JWT
- Filter queries by company_id automatically

## Database Migration Workflow

1. Modify entities in `src/modules/*/domain/entities/` or `src/common/infrastructure/database/entities/`
2. Generate migration: `pnpm run migration:generate`
3. Review generated migration file in `src/common/infrastructure/database/migrations/`
4. Apply migration: `pnpm run migration:run`

## Testing Guidelines

- Unit tests: co-located with source files as `*.spec.ts`
- E2E tests: in `test/` directory
- Test configuration: `jest.config.js` and `test/jest-e2e.json`
- Use Jest's mocking for external dependencies

## Important Files

- `src/main.ts` - Application entry point
- `src/app.module.ts` - Root module
- `src/common/infrastructure/database/data-source.ts` - TypeORM data source configuration
- `.env` - Environment variables (use `.env.example` as template)
- `nest-cli.json` - NestJS CLI configuration (watch assets for i18n changes)

## External Dependencies

- **@core-system/auth** - External authentication package for JWT validation
- **Approval API** - External approval workflow service (configured via env vars)
- **AWS S3** - File storage for uploads and documents
- **Redis** - Caching layer (optional)

## Security Notes

- JWT-based authentication via `@core-system/auth`
- Role-based access control (RBAC) with permissions
- Company-level data isolation (multi-tenancy)
- Input validation on all endpoints
- File upload restrictions (type, size)
- # Guards protect protected routes

### DDD + CQRS Structure

The codebase is organized into two main modules (`manage` and `reports`), each following a strict three-layer architecture:

**Module Structure Pattern:**

```
src/modules/{module-name}/
├── application/          # CQRS handlers, services, DTOs, mappers
│   ├── commands/        # Write operations (create, update, delete)
│   ├── queries/         # Read operations
│   ├── services/        # Business logic orchestration
│   ├── dto/            # Data transfer objects
│   ├── mappers/        # Entity-DTO transformations
│   └── providers/      # Application-level providers
├── domain/             # Business entities and value objects
│   ├── entities/       # Domain entities with behavior
│   ├── value-objects/  # Immutable value types
│   └── exceptions/     # Domain-specific exceptions
├── infrastructure/     # External concerns
│   ├── repositories/   # Data access implementations
│   └── module/         # NestJS module definition
└── controllers/        # HTTP endpoints
```

**Common Layer** (`src/common/`) mirrors this structure with shared domain, application, and infrastructure concerns.

### Key Architectural Patterns

1. **Dual Database Connections**: Read/write separation using two TypeORM connections:
   - `WRITE_CONNECTION` (write operations)
   - `READ_CONNECTION` (query operations)
   - Inject connections using `@InjectDataSource(process.env.WRITE_CONNECTION_NAME)` or `READ_CONNECTION_NAME`

2. **CQRS Implementation**:
   - Commands handle state changes (create, update, delete)
   - Queries handle data retrieval
   - Each command/query has a dedicated handler in `application/{commands|queries}/*/handler/*.handler.ts`

3. **Dependency Injection**:
   - Uses Symbol-based tokens for dependency injection
   - Example: `WRITE_USER_REPOSITORY = Symbol('WRITE_USER_REPOSITORY')`
   - Repositories abstract data access
   - Services orchestrate business logic
   - Mappers convert between entities and DTOs

4. **Transaction Management**:
   - `ITransactionManagerService` handles database transactions
   - Use `transactionManager.execute()` for operations requiring atomicity
   - Transactions work with the WRITE connection only

### Path Aliases

- `@src/*` → `src/*`
- `@common/*` → `src/common/*`

## Technology Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT via `@core-system/auth` package
- **Internationalization**: nestjs-i18n (supports English, Lao)
- **File Storage**: AWS S3 with CloudFront CDN
- **Email**: NestJS Mailer
- **Image Processing**: Sharp
- **Excel Export**: ExcelJS
- **Validation**: class-validator + class-transformer
- **Testing**: Jest

## Configuration

Key environment variables (`.env`):

```bash
# Database
WRITE_CONNECTION_NAME=default
WRITE_DB_HOST=localhost
WRITE_DB_PORT=5432
WRITE_DB_USERNAME=postgres
WRITE_DB_PASSWORD=...
WRITE_DB_NAME=erp-db

READ_CONNECTION_NAME=default
READ_DB_HOST=localhost
# ... (same structure as WRITE)

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-southeast-2
AWS_S3_BUCKET_NAME=...
AWS_DISTRIBUTIONS_ID=...

# External APIs
APPROVAL_API_URL=...
APPROVAL_SECRET_KEY=...
```

## Application Setup

- **API Prefix**: `/api`
- **Static Files**: Served from `/assets` (stored in `assets/uploads/`)
- **CORS**: Enabled for all origins
- **Validation**: Global pipe with auto-transformation and whitelisting
- **Error Handling**: Custom i18n exception filter with localized messages

### Global Guards & Interceptors

- **JwtAuthGuard**: JWT authentication on all endpoints
- **PermissionGuard**: Role-based authorization check
- **AuthUserInterceptor**: Injects authenticated user into request context
- **TransformResponseInterceptor**: Standardizes API response format

## Business Domains

The `manage` module handles core ERP operations:

- User management (companies, departments, users, roles, permissions)
- Financial management (budget accounts, items, approval rules)
- Procurement (purchase requests, purchase orders, vendors, products)
- Document management with approval workflows
- Configuration (currencies, VAT, exchange rates, units)

The `reports` module handles reporting and analytics.

## Development Guidelines

1. **Follow CQRS**: Separate read (queries) and write (commands) operations
2. **Use correct connection**: Inject `WRITE_CONNECTION` for mutations, `READ_CONNECTION` for queries
3. **Domain-first**: Place business logic in domain entities, not in services or handlers
4. **DTOs for boundaries**: Use DTOs for all inputs/outputs; map to/from entities in mappers
5. **Localization**: All error messages should support i18n (English/Lao)

## Adding New Features

When adding a new feature to a module:

1. **Domain Layer**: Create entity in `domain/entities/`
2. **Application Layer**:
   - Create command/query handlers in `application/commands/` or `application/queries/`
   - Create DTOs in `application/dto/`
   - Create mapper in `application/mappers/`
   - Add service if needed in `application/services/`
3. **Infrastructure Layer**: Add repository in `infrastructure/repositories/`
4. **Controller**: Add endpoint in `controllers/`
5. **Module**: Register in `infrastructure/module/{module}.module.ts`
   > > > > > > > 3f85b7d (update)

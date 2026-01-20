# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Manager
This project uses **pnpm** (not npm or yarn).

```bash
pnpm install                    # Install dependencies
```

### Running the Application
```bash
pnpm run start:dev              # Start development server with hot reload
pnpm run start:debug            # Start with debug mode
pnpm run build                  # Compile TypeScript to dist/
pnpm run start:prod             # Run production build
```

### Testing
```bash
pnpm run test                   # Run unit tests
pnpm run test:e2e               # Run end-to-end tests
pnpm run test:cov               # Run tests with coverage
pnpm run test:watch             # Watch mode for tests
pnpm run test -- <path/to/test> # Run specific test file
```

### Database Operations
```bash
pnpm run migration:generate     # Generate new migration (creates file in src/common/infrastructure/database/migrations/)
pnpm run migration:run          # Apply pending migrations
pnpm run migration:revert       # Rollback last migration
pnpm run db:seed                # Seed database with initial data
```

### Code Quality
```bash
pnpm run lint                   # Lint and auto-fix TypeScript files
pnpm run format                 # Format code with Prettier
```

### Production Deployment
```bash
pnpm run deploy                 # Deploy to main server (134.209.101.30)
pnpm run deploy-hal-group       # Deploy to HAL Group server (139.59.227.188)
```

## Architecture Overview

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
import { X } from '@src/modules/...'      // Points to src/
import { Y } from '@common/...'           // Points to src/common/
```

## Technology Stack

- **Framework**: NestJS 10.x with TypeScript
- **Database**: PostgreSQL with TypeORM 0.3.x
- **Authentication**: JWT via `@core-system/auth` package
- **Validation**: class-validator + class-transformer
- **File Storage**: AWS S3 + CloudFront
- **i18n**: nestjs-i18n (translation files in `src/common/infrastructure/localization/i18n/`)
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
- Test configuration: `jest.config.js` (embedded in package.json) and `test/jest-e2e.json`
- Use Jest's mocking for external dependencies
- Run specific test: `pnpm run test -- path/to/test.spec.ts`

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
- Guards protect protected routes

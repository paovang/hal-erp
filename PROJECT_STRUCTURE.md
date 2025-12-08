# HAL ERP System - Project Structure Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Directory Structure](#directory-structure)
4. [Core Modules](#core-modules)
5. [Technology Stack](#technology-stack)
6. [Database Design](#database-design)
7. [API Structure](#api-structure)
8. [Security](#security)
9. [Development Guide](#development-guide)
10. [Deployment](#deployment)

## Overview

HAL ERP is a comprehensive Enterprise Resource Planning system built with NestJS following Domain-Driven Design (DDD) principles. The system provides modular business management capabilities including procurement, budget management, user administration, and reporting.

### Key Features
- 🏢 Multi-company support with data isolation
- 🔄 Configurable approval workflows
- 📊 Comprehensive reporting module
- 🌐 Multi-language support (i18n)
- ☁️ Cloud storage integration (AWS S3)
- 🔒 Role-based access control (RBAC)
- 📱 RESTful API architecture

## Architecture

### Architectural Patterns
- **Clean Architecture** - Clear separation of concerns
- **Domain-Driven Design (DDD)** - Business-centric modeling
- **CQRS** - Command Query Responsibility Segregation
- **Modular Design** - Feature-based organization

### Layer Structure
```
┌─────────────────────────────────────┐
│           Presentation Layer        │  (Controllers)
├─────────────────────────────────────┤
│         Application Layer          │  (Use Cases)
├─────────────────────────────────────┤
│            Domain Layer             │  (Entities & Logic)
├─────────────────────────────────────┤
│       Infrastructure Layer         │  (DB, External APIs)
└─────────────────────────────────────┘
```

## Directory Structure

```
hal-erp/
├── src/                              # Source code
│   ├── common/                       # Shared components
│   │   ├── application/              # Application layer
│   │   │   ├── decorators/           # Custom decorators
│   │   │   ├── dto/                  # Data transfer objects
│   │   │   ├── exceptions/           # Custom exceptions
│   │   │   ├── filters/              # Exception filters
│   │   │   ├── guards/               # Auth guards
│   │   │   ├── interceptors/         # Request interceptors
│   │   │   └── pipes/                # Validation pipes
│   │   ├── domain/                   # Domain entities
│   │   │   ├── entities/             # Base entities
│   │   │   ├── events/               # Domain events
│   │   │   └── value-objects/        # Value objects
│   │   ├── infrastructure/           # Infrastructure
│   │   │   ├── auth/                 # Authentication
│   │   │   ├── aws3/                 # AWS S3 integration
│   │   │   ├── database/             # Database setup
│   │   │   │   ├── entities/         # TypeORM entities
│   │   │   │   ├── migrations/       # DB migrations
│   │   │   │   └── seeds/            # Seed data
│   │   │   ├── localization/         # i18n
│   │   │   └── pagination/           # Pagination helpers
│   │   └── utils/                    # Utility functions
│   ├── modules/                      # Business modules
│   │   ├── manage/                   # Management operations
│   │   │   ├── application/          # Application layer
│   │   │   │   ├── commands/         # Write operations
│   │   │   │   ├── queries/          # Read operations
│   │   │   │   ├── services/         # Business services
│   │   │   │   ├── dto/              # Module DTOs
│   │   │   │   └── mappers/          # Data mappers
│   │   │   ├── domain/               # Domain logic
│   │   │   │   ├── entities/         # Domain entities
│   │   │   │   ├── events/           # Domain events
│   │   │   │   ├── repositories/     # Repository interfaces
│   │   │   │   └── services/         # Domain services
│   │   │   ├── infrastructure/       # Infrastructure
│   │   │   │   ├── repositories/     # Repository implementations
│   │   │   │   └── external/         # External API integrations
│   │   │   └── presentation/         # API layer
│   │   │       └── http/             # HTTP controllers
│   │   └── reports/                  # Reporting module
│   │       └── [Similar structure to manage module]
│   └── main.ts                       # Application entry point
├── assets/                           # Static files
│   └── uploads/                      # User uploads
├── test/                             # Test files
├── dist/                             # Compiled output
├── .env                              # Environment variables
├── .env.example                      # Environment template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── nest-cli.json                     # NestJS config
└── pnpm-lock.yaml                    # Lock file
```

## Core Modules

### 1. Manage Module (`/src/modules/manage/`)

#### User Management
- **Users**: Complete CRUD operations with role assignments
- **Roles**: Role definitions with permission sets
- **Permissions**: Granular permission system
- **User Types**: Categorization of user accounts

#### Organization Structure
- **Companies**: Multi-company support with isolation
- **Departments**: Organizational hierarchy
- **Positions**: Job positions within departments
- **Department Users**: Assignment tracking

#### Procurement Management
- **Purchase Requests**: Request creation and tracking
- **Purchase Orders**: Order generation and management
- **Vendors**: Supplier management with products
- **Receipts**: Goods receipt processing

#### Budget Management
- **Budget Accounts**: Budget allocation by account
- **Budget Items**: Line item budget tracking
- **Approval Rules**: Configurable approval workflows

#### Document Management
- **Documents**: Digital document storage
- **Approval Workflows**: Multi-step approval processes
- **Attachments**: File attachment support
- **Digital Signatures**: Electronic signature capability

#### Master Data
- **Products/Items**: Product catalog management
- **Categories**: Hierarchical categorization
- **Units of Measure**: Standardized units
- **Currencies**: Multi-currency support
- **VAT Rates**: Tax configuration

### 2. Reports Module (`/src/modules/reports/`)

#### Report Types
- **Procurement Reports**: Purchase analysis
- **Receipt Reports**: Financial tracking
- **Company Reports**: Multi-company reporting
- **Export Capabilities**: Excel/PDF generation

## Technology Stack

### Backend Framework
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Express** - HTTP server framework

### Database & ORM
- **TypeORM** - Object-relational mapping
- **PostgreSQL** - Primary database
- **Connection Pooling** - Read/write separation

### Authentication & Security
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **RBAC** - Role-based access control
- **Helmet** - Security headers

### External Integrations
- **AWS S3** - File storage
- **AWS CloudFront** - CDN delivery
- **Redis** - Caching layer
- **Approval API** - External workflow service

### Development Tools
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Swagger** - API documentation
- **pnpm** - Package manager

## Database Design

### Entity Relationships

#### User Management
```
Users ──┬── UserRoles ──┬── Roles ──┬── RolePermissions
        │               │          └── Permissions
        └── Companies
```

#### Organizational Structure
```
Companies ── Departments ── Positions
     │              │           │
     └───── Department Users ──┘
```

#### Procurement Flow
```
Purchase Requests ── Purchase Orders ── Receipts
       │                   │             │
       └── Request Items ──┴── Order Items ──┴── Receipt Items
```

#### Document Workflow
```
Documents ── Document Types
     │
     ├── Document Attachments
     ├── Document Approvals
     └── Approval Workflows ── Workflow Steps
```

### Key Features
- **Soft Deletes**: Audit trail preservation
- **Timestamps**: Created/updated tracking
- **Company Isolation**: Multi-tenant data separation
- **Migration System**: Version-controlled schema updates

## API Structure

### Base Configuration
- **Global Prefix**: `/api`
- **Version**: API versioning support
- **CORS**: Cross-origin resource sharing enabled
- **Rate Limiting**: Request throttling capabilities

### Standard Endpoints

#### CRUD Operations
```typescript
GET    /api/resource              # List with pagination
POST   /api/resource              # Create new
GET    /api/resource/:id          # Get by ID
PUT    /api/resource/:id          # Update
DELETE /api/resource/:id          # Soft delete
PATCH  /api/resource/:id/activate # Activate/Deactivate
```

#### Authentication
```typescript
POST   /api/auth/login            # User login
POST   /api/auth/logout           # User logout
GET    /api/auth/profile          # Get current user
PUT    /api/auth/profile          # Update profile
```

#### File Management
```typescript
POST   /api/upload                # Upload files
GET    /api/assets/:filename      # Serve files
```

#### Reports
```typescript
GET    /api/reports/purchase-request
GET    /api/reports/purchase-order
GET    /api/reports/receipt/company
POST   /api/reports/export        # Export to Excel/PDF
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": {...},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## Security

### Authentication Flow
1. User submits credentials to `/api/auth/login`
2. Server validates and returns JWT token
3. Client includes token in `Authorization: Bearer <token>` header
4. JWT guard validates token on protected routes

### Authorization
- **Role-Based**: Users assigned to roles
- **Permission-Based**: Granular permissions on actions
- **Resource-Based**: Company-level data isolation

### Security Measures
- Input validation with class-validator
- SQL injection prevention via TypeORM
- XSS protection with sanitization
- File upload restrictions
- Rate limiting on sensitive endpoints

## Development Guide

### Setup Instructions

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # Run migrations
   pnpm run migration:run

   # Seed initial data
   pnpm run seed:run
   ```

4. **Start Development Server**
   ```bash
   pnpm run start:dev
   ```

### Common Commands

```bash
# Development
pnpm run start:dev          # Start with hot reload
pnpm run start:debug        # Start with debug mode

# Building
pnpm run build             # Compile TypeScript
pnpm run start:prod        # Run production build

# Database
pnpm run migration:generate # Create new migration
pnpm run migration:run     # Apply migrations
pnpm run migration:revert  # Rollback migration

# Testing
pnpm run test              # Run unit tests
pnpm run test:e2e          # Run e2e tests
pnpm run test:cov          # Run with coverage
```

### Code Style
- ESLint configuration for code quality
- Prettier for consistent formatting
- Husky hooks for pre-commit checks
- Conventional commits for changelog

## Deployment

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=hal_erp

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# AWS
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# External APIs
APPROVAL_API_URL=https://api.example.com
APPROVAL_API_KEY=your-api-key
```

### Production Checklist
- [ ] Set production environment variables
- [ ] Run database migrations
- [ ] Build the application: `pnpm run build`
- [ ] Configure reverse proxy (nginx)
- [ ] Set up SSL certificates
- [ ] Configure monitoring and logging
- [ ] Set up backup strategies

### Docker Support
Docker configuration can be added for containerized deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["node", "dist/main"]
```

## Best Practices

### Code Organization
- Keep modules loosely coupled
- Use dependency injection
- Implement repository pattern
- Separate business logic from infrastructure

### Performance
- Use database indexes effectively
- Implement pagination for large datasets
- Cache frequently accessed data
- Optimize database queries

### Security
- Validate all inputs
- Sanitize outputs
- Use parameterized queries
- Implement proper error handling

### Testing
- Write unit tests for business logic
- Use integration tests for APIs
- Mock external dependencies
- Maintain test coverage above 80%

---

This documentation provides a comprehensive overview of the HAL ERP system's structure, architecture, and development guidelines. For more detailed information about specific modules or features, refer to the respective module documentation or source code comments.
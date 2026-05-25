# Hire Me — Marketplace Platform

A complete marketplace platform connecting customers with service workers. Built as a monorepo with an internal operations dashboard, public customer-facing web app, and a robust NestJS API backend.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [User Flows](#user-flows)
- [API Structure](#api-structure)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)

## 🎯 Overview

**Hire Me** is a three-sided marketplace platform:

1. **Customers** - Post jobs, browse workers, and hire services through the web application
2. **Workers** - Provide services, receive job assignments, and manage their profiles
3. **Admins** - Manage the platform, approve workers, oversee jobs, and handle content through the dashboard

### Key Features

- **Phone-based Authentication** - SMS OTP verification for secure, passwordless login (for customers/workers)
- **Multi-role System** - Three distinct roles (admin, customer, worker) with separate workflows
- **Worker Approval Workflow** - Admin review and approval system for new worker registrations
- **Job Marketplace** - Customers post jobs, admins assign to qualified workers
- **Service Catalog** - Managed services (plumbing, electrical, etc.) with worker specializations
- **Geographic Matching** - Location-based worker search and job assignment
- **Content Management** - Blog system for marketing and SEO

## 🏗️ Architecture

This is a **monorepo** using npm workspaces. Each application can be built and deployed independently.

## 🏗️ Architecture

This is a **monorepo** using npm workspaces. Each application can be built and deployed independently.

## Layout

| Path | Package | Description |
|------|---------|-------------|
| `apps/dashboard` | `@hire-me/dashboard` | Vite + React internal team dashboard |
| `apps/web` | `@hire-me/web` | Next.js public / customer site |
| `apps/api` | `@hire-me/api` | NestJS REST API (Prisma, JWT auth) |
| `packages/types` | `@hire-me/types` | Shared domain types (Worker, Job, DashboardUser, …) |
| `packages/config-typescript` | `@hire-me/config-typescript` | Optional shared `tsconfig` bases |
| `packages/api-client` | `@hire-me/api-client` | Shared HTTP helpers (`apiFetch`, error parsing) |

## 🛠️ Tech Stack

### Frontend
- **Dashboard**: React 18 + Vite + TypeScript + TailwindCSS + Radix UI
- **Web App**: Next.js 14 (App Router) + TypeScript + TailwindCSS + Radix UI
- **State Management**: React Context API
- **Forms**: Native React state with validation
- **HTTP Client**: Shared `api-client` package with centralized error handling

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with Passport.js
- **Authorization**: Role-based access control (RBAC) with custom guards
- **SMS**: Twilio integration for phone OTP verification
- **File Uploads**: Multer for avatar and document handling

### DevOps
- **Package Manager**: npm workspaces
- **Build Tools**: Vite (dashboard), Next.js (web), TypeScript compiler (API)
- **Database Migrations**: Prisma Migrate
- **Environment**: `.env` files per application

## 📊 Database Schema

### Core Models

#### User (Authentication)
Primary authentication entity for all users (admins, customers, workers).

```
- id: UUID (primary key)
- phone: String (unique, nullable) - Primary identifier for customers/workers
- email: String (unique) - Required for all users
- passwordHash: String
- name: String
- role: Enum (admin | customer | worker)
- status: Enum (active | invited)
- phoneVerified: Boolean
- emailVerified: Boolean
- phoneOTP & phoneOTPExpiry: SMS verification fields
```

**Relations**:
- `workerProfile`: One-to-one with Worker (for role=worker)
- `customerProfile`: One-to-one with Customer (for role=customer)
- `customerJobs`: One-to-many with Job (jobs created by customer)
- `blogPosts`: One-to-many with BlogPost (for admin authors)

#### Worker (Service Provider Profile)
Extended profile for workers providing services.

```
- id: UUID (primary key)
- workerId: String (unique, e.g., "W-1234567890-abcd")
- name: String
- phone: String
- location: String
- service: String (denormalized service labels)
- status: Enum (active | not_active | on_hold | canceled)
- approvalStatus: Enum (pending | approved | rejected | suspended) - Admin workflow
- internalRating: Float (0-5)
- customerRating: Float (0-5)
- siteServiceIds: String[] - Multiple service capabilities
- userId: String (nullable) - Link to User authentication
```

**Key Features**:
- **Approval Workflow**: New workers start with `approvalStatus: pending` and must be reviewed by admins
- **Multi-service Support**: Workers can offer multiple services via `siteServiceIds[]`
- **Dual Status System**: 
  - `status`: Operational availability (active/not-active)
  - `approvalStatus`: Admin review status (pending/approved/rejected)

#### Customer (Job Poster Profile)
Extended profile for customers posting jobs.

```
- id: UUID (primary key)
- userId: String (nullable) - Link to User authentication
- customerType: Enum (individual | residential | commercial)
- preferredLocation: String
- preferredServices: String[]
- totalJobsPosted: Int
- totalSpent: Decimal
- reputationScore: Float
- billingAddress: String
- communicationPref: String (default: "whatsapp")
```

#### Job (Work Request)
Jobs posted by customers and assigned to workers.

```
- id: UUID (primary key)
- jobId: String (unique, e.g., "J-1234567890-xyz")
- summary: String
- service: String
- area: String
- status: Enum (pending | in_progress | completed | cancelled)
- assignedWorker: String
- customerUserId: String (nullable) - Link to User who created job
- siteServiceId: String (nullable) - Service category
- latitude/longitude: Float (optional) - Geo coordinates for matching
```

#### SiteService (Service Catalog)
Managed list of services offered on the platform.

```
- id: UUID (primary key)
- serviceKey: String (unique, e.g., "SS-01") - Immutable reference
- slug: String (unique) - URL-friendly identifier
- title: String (e.g., "Plumbing Services")
- shortDescription: String
- iconKey: String
- iconImageUrl: String (nullable)
- sortOrder: Int
- isActive: Boolean
```

**Relations**:
- `workers`: Many workers can offer this service
- `jobs`: Many jobs can be tagged with this service

#### BlogPost (Content Management)
Marketing and SEO content managed by admins.

```
- id: UUID (primary key)
- slug: String (unique)
- title: String
- excerpt: String
- bodyMarkdown: String
- status: Enum (draft | published)
- authorId: String - Link to User (admin)
- authorName: String
- publishedAt: DateTime (nullable)
```

## 🔐 Authentication & Authorization

### Authentication Methods

**Dashboard (Admins)**
- Email + password authentication
- JWT token-based sessions
- Login endpoint: `POST /auth/login`

**Web App (Customers & Workers)**
- Phone-based authentication with SMS OTP
- Two-step process:
  1. `POST /auth/send-phone-otp` - Send verification code
  2. `POST /auth/verify-phone-otp` - Verify code and receive JWT
- Registration: `POST /auth/register` (creates User + Customer/Worker profile)

### JWT Payload Structure

```typescript
interface JwtPayload {
  sub: string        // User ID
  email: string
  role: 'admin' | 'customer' | 'worker'
  workerApproved: boolean  // For role=worker, derived from Worker.approvalStatus
}
```

### Authorization (Role-Based Access Control)

**Guards**:
- `AuthGuard('jwt')` - Validates JWT token
- `RolesGuard` - Checks user role against required roles
- `@Roles('admin')` decorator - Restricts endpoint to specific roles

**API Endpoint Protection Patterns**:

```typescript
// Admin-only endpoints
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Controller('users')
class UsersController { }

// Customer-only endpoints  
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('customer')
@Controller('marketplace/customer')
class CustomerMarketplaceController { }

// Worker-only endpoints
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('worker')  
@Controller('marketplace/worker')
class WorkerMarketplaceController { }
```

**Access Matrix**:

| Resource | Admin | Customer | Worker |
|----------|-------|----------|--------|
| Dashboard (users, workers, customers, jobs, blog, services) | ✅ Full | ❌ | ❌ |
| Post New Job | ✅ | ✅ | ❌ |
| View Own Jobs | ✅ | ✅ | ❌ |
| View Assigned Jobs | ✅ | ❌ | ✅ (pending approval) |
| Browse Nearby Workers | ✅ | ✅ | ❌ |
| Edit Worker Profile | ✅ | ❌ | ✅ (own profile) |
| Edit Customer Profile | ✅ | ✅ (own profile) | ❌ |
| Approve Workers | ✅ | ❌ | ❌ |

## 🔄 User Flows

### 1. Customer Registration & Job Posting

```
1. Customer visits web app → /signup
2. Enters phone number
3. Receives SMS OTP → enters code at /verify-phone
4. Creates account (email, password, name)
   - API creates User (role=customer) + Customer profile
5. Redirects to customer dashboard → /customer
6. Customer creates new job → /customer/jobs/new
   - Fills form: service, location, description
   - API creates Job with status=pending
7. Admin assigns worker in dashboard
8. Customer receives notification (future: email/SMS)
```

### 2. Worker Registration & Approval

```
1. Worker visits web app → /signup
2. Enters phone number
3. Receives SMS OTP → enters code at /verify-phone
4. Creates account (email, password, name, services, location)
   - API creates User (role=worker) + Worker profile
   - Worker.approvalStatus = 'pending'
5. Worker sees "Pending Approval" page → /worker/pending
   - Cannot access worker features until approved
6. Admin reviews in dashboard → /workers
   - Views worker details
   - Sets approvalStatus to 'approved' or 'rejected'
7. Worker can now log in and access features
   - JWT contains workerApproved=true
8. Worker dashboard shows assigned jobs
```

### 3. Admin Workflow - Worker Management

```
1. Admin logs in to dashboard → /login
2. Navigates to Workers → /workers
3. Sees list with Status and Approval columns
   - Filter by approvalStatus: pending, approved, rejected
4. Clicks worker → /workers/:id
5. Reviews profile, ratings, services
6. Edits worker → /workers/:id/edit
   - Can change approvalStatus
   - Can update status (active, not-active, on-hold)
   - Can edit ratings, services, location
7. Saves → Success message shown on page
8. Worker immediately affected (login reflects approval)
```

### 4. Admin Workflow - Job Assignment

```
1. Admin sees new job in Jobs list → /jobs
   - Status: pending, no assigned worker
2. Clicks job → /jobs/:id
3. Clicks Edit → /jobs/:id/edit
4. Selects worker from dropdown (filtered by service)
5. Changes status to 'in_progress'
6. Saves → Job assigned
7. Worker sees job in their dashboard (future)
```

## 🌐 API Structure

### Base URLs

- **Development**: `http://localhost:4000`
- **Production**: Set via `API_URL` environment variable

### API Modules & Endpoints

#### Auth Module (`/auth`)
Authentication and registration endpoints.

```typescript
POST   /auth/login                  // Email + password (admin/customer/worker)
POST   /auth/register               // Create new customer or worker account
POST   /auth/send-phone-otp         // Send SMS OTP to phone number
POST   /auth/verify-phone-otp       // Verify OTP and receive JWT
```

#### Users Module (`/users`) - Admin only
Dashboard user management (admin accounts).

```typescript
GET    /users                       // List all users
GET    /users/:id                   // Get user by ID
POST   /users                       // Create new user
PATCH  /users/:id                   // Update user
DELETE /users/:id                   // Delete user
```

#### Workers Module (`/workers`) - Admin only
Worker profile management.

```typescript
GET    /workers                     // List all workers
GET    /workers/:id                 // Get worker by ID  
POST   /workers                     // Create new worker
PATCH  /workers/:id                 // Update worker (includes approvalStatus)
DELETE /workers/:id                 // Delete worker
```

#### Customers Module (`/customers`) - Admin only
Customer profile management.

```typescript
GET    /customers                   // List all customers
GET    /customers/:id               // Get customer by ID
PATCH  /customers/:id               // Update customer profile
```

#### Jobs Module (`/jobs`) - Admin + Customer
Job posting and management.

```typescript
GET    /jobs                        // List all jobs (admin) or own jobs (customer)
GET    /jobs/:id                    // Get job by ID
POST   /jobs                        // Create new job (customer or admin)
PATCH  /jobs/:id                    // Update job (admin or job owner)
DELETE /jobs/:id                    // Delete job (admin only)
```

#### Marketplace Module (`/marketplace`)
Public and authenticated marketplace endpoints.

```typescript
// Public
GET    /marketplace/services        // List active services

// Customer-only  
GET    /marketplace/customer/nearby-workers  // Find workers by location & service

// Worker-only
GET    /marketplace/worker/jobs     // View assigned jobs (future)
```

#### Site Services Module (`/site-services`) - Admin only
Service catalog management.

```typescript
GET    /site-services               // List all services
GET    /site-services/:id           // Get service by ID
POST   /site-services               // Create new service
PATCH  /site-services/:id           // Update service
DELETE /site-services/:id           // Delete service
```

#### Blog Module (`/blog`) - Admin write, Public read
Content management.

```typescript
// Public
GET    /blog                        // List published posts
GET    /blog/:slug                  // Get post by slug

// Admin-only
POST   /blog                        // Create new post
PATCH  /blog/:id                    // Update post
DELETE /blog/:id                    // Delete post
```

### Data Mappers

The API uses mapper functions to convert between Prisma database models and API/dashboard types:

- `workerToApi()` - Prisma Worker → API Worker (converts snake_case enums)
- `jobToApi()` - Prisma Job → API Job
- `customerToApi()` - Prisma Customer + User → API Customer (merged data)
- `workerStatusFromApi()` - API status string → Prisma enum
- `customerTypeFromApi()` - API type string → Prisma enum

**Example**:
```typescript
// Database: WorkerStatus.not_active
// API/Dashboard: "not-active"
// Mapper handles conversion both ways
```

## 🚀 Getting Started

| Path | Package | Description |
|------|---------|-------------|
| `apps/dashboard` | `@hire-me/dashboard` | Vite + React internal team dashboard |
| `apps/web` | `@hire-me/web` | Next.js public / customer site |
| `apps/api` | `@hire-me/api` | NestJS REST API (Prisma, JWT auth) |
| `packages/types` | `@hire-me/types` | Shared domain types (Worker, Job, DashboardUser, …) |
| `packages/config-typescript` | `@hire-me/config-typescript` | Optional shared `tsconfig` bases |
| `packages/api-client` | `@hire-me/api-client` | Shared HTTP helpers (`apiFetch`, error parsing) |

## 🚀 Getting Started

## Requirements

- Node 20+
- PostgreSQL database
- Twilio account (for SMS OTP)

## Environment variables

Do **not** commit real secrets. Copy each app's template and fill in values locally:

| App | Template |
|-----|----------|
| API | [`apps/api/.env.example`](apps/api/.env.example) |
| Web | [`apps/web/.env.example`](apps/web/.env.example) |
| Dashboard | [`apps/dashboard/.env.example`](apps/dashboard/.env.example) |

**Critical Environment Variables**:

### API (`apps/api/.env`)
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/hiremedb"
JWT_SECRET="your-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"
CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Dashboard (`apps/dashboard/.env`)
```bash
VITE_API_URL="http://localhost:4000"
```

### Web (`apps/web/.env`)
```bash
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

If a credential was ever committed to git history or shared in chat, **rotate it** in your database/hosting provider and treat the old value as compromised.

## Install

From the repository root:

```bash
npm install
```

npm hoists dependencies to the root `node_modules` and links workspace packages.

## Database Setup

```bash
# Navigate to API directory
cd apps/api

# Run migrations
npx prisma migrate dev

# Seed database with initial data
npm run seed

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

The seed script creates:
- Sample admin user
- Sample workers (with various approval statuses)
- Sample customers
- Sample jobs
- Site services (plumbing, electrical, etc.)

## Development - Run All Apps

From the repository root:

```bash
# Terminal 1 - API Server (port 4000)
npm run dev:api

# Terminal 2 - Dashboard (port 5173)  
npm run dev:dashboard

# Terminal 3 - Web App (port 3000)
npm run dev:web
```

Now you can access:
- **Dashboard**: http://localhost:5173 (admin login)
- **Web App**: http://localhost:3000 (customer/worker signup and login)
- **API**: http://localhost:4000 (REST endpoints)

## Scripts (run from root)

| Command | Action |
|---------|--------|
| `npm run dev` | Start the **dashboard** (same as `dev:dashboard`) |
| `npm run dev:dashboard` | Vite dev server |
| `npm run dev:web` | Next.js dev server (`apps/web`) |
| `npm run dev:api` | Nest API dev server (`apps/api`) |
| `npm run build` | `build` in every workspace that defines it |
| `npm run build:dashboard` | Production build for the dashboard |
| `npm run build:web` | Production build for the marketing site |
| `npm run build:api` | Production build for the API |
| `npm run lint` | Lint all workspaces that define `lint` |
| `npm run lint:api` | Lint the API |
| `npm run lint:web` | Lint the web app |
| `npm run lint:dashboard` | Lint the dashboard |
| `npm run test:api` | Run API tests |

Or run a script inside one app:

```bash
npm run dev --workspace=@hire-me/web
```

## 📁 Project Structure

### Apps

#### Dashboard (`apps/dashboard`)
React + Vite admin application for internal operations.

```
apps/dashboard/src/
├── components/
│   ├── domain/              # Business-specific components
│   │   ├── StatusBadges.tsx         # Worker/Job status badges
│   │   ├── CustomerBadges.tsx       # Customer type badges
│   │   ├── UserBadges.tsx           # User role badges
│   │   └── SiteServicePickCombobox.tsx
│   ├── layout/              # Layout components
│   │   ├── DashboardShell.tsx       # Main layout + sidebar
│   │   └── DataTable.tsx            # Reusable table component
│   └── ui/                  # Radix UI primitives (button, dialog, etc.)
├── layouts/
│   └── DashboardShell.tsx   # Sidebar navigation
├── pages/
│   ├── LoginPage.tsx
│   ├── users/               # Admin user management
│   │   ├── UsersListPage.tsx
│   │   ├── UserDetailPage.tsx
│   │   └── UserFormPage.tsx
│   ├── workers/             # Worker management
│   │   ├── WorkersListPage.tsx      # Filterable list + approval column
│   │   ├── WorkerDetailPage.tsx     # Full profile view
│   │   └── WorkerFormPage.tsx       # Edit form with approval dropdown
│   ├── customers/           # Customer management
│   │   ├── CustomersListPage.tsx
│   │   ├── CustomerDetailPage.tsx
│   │   └── CustomerFormPage.tsx
│   ├── jobs/                # Job management
│   │   ├── JobsListPage.tsx
│   │   ├── JobDetailPage.tsx
│   │   └── JobFormPage.tsx
│   ├── site-services/       # Service catalog
│   │   ├── SiteServicesListPage.tsx
│   │   └── SiteServiceFormPage.tsx
│   └── blog/                # Content management
│       ├── BlogListPage.tsx
│       └── BlogFormPage.tsx
├── providers/               # React Context providers
│   ├── AuthContext.tsx              # Auth state + login/logout
│   ├── OperationsDataContext.tsx    # Global data cache (workers, jobs, etc.)
│   └── BlogDataContext.tsx          # Blog posts state
├── routes/
│   └── ProtectedRoute.tsx   # Role-based route protection
├── lib/
│   ├── api.ts               # API client wrapper
│   └── dashboardHeader.ts   # Dynamic page titles
└── App.tsx                  # Route definitions
```

**Key Features**:
- Single-page application (SPA) with React Router
- Global state management via Context API
- Data fetching and caching in `OperationsDataContext`
- Role-based authentication (admin-only)
- Responsive design with TailwindCSS

#### Web App (`apps/web`)
Next.js customer and worker-facing application.

```
apps/web/src/
├── app/
│   ├── (auth)/              # Auth layout group
│   │   ├── layout.tsx               # Minimal auth header
│   │   ├── login/page.tsx           # Phone + OTP login
│   │   ├── signup/page.tsx          # Registration form
│   │   └── verify-phone/page.tsx    # OTP verification
│   ├── (main)/              # Public layout group
│   │   ├── layout.tsx               # Full site header + footer
│   │   ├── page.tsx                 # Homepage
│   │   └── privacy/page.tsx         # Privacy policy
│   ├── (marketplace)/       # Authenticated marketplace
│   │   ├── layout.tsx               # Marketplace header
│   │   ├── customer/
│   │   │   ├── layout.tsx           # Customer navigation
│   │   │   ├── page.tsx             # Customer dashboard
│   │   │   └── jobs/
│   │   │       ├── page.tsx         # My jobs list
│   │   │       └── new/page.tsx     # Post new job
│   │   └── worker/
│   │       ├── layout.tsx           # Worker navigation
│   │       └── page.tsx             # Worker dashboard
│   └── worker/
│       └── pending/page.tsx         # Approval pending page
├── components/
│   ├── auth/
│   │   ├── CustomerGate.tsx         # Require customer role
│   │   ├── WorkerGate.tsx           # Require worker role (+ approval)
│   │   ├── PhoneInput.tsx           # International phone input
│   │   ├── OTPInput.tsx             # 6-digit OTP input
│   │   ├── PasswordInput.tsx        # Password with toggle visibility
│   │   └── FormError.tsx            # Error message display
│   ├── domain/
│   │   └── JobServiceCombobox.tsx   # Service picker for jobs
│   ├── layout/
│   │   ├── SiteHeader.tsx           # Main navigation
│   │   ├── SiteHeaderAccount.tsx    # User dropdown menu
│   │   └── MobileTabBar.tsx         # Bottom navigation (mobile)
│   ├── providers/
│   │   └── WebProviders.tsx         # Client-side providers wrapper
│   └── ui/                  # Radix UI components
├── context/
│   └── WebAuthContext.tsx   # Auth state for web app
├── lib/
│   ├── api.ts               # API client (uses @hire-me/api-client)
│   ├── site-nav.ts          # Navigation menu configuration
│   └── formStyles.ts        # Shared form styling
└── layout.tsx               # Root layout
```

**Key Features**:
- Server-side rendering (SSR) with Next.js App Router
- Layout groups for different page types (auth, main, marketplace)
- Phone-based authentication flow
- Protected routes with role gates (`CustomerGate`, `WorkerGate`)
- Mobile-first responsive design
- Progressive enhancement

#### API (`apps/api`)
NestJS REST API with PostgreSQL and Prisma.

```
apps/api/src/
├── app.module.ts            # Root module - imports all feature modules
├── main.ts                  # Bootstrap and CORS config
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts           # Login, register, OTP endpoints
│   ├── auth.service.ts              # JWT + OTP logic
│   ├── jwt.strategy.ts              # Passport JWT strategy
│   └── dto/
│       ├── login.dto.ts
│       ├── register.dto.ts
│       ├── send-phone-otp.dto.ts
│       └── verify-phone-otp.dto.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts          # CRUD for dashboard users (admin-only)
│   ├── users.service.ts
│   └── dto/
├── workers/
│   ├── workers.module.ts
│   ├── workers.controller.ts        # Worker management (admin-only)
│   ├── workers.service.ts           # Includes approvalStatus updates
│   └── dto/
│       ├── create-worker.dto.ts
│       └── update-worker.dto.ts     # Has approvalStatus field
├── customers/
│   ├── customers.module.ts
│   ├── customers.controller.ts      # Customer management (admin-only)
│   ├── customers.service.ts         # Joins User data for display
│   └── dto/
│       └── update-customer.dto.ts
├── jobs/
│   ├── jobs.module.ts
│   ├── jobs.controller.ts           # Job CRUD (admin + customer)
│   ├── jobs.service.ts
│   └── dto/
├── marketplace/
│   ├── marketplace.module.ts
│   ├── marketplace.controller.ts    # Public service list, nearby workers
│   ├── marketplace.service.ts
│   └── dto/
│       └── nearby-query.dto.ts      # Geo search params
├── site-services/
│   ├── site-services.module.ts
│   ├── site-services.controller.ts  # Service catalog CRUD
│   ├── site-services.service.ts
│   └── site-services.repository.ts  # Data access layer
├── blog/
│   ├── blog.module.ts
│   ├── blog.controller.ts
│   └── blog.service.ts
├── common/
│   ├── guards/
│   │   └── roles.guard.ts           # RBAC guard implementation
│   ├── decorators/
│   │   ├── roles.decorator.ts       # @Roles() decorator
│   │   └── current-user.decorator.ts # @CurrentUser() decorator
│   ├── mappers/
│   │   └── domain.ts                # Prisma ↔ API type conversions
│   │       ├── workerToApi()
│   │       ├── customerToApi()
│   │       ├── jobToApi()
│   │       ├── workerStatusFromApi()
│   │       └── customerTypeFromApi()
│   └── prisma/
│       ├── prisma.module.ts
│       └── prisma.service.ts        # Prisma Client wrapper
└── prisma/
    ├── schema.prisma                # Database schema
    ├── seed.ts                      # Database seeding script
    └── migrations/                  # Migration history
```

**Architecture Patterns**:
- **Module-based**: Each feature is a self-contained NestJS module
- **Dependency Injection**: Services injected via constructor
- **Repository Pattern**: Some modules use dedicated repository classes
- **DTO Validation**: Uses `class-validator` for request validation
- **Guards & Decorators**: Reusable auth logic in common directory
- **Type Safety**: Shared types from `@hire-me/types` package

### Packages

#### `@hire-me/types`
Shared TypeScript interfaces and types.

```typescript
// packages/types/src/
├── index.ts             // Re-exports all types
├── user.ts              // User, DashboardRole
├── worker.ts            // Worker interface
├── customer.ts          // Customer interface (merged with User data)
├── job.ts               // Job interface
├── site-service.ts      // SiteService interface
└── blog.ts              // BlogPost interface
```

**Purpose**: Single source of truth for data contracts between API, dashboard, and web app.

#### `@hire-me/api-client`
Shared HTTP client utilities.

```typescript
// packages/api-client/src/
├── index.ts
├── client.ts            // apiFetch wrapper function
└── errors.ts            // ApiError class
```

**Features**:
- Centralized error handling
- Automatic JSON parsing
- Type-safe response handling
- Used by both dashboard and web apps

## 🔧 Development

### Adding a New Feature

**Example: Adding a "Reviews" feature**

1. **Database Schema** (`apps/api/prisma/schema.prisma`)
   ```prisma
   model Review {
     id         String   @id @default(uuid())
     jobId      String   @map("job_id")
     customerId String   @map("customer_id")
     workerId   String   @map("worker_id")
     rating     Int
     comment    String
     createdAt  DateTime @default(now())
     
     @@map("reviews")
   }
   ```

2. **Create Migration**
   ```bash
   cd apps/api
   npx prisma migrate dev --name add_reviews
   ```

3. **Create Shared Type** (`packages/types/src/review.ts`)
   ```typescript
   export interface Review {
     id: string
     jobId: string
     customerId: string
     workerId: string
     rating: number
     comment: string
     createdAt: Date
   }
   ```

4. **Add to Type Index** (`packages/types/src/index.ts`)
   ```typescript
   export * from './review'
   ```

5. **Rebuild Types Package**
   ```bash
   npm run build --workspace=@hire-me/types
   ```

6. **Create API Module** (`apps/api/src/reviews/`)
   - `reviews.module.ts`
   - `reviews.controller.ts`
   - `reviews.service.ts`
   - `dto/create-review.dto.ts`

7. **Register Module** (`apps/api/src/app.module.ts`)
   ```typescript
   import { ReviewsModule } from './reviews/reviews.module'
   
   @Module({
     imports: [
       // ... other modules
       ReviewsModule,
     ],
   })
   ```

8. **Add to Dashboard** (`apps/dashboard/src/`)
   - Create `pages/reviews/ReviewsListPage.tsx`
   - Add route in `App.tsx`
   - Add navigation item in `DashboardShell.tsx`
   - Add to `OperationsDataContext` for state management

9. **Add to Web App** (`apps/web/src/`)
   - Create review form component
   - Add to job detail page
   - Update API client calls

### Common Development Tasks

**Update Database Schema**
```bash
cd apps/api

# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name your_migration_name

# 3. (If needed) Update seed.ts and re-seed
npm run seed
```

**Add New Shared Type**
```bash
# 1. Create type in packages/types/src/
# 2. Export from packages/types/src/index.ts
# 3. Rebuild
npm run build --workspace=@hire-me/types

# 4. TypeScript in apps will auto-pick up the new type
```

**Add API Endpoint**
```bash
# 1. Create/update controller method
# 2. Add corresponding service method
# 3. Create/update DTO for validation
# 4. Add guards if needed: @UseGuards(AuthGuard('jwt'), RolesGuard)
# 5. Test with curl or Postman
```

**Add Dashboard Page**
```bash
# 1. Create component in apps/dashboard/src/pages/
# 2. Add route in apps/dashboard/src/App.tsx
# 3. Add navigation in apps/dashboard/src/layouts/DashboardShell.tsx
# 4. Add dynamic title in apps/dashboard/src/lib/dashboardHeader.ts
# 5. Update OperationsDataContext if data caching needed
```

### Code Quality Best Practices

1. **Follow the Monorepo Structure**
   - Keep app-specific code in respective `apps/` directories
   - Share only true cross-app contracts in `packages/types`
   - Don't create circular dependencies between apps

2. **Type Safety**
   - Always use shared types from `@hire-me/types`
   - No `any` types in production code
   - Use Prisma-generated types in API, convert to shared types for responses

3. **API Design**
   - RESTful endpoint naming
   - Consistent error responses (use `ApiError` from `@hire-me/api-client`)
   - Validate all inputs with DTOs and `class-validator`
   - Document required roles in code comments

4. **Database**
   - Never bypass Prisma migrations (no manual SQL in production)
   - Use transactions for multi-table operations
   - Add indexes for frequently queried fields
   - Use proper foreign key relationships

5. **Security**
   - Always use guards on protected endpoints
   - Never expose user passwords or OTP codes in logs
   - Validate user owns resource before allowing edit/delete
   - Use environment variables for all secrets

6. **Testing**
   - Write unit tests for complex business logic
   - Integration tests for critical user flows
   - Test role-based access control thoroughly
   - Mock external services (Twilio) in tests

## Adding another app

1. Create `apps/<name>/` with its own `package.json` (`"name": "@hire-me/<name>"`, `"private": true`).
2. Root `workspaces` already includes `apps/*`; run `npm install` again.
3. Add a root script alias if you want, e.g. `"dev:admin": "npm run dev --workspace=@hire-me/admin"`.

## Shared code

- Put **cross-app contracts** in `packages/types` (later you can add Zod or OpenAPI codegen there).
- Put **shared HTTP behavior** in `packages/api-client` so web and dashboard stay in sync.
- Keep **app-specific UI and routes** inside each app.

See [docs/architecture.md](docs/architecture.md) for folder-structure conventions.

## Deploying

Point your host at the app directory (e.g. Vercel project root `apps/web`, static or Node hosting for `apps/dashboard` after `npm run build` in that workspace). Run the API as a Node process with `DATABASE_URL`, `JWT_SECRET`, and `CORS_ORIGINS` set for production.

### Deployment Checklist

**API Deployment**:
- [ ] Set production `DATABASE_URL`
- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Configure `CORS_ORIGINS` with actual domain URLs
- [ ] Set `JWT_EXPIRES_IN` appropriately (e.g., "7d")
- [ ] Configure Twilio credentials
- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] (Optional) Seed initial data: `npm run seed`
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging

**Dashboard Deployment**:
- [ ] Build production bundle: `npm run build --workspace=@hire-me/dashboard`
- [ ] Set `VITE_API_URL` to production API URL
- [ ] Deploy static files to host (Netlify, Vercel, S3, etc.)
- [ ] Configure SPA routing (redirect all to index.html)
- [ ] Enable HTTPS

**Web App Deployment**:
- [ ] Set `NEXT_PUBLIC_API_URL` to production API URL
- [ ] Build: `npm run build --workspace=@hire-me/web`
- [ ] Deploy to Vercel, Netlify, or Node.js host
- [ ] Configure domain and HTTPS
- [ ] Set up analytics (optional)

## 📝 Additional Documentation

- [Architecture Details](docs/architecture.md) - Folder conventions and design patterns
- [API URL Contract](docs/API_URL_CONTRACT_WEB.md) - Web app API integration
- [API Auth Matrix](docs/API_AUTH_MATRIX.md) - Detailed authorization rules
- [Phone Auth Implementation](PHONE_AUTH_IMPLEMENTATION.md) - SMS OTP flow details
- [Migration: User Role Rename](docs/MIGRATION_USER_ROLE_RENAME.md) - Historical migration notes

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes following code quality guidelines
3. Test thoroughly (all three apps if applicable)
4. Commit with clear messages: `git commit -m "feat: add review system"`
5. Push and create pull request

## 📄 License

[Specify your license here]

## 🆘 Support

For issues and questions:
- Check existing documentation in `/docs`
- Review API error messages (they're descriptive)
- Check browser console and API logs
- Verify environment variables are set correctly

---

**Happy coding!** 🚀

- Node 20+

## Environment variables

Do **not** commit real secrets. Copy each app’s template and fill in values locally:

| App | Template |
|-----|----------|
| API | [`apps/api/.env.example`](apps/api/.env.example) |
| Web | [`apps/web/.env.example`](apps/web/.env.example) |
| Dashboard | [`apps/dashboard/.env.example`](apps/dashboard/.env.example) |

If a credential was ever committed to git history or shared in chat, **rotate it** in your database/hosting provider and treat the old value as compromised.

## Install

From the repository root:

```bash
npm install
```

npm hoists dependencies to the root `node_modules` and links workspace packages.

## Scripts (run from root)

| Command | Action |
|---------|--------|
| `npm run dev` | Start the **dashboard** (same as `dev:dashboard`) |
| `npm run dev:dashboard` | Vite dev server |
| `npm run dev:web` | Next.js dev server (`apps/web`) |
| `npm run dev:api` | Nest API dev server (`apps/api`) |
| `npm run build` | `build` in every workspace that defines it |
| `npm run build:dashboard` | Production build for the dashboard |
| `npm run build:web` | Production build for the marketing site |
| `npm run build:api` | Production build for the API |
| `npm run lint` | Lint all workspaces that define `lint` |
| `npm run lint:api` | Lint the API |
| `npm run lint:web` | Lint the web app |
| `npm run lint:dashboard` | Lint the dashboard |
| `npm run test:api` | Run API tests |

Or run a script inside one app:

```bash
npm run dev --workspace=@hire-me/web
```

## Adding another app

1. Create `apps/<name>/` with its own `package.json` (`"name": "@hire-me/<name>"`, `"private": true`).
2. Root `workspaces` already includes `apps/*`; run `npm install` again.
3. Add a root script alias if you want, e.g. `"dev:admin": "npm run dev --workspace=@hire-me/admin"`.

## Shared code

- Put **cross-app contracts** in `packages/types` (later you can add Zod or OpenAPI codegen there).
- Put **shared HTTP behavior** in `packages/api-client` so web and dashboard stay in sync.
- Keep **app-specific UI and routes** inside each app.

See [docs/architecture.md](docs/architecture.md) for folder-structure conventions.

## Deploying

Point your host at the app directory (e.g. Vercel project root `apps/web`, static or Node hosting for `apps/dashboard` after `npm run build` in that workspace). Run the API as a Node process with `DATABASE_URL`, `JWT_SECRET`, and `CORS_ORIGINS` set for production.

# Architecture

## Company OS Engineering Principles
- Working software over perfect software.
- Simplicity over cleverness.
- Domain first.
- One source of truth.
- Deterministic behavior over implicit behavior.

## Purpose
Company OS is a Next.js App Router application for turning a user goal into a planner output with two views generated from one source of truth:

- Human-readable Markdown
- Machine-readable DAG

Today, the planner flow is:

UI
↓
API
↓
Application Services
 ├── Planner
 └── PlanService

The repository standard keeps the full stack organized as:

UI
↓
API
↓
Application Services
 ├── Planner
 └── PlanService
↓
Database
↓
SQLite

The planner is a core component. Planning logic belongs in the Planner, not in PlanService. PlanService coordinates application behavior around the execution plan and future persistence work without becoming the planner itself.

## Layered architecture

### UI
**Current examples:** `app/page.tsx`, `lib/renderMarkdown.ts`

Responsibilities:
- Render the App Router page and client interactions
- Collect user input and call HTTP endpoints
- Render planner output for humans
- Render the Domain Model

Rules:
- Follow Next.js App Router conventions under `app/`
- UI must not contain business rules
- UI must not contain SQL
- UI may format the Domain Model into Markdown for display

### API
**Current examples:** `app/api/plan/route.ts`

Responsibilities:
- Expose HTTP request and response handling only
- Validate request shape and return HTTP status codes
- Call Application Services and translate results to HTTP responses

Rules:
- API contains HTTP only
- DTOs belong only to the API layer
- API must not contain business logic
- API must not contain SQL

### Application Services
**Current examples:** `lib/executive-agent.ts`

Responsibilities:
- Hold business logic and orchestration
- Planner generates the execution plan
- PlanService coordinates application behavior around the execution plan
- Define and use Domain Models as the source of truth
- Produce the planner's dual-layer output contract

Rules:
- Application Services contain business logic
- Services own persistence operations
- Database exposes the connection
- SQL used to implement persistence belongs in services
- Markdown and DAG are two views of the same execution plan
- Neither representation may become an independent source of truth
- Markdown and DAG must be generated from the same Domain Model
- Planner output is dual-layer:
  - human-readable Markdown
  - machine-readable DAG
- DAG represents file-level execution dependencies only

### Database
**Reserved layer:** `lib/db.ts`

Responsibilities:
- Expose the database connection only
- Provide shared access to SQLite infrastructure

Rules:
- Database layer exposes the connection only
- No business logic in the database layer
- No DTOs in the database layer

### SQLite
**Reserved backing store:** local SQLite database

Responsibilities:
- Persist application data when features require storage
- Remain behind the Database and Application Services layers

Rules:
- SQLite is an implementation detail behind the Database layer
- UI and API must never depend on SQLite directly

## Domain model rules
- Domain Models are the source of truth
- DTOs belong only to the API layer
- If both Markdown and DAG are needed, generate both from the same Domain Model
- The DAG must describe file-level execution dependencies only, not human workflow notes or UI formatting

## Dependency direction
Allowed direction only:

UI → API → Application Services → Database → SQLite

Do not reverse dependencies. In particular:
- API should not be imported into UI business logic
- Application Services should not depend on API DTOs
- Database should not contain SQL policy or business rules

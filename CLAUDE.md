# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website and API backend for Will and Kenny. Currently in early development (0.0.1-SNAPSHOT). The application serves as a multi-purpose platform with planned features: personal portfolio, Twilight Imperium 4 game reference, Spirit Island reference, a "That Time You Killed Me" game clone, Super Bowl commercial guessing game, and a links page for shared Google Sheets.

## Tech Stack

- **Java 25** with **Spring Boot 3.5**
- **Maven** build system with Maven Wrapper
- **PostgreSQL** for production database (currently H2 in-memory for dev)
- **React 19** frontend with **TypeScript**, **Vite**, **MUI**, and **React Bootstrap**
- **Spring HATEOAS** with **JSON:API** specification for REST endpoints
- **Lombok** for boilerplate reduction
- **Gson** and **Jackson** for serialization

## Build & Run Commands

### Backend
```bash
./mvnw spring-boot:run          # Run the application
./mvnw test                     # Run all tests
./mvnw test -Dtest=ClassName    # Run a single test class
./mvnw test -Dtest=ClassName#methodName  # Run a single test method
./mvnw clean package            # Build JAR
./mvnw clean package -DskipTests # Build JAR without tests
```

### Frontend
```bash
cd frontend
npm install                     # Install dependencies
npm run dev                     # Dev server on port 3000
npm run build                   # Production build
npm run preview                 # Preview production build
npx tsc --noEmit                # Type-check without emitting
```

## Architecture

### Package Structure
All source code lives under `org.bestfriends.bestfriendsapi` in `src/main/java`.

### Feature Organization
Features are organized by domain (e.g., `ti4/` for Twilight Imperium 4). Each feature domain follows this structure:
- `contexts/` — domain models and enums (entities, enums, repository interfaces)
  - `enums/` — domain-specific enumerations
  - `models/` — JPA entity classes (suffixed `DAO`)
- `web/` — web layer
  - `controllers/` — REST controllers producing JSON:API responses
  - `models/` — DTOs for API responses (suffixed `DTO`, annotated with `@JsonApiId`/`@JsonApiType`)

### Shared Code
- `config/` — Spring configuration beans (JSON:API config, serialization setup)
- `commonutils/` — Cross-cutting utilities (e.g., Gson type adapters)

### Key Patterns
- **JSON:API format**: Controllers return `EntityModel<T>` or `PagedModel<EntityModel<T>>` using Spring HATEOAS with the `jsonapi` media type
- **DAO/DTO separation**: JPA entities (DAO suffix) are separate from API response models (DTO suffix)
- **Configuration**: `application.yml` in `src/main/resources/`; database schema/data scripts in `schema.sql` and `data.sql`

### Current State
- The TI4 units controller (`/ti4/units`) returns hardcoded data — no repository layer is wired up yet
- DataSource autoconfiguration is currently excluded in `application.yml`
- H2 console is enabled at default path for development
- `schema.sql` and `data.sql` are empty

## Frontend Architecture

The frontend lives in `frontend/` at the project root (monorepo approach).

### Directory Structure
```
frontend/src/
  components/     # Shared/reusable components
  features/       # Feature directories (mirrors backend domains)
  theme/          # MUI theme configuration
```

### Key Patterns
- **Vite** dev server on port 3000 with proxy: `/api/*` → `http://localhost:8080/*` (strips `/api` prefix)
- **MUI + Bootstrap coexistence**: Bootstrap CSS is imported first in `main.tsx`; MUI Emotion styles inject at runtime with higher specificity. Use MUI components by default; alias Bootstrap imports (e.g., `Button as BsButton`)
- **React Router** for client-side routing via `BrowserRouter`

## Code Owners
@ChuckBTaylor and @kmdunn5
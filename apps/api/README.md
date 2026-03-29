# Hire Me API

NestJS modular monolith with PostgreSQL (Prisma), JWT auth, and REST routes under `/api/v1`.

## Prerequisites

- Node 20+
- PostgreSQL 16+ reachable via a connection string (local install, cloud, or any host you prefer)

## Environment

Copy `.env.example` to `.env` and adjust:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — long random string in production
- `PORT` — default `4000`
- `CORS_ORIGINS` — comma-separated browser origins (e.g. `http://localhost:5173,http://localhost:3000`)

### Database login vs dashboard login

When you run `npm run dev:api`, the API **connects to PostgreSQL immediately** using `DATABASE_URL`. That is **not** the same as signing into the dashboard (JWT). If Postgres rejects the URL (wrong user, password, or database), the process exits with Prisma **P1010** before you open any browser.

## Database

### Step-by-step: create `hireme` and connect (pgAdmin)

Do this once per machine. Your `apps/api/.env` should keep:

`DATABASE_URL=postgresql://hireme:hireme@localhost:5432/hireme?schema=public`

1. **Open pgAdmin** and connect to your local server (the one that uses `localhost` and port `5432` — whatever you named it is fine).

2. **Create the login user (role)**  
   - In the left tree, expand your server → **Login/Group Roles**.  
   - Right‑click **Login/Group Roles** → **Create** → **Login/Group Role…**  
   - **General** tab: **Name** = `hireme`  
   - **Definition** tab: **Password** = `hireme` (and confirm)  
   - **Privileges** tab: enable **Can login?**  
   - Save.

   *If it says the role already exists, skip to step 3.*

3. **Create the database**  
   - Right‑click **Databases** → **Create** → **Database…**  
   - **Database** = `hireme`  
   - **Owner** = `hireme`  
   - Save.  
   - You should now see **`hireme`** under **Databases**.

4. **Confirm `apps/api/.env`** has the URL above (user, password, database name all `hireme`).  
   **Password special characters:** In `DATABASE_URL`, `@` in the password must be written as **`%40`**, or everything after the first `@` is treated as the hostname. Use the **same** Postgres username as in pgAdmin (often `postgres`, not `hireme`, unless you created that role).

5. **Apply Prisma schema and seed** (from a terminal):

   ```bash
   cd apps/api
   npx prisma migrate deploy
   npm run db:seed
   ```

6. **Start the API** (from repo root or `apps/api`):

   ```bash
   npm run dev:api
   ```

7. **Optional check:** open `http://localhost:4000/api/v1/health` — you should see `{"status":"ok"}`.

---

### First-time Postgres (SQL shortcut)

Same result as the GUI steps above — run as superuser `postgres` on database **`postgres`** in **Query Tool**:

The sample `DATABASE_URL` expects a role and database named `hireme`. Connect as a superuser (e.g. `postgres` in pgAdmin), open **Query Tool** on database **`postgres`**, and run:

```sql
CREATE USER hireme WITH PASSWORD 'hireme';
CREATE DATABASE hireme OWNER hireme;
```

Or change `DATABASE_URL` to whatever user, password, and database you already use locally (must match pgAdmin/`psql`).

### Still seeing `P1010: User was denied access`?

Prisma **is** reaching `localhost:5432` and using database **`hireme`** (see the line `Datasource "db": PostgreSQL database "hireme"`). Postgres is rejecting the **user/password** or **CONNECT** to that database.

1. **Run the same URL in a terminal** (replace password if yours differs):

   ```bash
   psql "postgresql://hireme:hireme@localhost:5432/hireme" -c "SELECT 1"
   ```

   If this fails, fix Postgres until it succeeds; Prisma will work after that.

2. **`CREATE USER` / `CREATE DATABASE` failed earlier** (e.g. “already exists”) — connect as superuser `postgres`, open a **Query Tool** on database **`postgres`**, and repair ownership/rights:

   ```sql
   ALTER USER hireme WITH PASSWORD 'hireme';
   ALTER DATABASE hireme OWNER TO hireme;
   GRANT CONNECT ON DATABASE hireme TO hireme;
   ```

3. **Database name mismatch** — In pgAdmin you might have `hire_me` (underscore) but `.env` uses `hireme` (no underscore). The names must match exactly; either rename in Postgres or fix `DATABASE_URL`.

Then apply migrations and seed:

```bash
cd apps/api
npx prisma migrate deploy
npm run db:seed
```

## Run

From repo root:

```bash
npm run dev:api
```

Or from `apps/api`:

```bash
npm run dev
```

Health check: `GET http://localhost:4000/api/v1/health`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run prisma:migrate` | Create/apply dev migrations |
| `npm run prisma:migrate:deploy` | Apply migrations (CI/prod) |
| `npm run prisma:studio` | Prisma Studio |
| `npm run db:seed` | Seed demo data |

## Demo accounts (after seed)

All use password `demo123`:

- `alex@hireme.internal` — superadmin  
- `priya@hireme.internal` — admin  
- `chris@hireme.internal` — agent  
- `jamie@hireme.internal` — content_editor  

## Module map

| Prefix | Module |
|--------|--------|
| `/auth` | Login, JWT |
| `/users` | Dashboard users |
| `/workers` | Worker registry |
| `/jobs` | Jobs |
| `/roles` | Static role catalog |
| `/blog` | Public + CMS blog |

RBAC: `content_editor` is blocked from users/workers/jobs; can manage blog posts and read published APIs.

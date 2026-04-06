# TaskFlow — Task Management System

A full-stack task management system with secure authentication, task CRUD, filters, and a polished dashboard UI.

## Features
- Email/password auth with access + refresh tokens (HTTP-only cookies)
- Task CRUD with status/priority/due dates
- Dashboard with filters, search, and pagination
- Modern UI (Next.js App Router + Tailwind + Base UI)

## Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS, Base UI, Sonner
- **Backend:** Express 5, Prisma, PostgreSQL, Zod, JWT
- **Shared:** TypeScript types in `packages/types`

## Monorepo Layout
```
backend/    Express API + Prisma
frontend/   Next.js app
packages/   Shared TypeScript types
```

## Requirements
- Node.js 18+ (or 20+ recommended)
- PostgreSQL

## Setup

### 1) Backend
```bash
cd backend
npm install
```

Create `.env` in `backend/`:
```
PORT=4000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_TTL=900
REFRESH_TOKEN_TTL=604800
COOKIE_NAME_ACCESS=access_token
COOKIE_NAME_REFRESH=refresh_token
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
COOKIE_DOMAIN=
CORS_ORIGIN=http://localhost:3001
```

Run migrations and start the API:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 2) Shared types
```bash
cd packages/types
npm install
npm run build
```

### 3) Frontend
```bash
cd frontend
npm install
```

Create `.env.local` in `frontend/`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start the frontend:
```bash
npm run dev
```

Visit: `http://localhost:3001`

## Useful Scripts

### Backend
- `npm run dev` — start API in watch mode
- `npm run build` — build to `dist/`
- `npm run start` — run production build
- `npm run prisma:migrate` — run migrations

### Frontend
- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run start` — run production build

## API Overview
Base URL: `http://localhost:4000`

Auth:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

Tasks:
- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `POST /tasks/:id/toggle`

## Notes
- Cookies are HTTP-only; frontend uses `credentials: "include"`.
- If deploying frontend and backend on different domains, ensure:
  - `CORS_ORIGIN` includes the frontend URL
  - `COOKIE_SECURE=true` and `COOKIE_SAMESITE=none` for HTTPS


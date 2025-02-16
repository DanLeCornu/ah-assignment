# ah-assignment

## Overview

This is a simple API built with Node.js and TypeScript. It provides endpoints for managing users and categories.

## Technologies

- TypeScript
- Node
- Express
- Prisma
- Jest
- PostgreSQL
- Zod

## Setup

1. Clone the repository
2. Install dependencies

```bash
pnpm install
```

3. Create a postgres database in your local environment

4. Create a `.env` file and set the environment variables

- `DATABASE_URL` - The connection string for the PostgreSQL database
- `API_TOKEN` - The token for the API

5. Run the migrations

```bash
pnpm db:migrate
```

6. Run the development server

```bash
pnpm dev
```

Endpoints are:

- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users

All requests must include an `Authorization` header with the value `Bearer <API_TOKEN>`


## Run tests

```bash
pnpm test
```

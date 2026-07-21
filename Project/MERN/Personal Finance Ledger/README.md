# Personal Finance Ledger (Double-Entry)

Educational MERN project for issue **#248**.

## Features
- JWT auth, accounts & categories
- Balanced double-entry transactions (Mongo validation)
- Recurring bills
- CSV import/export
- Charts + optimistic UI with conflict handling
- Offline queue via localStorage when API is unreachable

## Run

```bash
cd backend && cp .env.example .env && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## Tech Stack
MongoDB · Express · React (Vite) · Node.js

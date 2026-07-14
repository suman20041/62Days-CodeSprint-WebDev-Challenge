# API Mock Studio

A full-stack tool for defining custom mock API endpoints with fake JSON responses, configurable delays, and HTTP status codes — ideal for frontend testing before a real backend is ready.

## Features

- Create, edit, and delete mock endpoints
- Support for GET, POST, PUT, PATCH, DELETE
- Custom JSON response editor
- Configurable delay (ms) and status codes (200, 400, 401, 404, 500, etc.)
- Live request tester
- Mocks persisted locally in `backend/data/mocks.json`
- Responsive React studio UI

## Tech Stack

- React + Vite + Tailwind CSS
- Node.js + Express
- JSON file storage (no MongoDB required)

## Folder Structure

```text
API Mock Studio/
├── backend/
│   ├── data/mocks.json
│   ├── server.js
│   └── store.js
├── frontend/
│   └── src/
└── README.md
```

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:5002`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## How to use

1. Open the studio and create a mock (e.g. `GET /users`)
2. Set JSON body, status code, and optional delay
3. Call it from the live tester, or from your app:

```text
http://localhost:5002/mock/users
```

## API

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET/POST/PUT/PATCH/DELETE | `/api/mocks` | Manage mock definitions |
| ANY | `/mock/*` | Serve enabled mocks |

## Issue

Resolves #182

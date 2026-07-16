# CardForge — Interview Prep Flashcards (Spaced Repetition)

Full-stack MERN app for interview flashcards with SM-2 scheduling, difficulty ratings, a progress dashboard, and optional AI card/hint generation.

Built for **Issue #197** under `Project/MERN`.

---

## Features

- User authentication (register / login / JWT)
- Flashcards CRUD (create, read, update, delete)
- Topic / category organization
- Difficulty rating during reviews (`again` / `hard` / `good` / `easy`)
- SM-2 style spaced repetition scheduling
- Due-today review queue
- Progress dashboard (streaks, mastery, upcoming reviews, topic breakdown)
- Optional AI assistance (Gemini) for card generation and hints
- Responsive UI

---

## Tech Stack

| Layer | Tools |
|-------|--------|
| Frontend | React, Vite, Tailwind CSS v4, React Router, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs |
| AI (optional) | Google Gemini API |

---

## Folder Structure

```text
Interview Prep Flashcards Spaced Repetition/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/sm2.js
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   └── .env.example
└── README.md
```

---

## Prerequisites

- Node.js 18+
- MongoDB running locally (or Atlas URI)
- Optional: Gemini API key for AI features

---

## Setup

### 1. Backend (port 5001)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2. Frontend (port 5174)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5174`.

---

## Environment Variables

**Backend**

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/interview-prep-flashcards
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:5174
GEMINI_API_KEY=
```

Leave `GEMINI_API_KEY` empty to disable AI — the app still works fully without it.

**Frontend**

```env
VITE_API_URL=http://localhost:5001/api
```

---

## How SM-2 works here

After flipping a card, rate recall quality:

| Rating | Quality | Effect |
|--------|---------|--------|
| Again | 1 | Reset reps, due in 1 day |
| Hard | 3 | Advance with lower ease |
| Good | 4 | Normal SM-2 advance |
| Easy | 5 | Longer interval + higher ease |

Ease factor starts at `2.5` and never drops below `1.3`.

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/cards` | List / search cards |
| POST | `/api/cards` | Create card |
| PUT | `/api/cards/:id` | Update card |
| DELETE | `/api/cards/:id` | Delete card |
| GET | `/api/cards/review/due` | Due-today queue |
| POST | `/api/cards/:id/review` | Submit SM-2 rating |
| GET | `/api/cards/dashboard/stats` | Progress stats |
| GET | `/api/ai/status` | Whether AI is enabled |
| POST | `/api/ai/generate-cards` | AI generate cards |
| POST | `/api/ai/hint` | AI study hint |

---

## License

MIT — contributed to the 62Days-CodeSprint-WebDev-Challenge (SSoC'26).

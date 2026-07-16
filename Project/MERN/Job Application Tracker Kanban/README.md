# HireBoard — Job Application Tracker (Kanban)

Full-stack MERN app to track job applications on a Kanban board with notes, deadlines, filters, and dashboard stats.

Built for **Issue #198** under `Project/MERN`.

---

## Features

- User authentication (register / login / JWT)
- Kanban board: Applied / Interview / Offer / Rejected
- Drag-and-drop + click-to-move status updates
- Notes and deadline fields per application
- Filters & search (company, role, status, deadline range)
- Dashboard stats (total, interviews, offers, upcoming deadlines)
- Create, update, and delete applications
- Responsive UI

---

## Tech Stack

| Layer | Tools |
|-------|--------|
| Frontend | React, Vite, Tailwind CSS v4, React Router, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs |

---

## Folder Structure

```text
Job Application Tracker Kanban/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   └── .env.example
└── README.md
```

---

## Setup

### 1. Backend (port 5002)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2. Frontend (port 5175)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5175`.

---

## Environment Variables

**Backend**

```env
PORT=5002
MONGODB_URI=mongodb://127.0.0.1:27017/job-application-tracker
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:5175
```

**Frontend**

```env
VITE_API_URL=http://localhost:5002/api
```

---

## Kanban columns

| Status | Meaning |
|--------|---------|
| `applied` | Application submitted |
| `interview` | Interview scheduled / ongoing |
| `offer` | Offer received |
| `rejected` | Closed / rejected |

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/applications` | List / filter applications |
| POST | `/api/applications` | Create |
| PUT | `/api/applications/:id` | Update |
| PATCH | `/api/applications/:id/move` | Move column |
| DELETE | `/api/applications/:id` | Delete |
| GET | `/api/applications/dashboard/stats` | Dashboard stats |

---

## License

MIT — contributed to the 62Days-CodeSprint-WebDev-Challenge (SSoC'26).

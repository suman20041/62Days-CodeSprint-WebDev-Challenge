# Developer Portfolio CMS (No-code style)

A form-based portfolio builder with live preview, theme customization, and export to static HTML or JSON. Drafts auto-save in localStorage; an optional Express API can persist portfolios on the server.

## Features

- No-code style form editor
- Sections: About, Skills, Projects, Experience, Education, Contact
- Live preview panel
- Theme options (colors, fonts, layout)
- Export as static HTML
- Export as JSON
- Auto-save drafts in localStorage
- Optional backend save/load API

## Tech Stack

- React + Vite + Tailwind CSS
- Node.js + Express (JSON file storage — no MongoDB required)

## Folder Structure

```text
Developer Portfolio CMS/
├── backend/
│   ├── data/portfolios.json
│   └── server.js
├── frontend/
│   └── src/
└── README.md
```

## Setup

### Frontend (required)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

### Backend (optional — for “Save to server”)

```bash
cd backend
npm install
npm run dev
```

API runs at `http://localhost:5003`.

## Issue

Resolves #183

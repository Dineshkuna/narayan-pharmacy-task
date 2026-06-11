# narayan-pharmacy-task

A focused Prescription Entry & Drug Interaction Checker. Pharmacists enter a prescription, Claude AI reviews the drug combination before dispensing, and the result is saved in MongoDB for later review.

**Stack:** Node.js + Express · MongoDB via Mongoose · Next.js 14 · Claude API

---

## Quick Start

> Prerequisites: Node.js 18+, MongoDB running locally

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/narayan-pharmacy-task.git
cd narayan-pharmacy-task
```

### 2. Set up the backend
```bash
cd backend
cp .env.example .env
# Edit .env — add your ANTHROPIC_API_KEY and MONGODB_URI
npm install
npm run dev
```

### 3. Set up the frontend (new terminal)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 4. Open the app
```
http://localhost:3000
```

---

## Environment Variables

**`backend/.env`**
```
ANTHROPIC_API_KEY=your_key_here        # Get from console.anthropic.com
MONGODB_URI=mongodb://localhost:27017/pharmacy
PORT=5000
```

**`frontend/.env`**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Features

- **Prescription Entry Form** — patient, doctor, date, multiple drugs + dosages
- **AI Drug Interaction Check** — Claude analyzes combinations and returns severity (None / Mild / Moderate / Severe)
- **Smart Caching** — same drug combination reuses cached result (no duplicate API calls)
- **Prescriptions List** — table with severity badges; click any row for full details
- **Edge Case Handling** — single drug skips AI call; API errors shown in UI (not just console)
- **MongoDB Storage** — prescriptions and interaction results are persisted in Mongoose documents

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/prescriptions` | List all prescriptions |
| GET | `/api/prescriptions/:id` | Get prescription detail |
| POST | `/api/prescriptions` | Create + run interaction check |
| GET | `/api/health` | Health check |

---

## Project Structure

```
narayan-pharmacy-task/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express route handlers
│   ├── services/        # Claude API service
│   └── server.js
├── frontend/
│   └── src/
│       ├── app/         # Next.js pages (App Router)
│       ├── components/  # Reusable UI components
│       └── lib/         # API helper
├── CLAUDE.md            # AI assistant instruction file
├── MEMORY.md            # AI workflow & decision log
└── README.md
```

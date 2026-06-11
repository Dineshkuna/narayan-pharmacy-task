# CLAUDE.md — Project Instruction File

## What This App Does
A pharmacy prescription entry tool that uses Claude AI to detect dangerous drug-drug interactions before dispensing. Pharmacists enter a prescription (patient, doctor, drugs + dosages), and the app flags interaction risks with severity levels.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB via Mongoose |
| AI | Anthropic Claude API (`claude-opus-4-5`) |

## Project Structure

```
narayan-pharmacy-task/
├── backend/
│   ├── models/Prescription.js     # Mongoose schema (drugs, interactionResult)
│   ├── routes/prescriptions.js    # REST API routes
│   ├── services/claudeService.js  # Claude API call + prompt
│   ├── server.js                  # Express entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js                        # Screen 2: Prescriptions list
│   │   │   ├── new/page.js                    # Screen 1: New prescription form
│   │   │   └── prescriptions/[id]/page.js     # Detail view
│   │   ├── components/
│   │   │   ├── SeverityBadge.js               # None/Mild/Moderate/Severe badge
│   │   │   └── InteractionResult.js           # AI result display
│   │   └── lib/api.js                         # API helper functions
│   └── .env.example
├── CLAUDE.md
├── MEMORY.md
└── README.md
```

## How to Run Locally

```bash
# 1. Clone and set up backend
cd backend && cp .env.example .env   # Add your ANTHROPIC_API_KEY and MONGODB_URI
npm install && npm run dev

# 2. Set up frontend (new terminal)
cd frontend && cp .env.example .env
npm install && npm run dev
```

## Environment Variables

**Backend `.env`:**
- `ANTHROPIC_API_KEY` — your Anthropic key (never commit this)
- `MONGODB_URI` — e.g. `mongodb://localhost:27017/pharmacy`
- `PORT` — defaults to 5000

**Frontend `.env`:**
- `NEXT_PUBLIC_API_URL` — defaults to `http://localhost:5000`

## Key Conventions

- **API base:** `http://localhost:5000/api`
- **Routes:** `GET /prescriptions`, `POST /prescriptions`, `GET /prescriptions/:id`
- **Drug caching:** `drugCacheKey` field on Prescription stores sorted drug name + dosage pairs — same combo reuses cached result, no re-call to Claude
- **Single drug edge case:** If only 1 drug is entered, Claude is NOT called; a "no interaction" result is returned directly
- **Severity values:** `"None" | "Mild" | "Moderate" | "Severe"` — validated in `claudeService.js`
- **Claude model:** `claude-opus-4-5` — do not change without testing the JSON output format

## Gotchas for AI Assistants

- The Claude API call expects **strict JSON back** — the prompt instructs no markdown fences. If parsing fails, it throws a `SyntaxError` which is caught in the route.
- MongoDB must be running locally before starting the backend.
- Next.js pages under `app/` are **server components by default**; only `new/page.js` is a client component (`"use client"`).
- Do not hardcode `ANTHROPIC_API_KEY` anywhere — it must always come from `process.env`.

# 🌍 HumanLink

HumanLink is a mobile application that fights urban isolation by connecting nearby people who share a similar emotional state. The product combines emotion analysis with location awareness to encourage safe, authentic, real-world meetups.

> HumanLink est une application mobile qui lutte contre l’isolement urbain en connectant des personnes proches géographiquement et partageant un état émotionnel similaire. L’app s’appuie sur une analyse d’émotions (texte et voix) et des cartes interactives pour favoriser des rencontres réelles, sécurisées et authentiques.

<p align="center">
  <img src="media/image/acceuil.jpeg" alt="HumanLink home screen" width="260" />
  <img src="media/image/Message1.jpeg" alt="HumanLink conversations" width="260" />
  <img src="media/image/Message3.jpeg" alt="HumanLink mood sharing" width="260" />
</p>

---

## Table of Contents
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Illustrated Architecture](#illustrated-architecture)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Testing & Quality](#testing--quality)
- [Contributing](#contributing)
- [License](#license)

---

## Key Features
- **Emotion-aware matching** – suggests connections based on current mood and proximity.
- **Interactive maps** – explore nearby members, places, and meeting spots.
- **Secure onboarding** – identity verification and protected data flows.
- **Feedback loops** – capture experience quality to continuously improve matches.
- **Offline-ready design system** – modular UI components that keep the mobile experience cohesive.

## Tech Stack
- **Mobile**: React Native (Expo), React Navigation, `react-native-maps`.
- **Backend**: FastAPI, SQLAlchemy, Pydantic, Uvicorn.
- **Data**: PostgreSQL (Supabase) with optional local SQLite for dev.
- **AI & Integrations**: Emotion analysis pipeline (OpenAI or heuristic fallback), Google Maps/OpenStreetMap, optional SERP API.
- **Security**: Auth0 or Firebase Auth, JWT access tokens, email verification.

## Illustrated Architecture

```mermaid
flowchart LR
    App[Mobile App (Expo)]
    API[FastAPI Service]
    DB[(PostgreSQL / Supabase)]
    AI[[Emotion Analysis]]
    Maps[(Maps API)]
    Email[Email Provider]
    App -->|REST / WebSocket (planned)| API
    API --> DB
    API --> AI
    API --> Maps
    API --> Email
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Python 3.11+
- PostgreSQL 14+ (or Supabase project)
- Docker (optional, for full-stack startup)

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv
.venv/Scripts/Activate.ps1    # PowerShell (Windows)
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp env.example .env           # add your secrets manually
uvicorn app.main:app --reload --port 8000
```

Key endpoints once running locally:
- `POST /auth/register` – create account
- `POST /auth/token` – exchange credentials for JWT
- `POST /mood/` – submit current mood (text, geolocation)
- `GET /match/suggestions` – fetch nearby matches
- `POST /feedback/` – share meeting feedback
- API docs: `http://localhost:8000/docs`

### 2. Mobile App (Expo)
```bash
cd mobile
npm install
npm run start    # or: npx expo start
```

Configure the API base URL in `mobile/src/api.ts`:
```ts
const api = axios.create({
  baseURL: "http://YOUR_LOCAL_IP:8000",
});
```

Run on device or emulator via the Expo QR code or the platform-specific command (`i`, `a`, `w`).

### 3. Full Stack with Docker
```bash
docker compose up --build
```

Customize the compose file with your secrets via environment variables or `.env` files ignored by Git.

---

## Environment Configuration
- Copy `backend/env.example` to `backend/.env` and replace every placeholder value with your own secrets.
- Do **not** commit `.env`, `.venv`, or generated artifacts. The repository `.gitignore` keeps them out of version control.
- Key variables you will need:
  - `DATABASE_URL`
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `JWT_SECRET_KEY`
  - `EMAIL_*` credentials
  - `OPENAI_API_KEY` (optional but recommended for richer emotion analysis)

For local development without Supabase, leave `DATABASE_URL` empty to fall back to SQLite.

---

## Project Structure
```
HumanLink/
├── backend/                  # FastAPI service
│   ├── app/                  # Application modules (routers, models, services)
│   ├── database/             # SQL migrations & helpers
│   ├── requirements.txt
│   └── env.example           # Template for secrets (placeholders only)
├── mobile/                   # React Native (Expo) app
│   ├── src/                  # Screens, components, hooks, API client
│   ├── assets/               # Fonts and images bundled in the app
│   └── app.json
├── media/                    # Marketing visuals for documentation
└── README.md                 # Project documentation (you are here)
```

---

## Available Scripts
- `backend/run.py` – convenience runner for local API testing.
- `mobile/npm run start` – launch Expo dev server.
- `mobile/npm run lint` – lint the React Native codebase.
- `mobile/npm run test` – execute unit tests (add Jest tests inside `mobile/__tests__/`).
- `docker compose up` – (planned) orchestrated stack.

---

## Testing & Quality
- Use `pytest` for backend tests (`pip install pytest`) and add suites under `backend/tests/`.
- For the mobile app, rely on Jest/React Testing Library (`npm run test`).
- Continuous integration (GitHub Actions) can be added later to automate linting and tests before deployments.

---

## Contributing
1. Fork the repository and create a feature branch.
2. Keep secrets out of commits (`.env`, keys, credentials).
3. Run lint/test commands before submitting a PR.
4. Open a pull request with a clear description and screenshots if UI changes.

---

## License
HumanLink is currently under active development. Licensing will be clarified before the first public release.

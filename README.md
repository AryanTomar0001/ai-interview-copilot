# AI Interview Copilot

AI Interview Copilot is a full-stack interview practice platform that turns a PDF resume into technical, project, HR, or combined interview questions. It includes browser audio recording, speech transcription, category-specific AI evaluation, attempt history, dashboard analytics, and protected usage limits.

## Services

| Service | Technology | Default URL | Responsibility |
|---|---|---|---|
| Frontend | React 18, Vite, Tailwind CSS | `http://localhost:5173` | Authentication UI, resume upload, interview flow, dashboard, and results |
| Auth and usage service | Node.js, Express, MongoDB | `http://localhost:4000` | JWT authentication, user profiles, attempt history, and usage limits |
| AI backend | Python, FastAPI | `http://localhost:8000` | PDF parsing, embeddings, RAG questions, transcription, and answer evaluation |
| Vector database | Qdrant | `http://localhost:6333` | Stores resume chunks and embeddings |
| Primary database | MongoDB | Configured in environment | Stores users, resumes, questions, evaluations, and interview history |

## Core Features

- Email/password signup and login with bcrypt password hashing and JWT authentication
- Protected React routes and protected FastAPI endpoints
- PDF resume validation and text extraction
- RAG-based resume analysis using Qdrant and FastEmbed embeddings
- Technical, project, HR, and combined interview modes
- Configurable 1-20 question interview lengths
- Browser microphone recording and server-side speech transcription
- Groq-powered, category-specific answer evaluation
- Strengths, missing points, incorrect claims, improvements, ideal-answer feedback, and scoring
- Interview attempt completion and MongoDB history
- Dashboard statistics and interview summary views
- Daily attempt and resume-upload limits

## Project Structure

```text
ai-interview-copilot/
├── frontend/                 React and Vite client
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
├── auth-server/              Express authentication and usage service
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       └── routes/
├── backend/                  FastAPI AI and RAG service
│   └── app/
│       ├── api/v1/
│       ├── core/
│       ├── db/
│       ├── exceptions/
│       ├── rag/
│       ├── repositories/
│       ├── schemas/
│       ├── security/
│       └── services/
└── docker-compose.yml        Local Qdrant service
```

## Prerequisites

- Node.js 18 or newer and npm
- Python 3.11 or newer
- MongoDB local instance or MongoDB Atlas
- Docker for the local Qdrant container
- Groq API key

## Environment Configuration

Copy each example file and replace placeholders:

```bash
cp frontend/.env.example frontend/.env
cp auth-server/.env.example auth-server/.env
cp backend/.env.example backend/.env
```

Frontend:

```dotenv
VITE_MAIN_API_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:4000/api
```

Auth server:

```dotenv
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ai-interview-copilot
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

FastAPI:

```dotenv
GROQ_API_KEY=your_groq_api_key
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=ai_interview
JWT_SECRET=the_same_secret_used_by_the_auth_server
JWT_ALGORITHM=HS256
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
QDRANT_COLLECTION=resume_chunks
```

Never commit real keys or `.env` files. Environment files are ignored by Git, and example files contain placeholders only.

## Run Locally

Start Qdrant:

```bash
docker compose up -d
```

Start MongoDB locally or configure both MongoDB environment variables for MongoDB Atlas.

Start the auth server:

```bash
cd auth-server
npm install
npm run dev
```

Start the FastAPI service:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## API Overview

### Auth and User Service

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/user/me`
- `GET /api/user/history`
- `GET /api/user/stats`
- `POST /api/attempt/save`
- `POST /api/attempt/complete`
- `GET /api/limit/check-attempt`
- `GET /api/limit/check-resume`
- `POST /api/limit/increment-resume`
- `POST /api/resume/upload`

### FastAPI AI Service

- `POST /resume/upload`
- `POST /questions/generate`
- `POST /evaluate/`
- `POST /speech/transcribe`
- `GET /`

## Daily Limits

The current Express limits are configured in `auth-server/src/config/constants.js`:

- 20 interview attempts per day
- 2 resume uploads per day

Counters reset when a user's stored reset date changes.

## Security

- Environment secrets are excluded from Git
- Passwords are hashed with bcrypt
- Authenticated routes use bearer JWT tokens
- FastAPI and Express share the configured JWT secret and algorithm
- Resume and audio upload endpoints validate inputs
- CORS and global API error handling are enabled

If credentials were previously exposed, rotate the Groq key, MongoDB credentials, JWT secret, and Qdrant key before deployment.

## Build and Validation

```bash
# Frontend production build
cd frontend
npm run build

# Auth server syntax checks
cd auth-server
node --check server.js
node --check src/app.js

# FastAPI import check
cd backend
python -c "from app.main import app; print(app.title)"
```

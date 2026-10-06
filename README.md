<div align="center">

# 🤖 AI Chat

### A secure, full-stack, ChatGPT-style AI chat application

Built with **Next.js · TypeScript · FastAPI · PostgreSQL · Groq / Gemini**

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Open_App-success?style=for-the-badge)](https://frontend-kohl-eight-82.vercel.app/)

<br/>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=white)

</div>

---

## 🌐 Live Demo

> **👉 [https://frontend-kohl-eight-82.vercel.app/](https://frontend-kohl-eight-82.vercel.app/)**

| Item | Details |
|---|---|
| **Live app** | [frontend-kohl-eight-82.vercel.app](https://frontend-kohl-eight-82.vercel.app/) |
| **Frontend hosting** | Vercel |
| **Backend hosting** | Render (FastAPI) |
| **How to try it** | Register an account → start a new chat → send a message |

<div align="center">

<a href="https://frontend-kohl-eight-82.vercel.app/">
  <img src="https://image.thum.io/get/width/1200/crop/700/https://frontend-kohl-eight-82.vercel.app/" alt="AI Chat live preview" width="800" />
</a>

<sub>Live preview of the running app. Click the image to open it.</sub>

</div>

<!-- Optional: replace the live preview above with your own screenshot or GIF:
![AI Chat Screenshot](./docs/screenshot.png)
-->

---

> 💤 **Note:** the backend runs on Render. If it is on a free plan, the first request after a period of inactivity can take up to a minute while the server wakes up.

---

## 📖 About

AI Chat lets users register, create conversations, send messages, receive AI-generated responses, and manage their chat history, all through a clean ChatGPT-style interface.

The project focuses on **security, clean architecture, scalability, API separation, and production-ready practices**. The browser never talks to the AI provider directly; every request goes through the FastAPI backend, which keeps API keys private.

---

## 📌 Table of Contents

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Security](#-security)
- [Testing](#-testing)
- [Docker](#-docker)
- [Roadmap](#-development-roadmap)
- [Future Improvements](#-future-improvements)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Author](#-author)

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 👤 Authentication
- Registration & login
- JWT access + refresh tokens
- Password hashing
- Protected API routes
- Current-user endpoint
- Logout & account management

### 💬 AI Chat
- Create, rename, delete conversations
- Continue previous conversations
- Full conversation history
- Search conversations
- Streaming AI responses

</td>
<td width="50%" valign="top">

### 🎨 Modern UI
- ChatGPT-style interface
- Responsive: desktop, tablet, mobile
- Dark & light mode
- Loading, error and empty states
- Markdown support

### 🔐 Security
- Authorization checks & per-user data isolation
- API rate limiting
- Input validation (Pydantic)
- CORS & security headers
- API keys kept server-side
- Safe, generic error responses

</td>
</tr>
</table>

**🧪 Testing:** auth, conversations, messages, authorization, AI service and API validation tests.
**🐳 DevOps:** Docker, Docker Compose, PostgreSQL / backend / frontend containers, environment-based config.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS, Fetch / Axios |
| **Backend** | FastAPI, Python, Pydantic, SQLAlchemy, Alembic, JWT, Pytest |
| **Database** | PostgreSQL |
| **AI** | Groq, Google Gemini, or any compatible free-tier provider |
| **Infrastructure** | Docker, Docker Compose, Git, GitHub, Vercel (frontend), Render (backend) |

The AI provider sits behind an internal service layer, so it can be swapped without rewriting the chat system.

---

## 🏗 Architecture

```text
┌─────────────────────────────┐
│          Browser            │
│      Next.js + React        │
└──────────────┬──────────────┘
               │  REST API / HTTP
               ▼
┌─────────────────────────────┐
│          FastAPI            │
│  Auth · Chat · Conversations│
│  Business Logic · AI Service│
└──────────────┬──────────────┘
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌─────────────────┐
│ PostgreSQL   │  │   AI Provider   │
│ Users        │  │ Groq / Gemini   │
│ Conversations│  │ / Other         │
│ Messages     │  │                 │
└──────────────┘  └─────────────────┘
```

> 🔒 **Security rule:** the browser never communicates directly with the AI provider. The AI API key exists only on the backend.

---

## 📁 Project Structure

<details>
<summary><b>Click to expand</b></summary>

```text
ai-chat/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/        # config, database, security
│   │   ├── models/      # user, conversation, message
│   │   ├── schemas/     # auth, user, conversation, chat
│   │   ├── api/
│   │   │   ├── deps.py
│   │   │   └── routes/  # auth, users, conversations, chat
│   │   ├── services/    # auth, chat, conversation services
│   │   ├── ai/          # base, groq_provider, gemini_provider
│   │   └── utils/
│   ├── migrations/
│   ├── tests/
│   ├── .env.example
│   ├── requirements.txt
│   ├── alembic.ini
│   └── Dockerfile
│
├── frontend/
│   ├── app/             # login, register, chat, settings
│   ├── components/      # auth, chat, ui
│   ├── hooks/           # useAuth, useChat
│   ├── lib/             # api, auth, utils
│   ├── providers/       # AuthProvider
│   ├── types/
│   ├── public/
│   ├── .env.local.example
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

</details>

---

## ⚡ Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+ and npm
- PostgreSQL 15+
- Git
- Docker *(optional)*

### 1. Clone

```bash
git clone https://github.com/sahan11111/ai-chat.git
cd ai-chat
```

### 2. Backend

```bash
cd backend

# create & activate a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Linux / macOS

pip install -r requirements.txt
```

Create the database and run migrations:

```sql
CREATE DATABASE ai_chat;
```

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

| | URL |
|---|---|
| API | http://localhost:8000 |
| Swagger docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Health check | http://localhost:8000/health |

### 3. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**.

---

## 🔧 Environment Variables

### Backend: `backend/.env`

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/ai_chat
SECRET_KEY=change-this-to-a-long-random-secret
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
AI_PROVIDER=groq
AI_API_KEY=your-ai-api-key
AI_MODEL=your-model-name
FRONTEND_URL=http://localhost:3000
```

### Frontend: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> ⚠️ **Never commit `.env`.** Never expose `AI_API_KEY`, `SECRET_KEY` or `DATABASE_URL` to the frontend, and never create variables like `NEXT_PUBLIC_AI_API_KEY`. Only `NEXT_PUBLIC_*` variables are sent to the browser.

---

## 🔌 API Endpoints

<details open>
<summary><b>Authentication</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |

</details>

<details open>
<summary><b>Conversations & Messages</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/conversations` | List conversations |
| POST | `/api/conversations` | Create conversation |
| GET | `/api/conversations/{id}` | Get conversation |
| PATCH | `/api/conversations/{id}` | Update conversation |
| DELETE | `/api/conversations/{id}` | Delete conversation |
| GET | `/api/conversations/{id}/messages` | Get messages |
| POST | `/api/conversations/{id}/messages` | Create message |

</details>

<details open>
<summary><b>AI Chat</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send message |
| POST | `/api/chat/stream` | Stream AI response |

</details>

Full interactive docs are available at `/docs` when the backend is running.

---

## 🔐 Authentication

```text
User ──login──► FastAPI ──verify password──► JWT Access Token
                                                   │
                                                   ▼
                     Next.js ── Authorization: Bearer <token> ──► Protected API
```

Protected endpoints verify the authenticated user before returning data.

### 👤 User Data Isolation

Every conversation belongs to exactly one user. The backend always verifies ownership, so User A can never read or modify User B's conversations or messages.

---

## 🔒 Security

| Area | Practice |
|---|---|
| **Passwords** | Hashed before storage, never stored in plain text |
| **API keys** | Backend environment variables only |
| **Validation** | Pydantic on all incoming data, e.g. `message: str = Field(min_length=1, max_length=10000)` |
| **Rate limiting** | Stricter limits on `/login`, `/register`, `/chat`, `/chat/stream` |
| **CORS** | Only trusted frontend origins allowed |
| **Headers** | `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security` |
| **Errors** | Generic message to clients, details only in server logs |

Example error response:

```json
{
  "success": false,
  "message": "An internal server error occurred."
}
```

---

## 🧪 Testing

```bash
cd backend
pytest                  # run all tests
pytest --cov=app        # with coverage
```

Covers authentication, authorization, users, conversations, messages, AI service, validation and error handling.

---

## 🐳 Docker

```bash
docker compose up --build     # build & start
docker compose up -d          # detached mode
docker compose logs -f        # view logs
docker compose down           # stop
```

| Service | Port |
|---|---|
| Frontend (Next.js) | `3000` |
| Backend (FastAPI) | `8000` |
| PostgreSQL | `5432` |

---

## 🗺 Development Roadmap

- [x] **Phase 1:** Project architecture & setup
- [ ] **Phase 2:** Backend: database, models, migrations, JWT auth
- [ ] **Phase 3:** Chat: conversation/message models, CRUD, AI provider integration
- [ ] **Phase 4:** Frontend: login, register, chat UI, sidebar, history
- [ ] **Phase 5:** Advanced: streaming, Markdown, code blocks, search, dark mode
- [ ] **Phase 6:** Security: rate limiting, headers, CORS, authorization audit
- [ ] **Phase 7:** Testing: unit, API, auth, authorization, chat tests
- [ ] **Phase 8:** Deployment
  - [x] Frontend deployed on Vercel
  - [x] Backend deployed on Render
  - [ ] Production PostgreSQL
  - [ ] HTTPS & monitoring

---

## 🚀 Future Improvements

| Category | Ideas |
|---|---|
| **AI** | Multiple models & providers, custom system prompts, AI-generated titles |
| **Content** | File uploads, PDF chat, image understanding, voice input/output |
| **Sharing** | Conversation sharing, chat export / import |
| **Platform** | Token usage tracking, usage limits, admin dashboard |
| **Infra** | Redis caching, background jobs, WebSockets |
| **RAG** | Vector search (pgvector, Qdrant, Chroma, FAISS), knowledge-base chat |

<details>
<summary><b>🧠 Future RAG architecture</b></summary>

```text
User → Next.js → FastAPI ─┬─► PostgreSQL
                          │
                          └─► Embedding Service → Vector DB
                                                     │
                                          Relevant documents
                                                     ▼
                                    AI Provider → Generated answer
```

</details>

---

## 🛠 Troubleshooting

| Problem | What to check |
|---|---|
| **Backend won't start** | `python --version`, activate the venv, re-run `pip install -r requirements.txt` |
| **Database error** | `DATABASE_URL` is correct, PostgreSQL is running, the database exists |
| **AI API error** | `AI_API_KEY`, `AI_PROVIDER`, `AI_MODEL`, and that the model is available on your free tier |
| **CORS error** | `FRONTEND_URL` matches the frontend origin |
| **Frontend can't reach backend** | `NEXT_PUBLIC_API_URL`, and that `http://localhost:8000/docs` opens |

---

## 📦 Production Checklist

- [ ] Change `SECRET_KEY`
- [ ] Use HTTPS
- [ ] Configure CORS and security headers
- [ ] Enable rate limiting
- [ ] Use a production PostgreSQL database
- [ ] Disable debug mode
- [ ] Configure logging and database backups
- [ ] Run migrations and automated tests
- [ ] Audit authorization
- [ ] Check AI API usage limits
- [ ] Protect and rotate secrets

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork, then clone your fork
git clone https://github.com/<your-username>/ai-chat.git

# 2. Create a branch
git checkout -b feature/new-feature

# 3. Make changes, then run tests
pytest

# 4. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

Then open a Pull Request.

---

## 📄 License

This project is intended for educational and portfolio purposes. Add your preferred license, for example **MIT**.

---

## 👨‍💻 Author

**Sahan Takhachhen**
Backend / Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-sahan11111-181717?style=flat-square&logo=github)](https://github.com/sahan11111)

`Python` · `FastAPI` · `Next.js` · `TypeScript` · `PostgreSQL` · `SQLAlchemy` · `JWT` · `Docker` · `AI APIs`

---

<div align="center">

### ⭐ Project Goal

Build a real-world AI chat application while demonstrating modern frontend development, backend APIs, database design, authentication, AI integration, security, testing, Docker and production architecture.

**If you find this project useful, please consider giving it a ⭐ on GitHub!**

[🚀 Try the Live Demo](https://frontend-kohl-eight-82.vercel.app/)

</div>

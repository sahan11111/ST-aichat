# 🤖 AI Chat Application

A modern, secure, full-stack AI chat application built with **Next.js, TypeScript, FastAPI, PostgreSQL, and a free-tier AI API provider**.

The application provides a ChatGPT-style interface where users can register, create conversations, send messages, receive AI-generated responses, and manage their chat history.

The project is designed with a strong focus on **security, clean architecture, scalability, API separation, and production-ready development practices**.

## 🚀 Live Demo

Try the deployed application: [Open AI Chat](https://frontend-kohl-eight-82.vercel.app/)

---

## 📌 Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [AI Integration](#-ai-integration)
- [Security](#-security)
- [Testing](#-testing)
- [Docker](#-docker)
- [Development Roadmap](#-development-roadmap)
- [Future Improvements](#-future-improvements)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

# ✨ Features

## 👤 Authentication

- User registration
- User login
- JWT authentication
- Access tokens
- Refresh tokens
- Password hashing
- Protected API routes
- Current user endpoint
- Logout
- Account management

## 💬 AI Chat

- Create new conversations
- Send messages to AI
- Receive AI-generated responses
- Continue previous conversations
- Conversation history
- Rename conversations
- Delete conversations
- Search conversations
- AI response streaming

## 🎨 Modern UI

- ChatGPT-style interface
- Responsive design
- Desktop support
- Tablet support
- Mobile support
- Dark mode
- Light mode
- Loading states
- Error states
- Empty states
- Markdown support

## 🔐 Security

- Password hashing
- JWT authentication
- Authorization checks
- API rate limiting
- Input validation
- CORS configuration
- Security headers
- Environment variables
- API key protection
- Secure error handling
- User data isolation

## 🧪 Testing

- Authentication tests
- Conversation tests
- Message tests
- Authorization tests
- AI service tests
- API validation tests

## 🐳 DevOps

- Docker support
- Docker Compose
- PostgreSQL container
- Backend container
- Frontend container
- Environment-based configuration

---

# 🛠 Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React | UI |
| Fetch / Axios | API communication |

## Backend

| Technology | Purpose |
|---|---|
| FastAPI | REST API |
| Python | Backend language |
| Pydantic | Data validation |
| SQLAlchemy | ORM |
| Alembic | Database migrations |
| JWT | Authentication |
| Pytest | Testing |

## Database

| Technology | Purpose |
|---|---|
| PostgreSQL | Primary database |

## AI

The application supports a free-tier AI provider such as:

- Groq
- Google Gemini
- Other compatible providers

The AI provider is isolated behind an internal service layer so it can be replaced without rewriting the chat system.

## Infrastructure

- Docker
- Docker Compose
- Git
- GitHub

---

# 🏗 Architecture

The application follows a separated frontend/backend architecture.

```text
┌─────────────────────────────┐
│          Browser            │
│                             │
│      Next.js + React        │
└──────────────┬──────────────┘
               │
               │ REST API / HTTP
               ▼
┌─────────────────────────────┐
│          FastAPI            │
│                             │
│  Authentication             │
│  Chat API                   │
│  Conversation API           │
│  Business Logic             │
│  AI Service                 │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌──────────────┐  ┌─────────────────┐
│ PostgreSQL   │  │   AI Provider   │
│              │  │                 │
│ Users        │  │ Groq / Gemini   │
│ Conversations│ │ / Other         │
│ Messages     │  │                 │
└──────────────┘  └─────────────────┘
```

### Important Security Rule

The browser never communicates directly with the AI provider.

```text
Next.js
   │
   ▼
FastAPI
   │
   ▼
AI Provider
```

The AI API key exists only on the backend.

---

# 📁 Project Structure

```text
ai-chat/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── conversation.py
│   │   │   └── message.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── conversation.py
│   │   │   └── chat.py
│   │   │
│   │   ├── api/
│   │   │   ├── deps.py
│   │   │   └── routes/
│   │   │       ├── auth.py
│   │   │       ├── users.py
│   │   │       ├── conversations.py
│   │   │       └── chat.py
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── chat_service.py
│   │   │   └── conversation_service.py
│   │   │
│   │   ├── ai/
│   │   │   ├── base.py
│   │   │   ├── groq_provider.py
│   │   │   └── gemini_provider.py
│   │   │
│   │   └── utils/
│   │       └── helpers.py
│   │
│   ├── migrations/
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_chat.py
│   │   └── test_conversations.py
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx
│   │   │
│   │   ├── chat/
│   │   │   ├── page.tsx
│   │   │   └── [conversationId]/
│   │   │       └── page.tsx
│   │   │
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── chat/
│   │   └── ui/
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useChat.ts
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   │
│   ├── providers/
│   │   └── AuthProvider.tsx
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── chat.ts
│   │   └── user.ts
│   │
│   ├── public/
│   │
│   ├── .env.local.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# 📋 Prerequisites

Before starting, install:

- Python 3.11+
- Node.js 20+
- npm
- PostgreSQL 15+
- Git
- Docker (optional)

Check versions:

```bash
python --version
node --version
npm --version
psql --version
git --version
```

---

# 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/ai-chat.git
```

Enter the project:

```bash
cd ai-chat
```

The project contains two applications:

```text
backend/
frontend/
```

---

# 🔧 Environment Variables

## Backend

Create:

```text
backend/.env
```

Example:

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

### ⚠️ Important

Never commit `.env` to Git.

Never expose:

```env
AI_API_KEY
SECRET_KEY
DATABASE_URL
```

to the frontend.

---

# 🎨 Frontend Environment Variables

Create:

```text
frontend/.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Only variables prefixed with `NEXT_PUBLIC_` should be exposed to the browser.

Never put:

```env
NEXT_PUBLIC_AI_API_KEY=
```

in the frontend.

---

# 🐍 Backend Setup

Go to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux/macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🗄 Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE ai_chat;
```

Configure the connection:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/ai_chat
```

Run migrations:

```bash
alembic upgrade head
```

---

# ▶️ Run Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

ReDoc:

```text
http://localhost:8000/redoc
```

Health check:

```text
http://localhost:8000/health
```

---

# ⚛️ Frontend Setup

Open another terminal.

Go to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# 🔌 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |

---

## Conversations

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/conversations` | Get conversations |
| POST | `/api/conversations` | Create conversation |
| GET | `/api/conversations/{id}` | Get conversation |
| PATCH | `/api/conversations/{id}` | Update conversation |
| DELETE | `/api/conversations/{id}` | Delete conversation |

---

## Messages

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/conversations/{id}/messages` | Get messages |
| POST | `/api/conversations/{id}/messages` | Create message |

---

## AI Chat

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send message |
| POST | `/api/chat/stream` | Stream AI response |

---

# 🔐 Authentication

The application uses JWT-based authentication.

Typical flow:

```text
User
 │
 │ Login
 ▼
FastAPI
 │
 │ Verify password
 ▼
JWT Access Token
 │
 ▼
Next.js
 │
 │ Authorization: Bearer <token>
 ▼
Protected API
```

Protected endpoints verify the authenticated user before returning data.

---

# 👤 User Data Isolation

A user must only access their own conversations.

For example:

```text
User A
 ├── Conversation 1
 └── Conversation 2

User B
 ├── Conversation 3
 └── Conversation 4
```

User A must never be able to access:

```text
Conversation 3
Conversation 4
```

The backend must always verify ownership.

---

# 🤖 AI Integration

The AI provider is accessed only from FastAPI.

```text
Next.js
   │
   │ User message
   ▼
FastAPI
   │
   │ Auth + validation
   ▼
AI Service
   │
   ▼
AI Provider
   │
   │ AI response
   ▼
FastAPI
   │
   ▼
Next.js
```

The frontend never receives the AI provider API key.

---

# 🔒 Security

Security is a major part of this project.

## Password Security

Passwords are hashed before storage.

Never store:

```text
password123
```

directly in the database.

---

## API Key Protection

AI API keys are stored only in backend environment variables.

```env
AI_API_KEY=secret
```

Never use:

```env
NEXT_PUBLIC_AI_API_KEY=secret
```

---

## Input Validation

FastAPI validates all incoming data using Pydantic.

Example:

```python
message: str = Field(
    min_length=1,
    max_length=10000
)
```

---

## Rate Limiting

Rate limiting should be applied especially to:

```text
/login
/register
/chat
/chat/stream
```

AI endpoints should have stricter limits because every request can consume provider resources.

---

## CORS

Only trusted frontend origins should be allowed.

Development:

```text
http://localhost:3000
```

Production should use the actual frontend domain.

---

## Security Headers

Production deployment should configure headers such as:

```text
Content-Security-Policy
X-Content-Type-Options
X-Frame-Options
Referrer-Policy
Strict-Transport-Security
```

---

## Error Handling

Do not expose internal errors to users.

Avoid returning:

```text
Database connection failed at /app/services/database.py line 83
```

Instead return:

```json
{
  "success": false,
  "message": "An internal server error occurred."
}
```

Detailed information should be available only in server logs.

---

# 🧪 Testing

Run backend tests:

```bash
pytest
```

Run with coverage:

```bash
pytest --cov=app
```

Test areas include:

```text
Authentication
Authorization
Users
Conversations
Messages
AI service
Validation
Error handling
```

---

# 🐳 Docker

The application can be run using Docker Compose.

Start the services:

```bash
docker compose up --build
```

Stop the services:

```bash
docker compose down
```

Start in detached mode:

```bash
docker compose up -d
```

View logs:

```bash
docker compose logs -f
```

Expected architecture:

```text
┌───────────────────────────┐
│        Frontend           │
│        Next.js            │
│        :3000              │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│         Backend           │
│         FastAPI           │
│         :8000             │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│        PostgreSQL         │
│         :5432             │
└───────────────────────────┘
```

---

# 🗺 Development Roadmap

## Phase 1 — Project Setup

- [x] Project architecture
- [ ] Next.js setup
- [ ] FastAPI setup
- [ ] PostgreSQL setup
- [ ] Environment configuration

## Phase 2 — Backend

- [ ] Database configuration
- [ ] SQLAlchemy models
- [ ] Alembic migrations
- [ ] Authentication
- [ ] JWT
- [ ] User management

## Phase 3 — Chat

- [ ] Conversation model
- [ ] Message model
- [ ] Conversation CRUD
- [ ] Chat API
- [ ] AI provider integration

## Phase 4 — Frontend

- [ ] Login page
- [ ] Register page
- [ ] Chat interface
- [ ] Sidebar
- [ ] Conversation history
- [ ] Message input
- [ ] AI response display

## Phase 5 — Advanced Features

- [ ] Streaming responses
- [ ] Markdown rendering
- [ ] Code block support
- [ ] Conversation search
- [ ] Rename conversations
- [ ] Dark mode

## Phase 6 — Security

- [ ] Rate limiting
- [ ] Security headers
- [ ] Input validation
- [ ] CORS configuration
- [ ] Authorization audit
- [ ] API key audit

## Phase 7 — Testing

- [ ] Unit tests
- [ ] API tests
- [ ] Authentication tests
- [ ] Authorization tests
- [ ] Chat tests

## Phase 8 — Deployment

- [ ] Docker
- [ ] Production environment
- [ ] HTTPS
- [ ] PostgreSQL production database
- [ ] Backend deployment
- [ ] Frontend deployment
- [ ] Monitoring

---

# 🚀 Future Improvements

Possible future features include:

- Multiple AI models
- Multiple AI providers
- File uploads
- PDF chat
- Image understanding
- Voice input
- Voice output
- Conversation sharing
- Chat export
- Chat import
- AI-generated conversation titles
- Custom system prompts
- User-defined AI settings
- Token usage tracking
- Usage limits
- Admin dashboard
- Redis caching
- Background jobs
- WebSocket support
- RAG
- Vector database
- Semantic search
- Knowledge-base chat

---

# 🧠 Future RAG Architecture

The application can later be extended to support Retrieval-Augmented Generation.

```text
User
 │
 ▼
Next.js
 │
 ▼
FastAPI
 │
 ├──────────────► PostgreSQL
 │
 ▼
Embedding Service
 │
 ▼
Vector Database
 │
 ▼
Relevant Documents
 │
 ▼
AI Provider
 │
 ▼
Generated Answer
```

Possible technologies:

- pgvector
- Qdrant
- Chroma
- FAISS

---

# 🛠 Troubleshooting

## Backend does not start

Check:

```bash
python --version
```

Check virtual environment:

```bash
venv\Scripts\activate
```

Reinstall dependencies:

```bash
pip install -r requirements.txt
```

---

## Database connection error

Check:

```env
DATABASE_URL=
```

Make sure PostgreSQL is running.

Verify the database exists.

---

## AI API error

Check:

```env
AI_API_KEY=
AI_PROVIDER=
AI_MODEL=
```

Make sure the selected provider and model are currently available on your account/free tier.

---

## CORS error

Check:

```env
FRONTEND_URL=http://localhost:3000
```

Make sure the backend allows the frontend origin.

---

## Frontend cannot connect to backend

Check:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then verify:

```text
http://localhost:8000/docs
```

is accessible.

---

# 📦 Production Checklist

Before deploying to production:

- [ ] Change `SECRET_KEY`
- [ ] Use HTTPS
- [ ] Configure secure CORS
- [ ] Configure security headers
- [ ] Enable rate limiting
- [ ] Use production PostgreSQL
- [ ] Disable debug mode
- [ ] Configure logging
- [ ] Protect environment variables
- [ ] Rotate secrets when necessary
- [ ] Configure database backups
- [ ] Run migrations
- [ ] Run automated tests
- [ ] Audit authorization
- [ ] Check AI API usage limits
- [ ] Never expose API keys

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-chat.git
```

### 2. Create a branch

```bash
git checkout -b feature/new-feature
```

### 3. Make your changes

### 4. Run tests

```bash
pytest
```

### 5. Commit

```bash
git add .
git commit -m "feat: add new feature"
```

### 6. Push

```bash
git push origin feature/new-feature
```

### 7. Create a Pull Request

---

# 📄 License

This project is intended for educational and portfolio purposes.

Add your preferred license here, for example:

```text
MIT License
```

---

# 👨‍💻 Author

**Your Name**

Backend / Full-Stack Developer

### Technologies

```text
Python
FastAPI
Next.js
TypeScript
PostgreSQL
SQLAlchemy
JWT
Docker
AI APIs
```

---

# ⭐ Project Goal

The goal of this project is to build a real-world AI chat application while learning and demonstrating:

```text
Modern frontend development
        +
Backend API development
        +
Database design
        +
Authentication
        +
AI integration
        +
Security
        +
Testing
        +
Docker
        +
Production architecture
```

If you find this project useful, consider giving it a ⭐ on GitHub.
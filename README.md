<div align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />

<br/><br/>

# PG Dhundo 🏠

**A production-grade PG discovery platform for students and working professionals.**  
Search, shortlist, chat, and book verified PG accommodations — no brokers, no hassle.

[🌐 Live Demo](https://pg-dhundo.vercel.app) &nbsp;·&nbsp; [📦 Backend API Docs](https://pg-dhundo-backend.onrender.com/docs) &nbsp;·&nbsp; [🚀 Deploy Your Own](#-deployment)

</div>

---

## ✨ Features

| Category | Feature |
|---|---|
| 🔍 **Discovery** | Smart search by location, gender, price range with instant results |
| 🗺️ **Map View** | Interactive Leaflet map with PG markers and routing |
| 💬 **Live Chat** | Real-time WebSocket chat between tenant and owner, with automated greetings |
| 🔐 **Auth** | JWT-based sessions, bcrypt password hashing, protected routes |
| 💳 **Payments** | Razorpay checkout integration (test & live mode) |
| 🏠 **Owner Portal** | Hosts submit and manage listings from their own dashboard |
| 🛡️ **Admin Panel** | Secure OTP-protected admin console for platform management |
| 📣 **Notifications** | Custom animated toast system — no browser alerts |
| 🎨 **Premium UI** | Glassmorphic design, Framer Motion animations, fully responsive |

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 19 + Vite 6 | Component framework + blazing fast build tool |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Page transitions & micro-animations |
| React Leaflet | Interactive maps |
| Lucide React | Icon system |
| Axios | HTTP client |
| Socket.io-client | WebSocket chat |

### Backend
| Tool | Purpose |
|---|---|
| FastAPI | Async REST + WebSocket API |
| Uvicorn | ASGI production server |
| SQLAlchemy 2.0 | ORM & query builder |
| Pydantic v2 | Request/response validation |
| python-jose | JWT token creation & verification |
| bcrypt | Password hashing |

### Infrastructure
| Layer | Service |
|---|---|
| Frontend Hosting | Vercel (global CDN, auto HTTPS) |
| Backend Hosting | Render (free tier, auto-deploy) |
| Database | Neon PostgreSQL (serverless, free) |
| Gmail SMTP via App Password |

---

## 📁 Project Structure

```
pg_dhundo/
├── backend/                    # Python FastAPI application
│   ├── app/
│   │   ├── core/               # Config, security, JWT helpers
│   │   ├── models/             # SQLAlchemy database models
│   │   ├── routes/             # API routers
│   │   │   ├── auth.py         # Register, Login, Token refresh
│   │   │   ├── pgs.py          # PG listings CRUD + search
│   │   │   ├── chat.py         # WebSocket real-time chat
│   │   │   └── admin.py        # Admin dashboard endpoints
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── database.py         # DB engine & session factory
│   │   └── main.py             # App entry, middleware, CORS
│   ├── requirements.txt
│   ├── Procfile                # Render / Railway start command
│   ├── .env.example            # Environment variable template
│   └── run.py                  # Local dev runner
│
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── features/       # Domain components (listings, chat, auth)
│   │   │   └── ui/             # Shared UI primitives
│   │   ├── context/            # Auth, Toast, Notification providers
│   │   ├── pages/              # Route-level views
│   │   └── App.jsx             # Router & layout wrapper
│   ├── vite.config.js          # Build config + dev proxy
│   ├── vercel.json             # SPA rewrites + security headers
│   └── .env.example
│
└── vercel.json                 # Root-level Vercel config
```

---

## 🚀 Local Development

### Prerequisites
- **Python** 3.10+
- **Node.js** 18+
- **PostgreSQL** (local, or a free [Neon](https://neon.tech) cloud DB)

### 1 — Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/pg-dhundo.git
cd pg-dhundo
```

### 2 — Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# → Open .env and fill in DATABASE_URL, SECRET_KEY, etc.

# Start API server (auto-reloads on file changes)
python run.py
```

API will be live at **http://localhost:8000**  
Swagger docs at **http://localhost:8000/docs**

### 3 — Frontend Setup

```bash
# In a new terminal
cd frontend

npm install

# Configure environment
cp .env.example .env
# → VITE_API_URL=http://127.0.0.1:8000  (already set for local dev)

npm run dev
```

App will be live at **http://localhost:5173**

> The Vite dev server proxies all `/pgs`, `/auth`, `/chat`, `/ws` requests to the local backend — no CORS issues in dev.

---

## 🌐 Deployment

Full step-by-step deployment guide → **[DEPLOYMENT.md](./DEPLOYMENT.md)**

**TL;DR free-tier setup:**

```
Database  → Neon.tech   (free PostgreSQL)
Backend   → Render.com  (free web service, auto-deploys from GitHub)
Frontend  → Vercel.com  (free hosting, global CDN)
```

**Required environment variables:**

| Variable | Where | Description |
|---|---|---|
| `DATABASE_URL` | Render | Neon PostgreSQL connection string |
| `SECRET_KEY` | Render | 48-char random hex for JWT signing |
| `ALLOWED_ORIGINS` | Render | Your Vercel frontend URL |
| `ENVIRONMENT` | Render | `production` |
| `SMTP_USER` | Render | Gmail address for email notifications |
| `SMTP_PASSWORD` | Render | Gmail App Password (16 chars) |
| `VITE_API_URL` | Vercel | Your Render backend URL |
| `VITE_RAZORPAY_KEY` | Vercel | Razorpay public key ID |

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
SECRET_KEY=<generate: python -c "import secrets; print(secrets.token_hex(48))">
ALLOWED_ORIGINS=http://localhost:5173
ENVIRONMENT=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_RAZORPAY_KEY=rzp_test_YOUR_KEY_HERE
```

> ⚠️ **Never commit `.env` files.** Both are in `.gitignore`. Use `.env.example` as the reference.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Create user account |
| `POST` | `/auth/login` | — | Login, returns JWT |
| `GET` | `/pgs` | — | List/search PG listings |
| `GET` | `/pgs/{id}` | — | Single PG details |
| `POST` | `/pgs` | Owner | Create listing |
| `PUT` | `/pgs/{id}` | Owner | Update listing |
| `WS` | `/ws/chat/{room}` | JWT | Real-time chat |
| `GET` | `/admin/listings` | Admin | All listings (moderation) |

Full interactive docs available at `/docs` (Swagger UI) and `/redoc`.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow conventional commits (`feat:`, `fix:`, `chore:`, `docs:`) for clean history.

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

<div align="center">

Built with ❤️ for students and professionals tired of broker fees.

**[⬆ Back to top](#pg-dhundo-)**

</div>

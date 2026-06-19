# Expense Tracker

A full-stack personal expense tracker web application built using FastAPI, PostgreSQL, and React.
The application allows users to manage daily expenses, apply filters, track monthly spending summaries, and perform full CRUD operations through a clean responsive interface.
---

## Stack Choices & Tradeoffs

- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
  - FastAPI for async, type-safe APIs and easy validation.
  - SQLAlchemy ORM for DB access.
  - PostgreSQL for reliability and local development.
  - Tradeoff: SQLAlchemy is powerful but can be verbose for simple CRUD.
- **Frontend:** React, Vite, Tailwind CSS
  - React for UI, Vite for fast dev/build, Tailwind for styling.
  - Tradeoff: React is flexible but requires more boilerplate for state management.
- **API Communication:** Axios for HTTP requests.

---

## How to Run

### 1. Backend

```sh
# 1. Create and activate your Python venv (if not already)
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up PostgreSQL (if not running)
# (Homebrew install: brew install postgresql@16)
# Start PostgreSQL and create DB/user as per backend/.env

# 4. Set environment variables (see backend/.env)
# Edit DATABASE_URL and SECRET_KEY as needed

# 5. Run the backend server
cd backend
uvicorn main:app --reload
```

### 2. Frontend

```sh
# 1. Install dependencies
cd frontend
npm install

# 2. Start the dev server
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

## What’s Done

- Expense CRUD (create, read, update, delete)
- Category-based filtering, date range, and search
- Monthly summary endpoint and UI
- PostgreSQL integration
- Basic error handling and validation
- Responsive UI with Tailwind

---

## What’s Skipped / Known Issues

- No authentication/authorization (all endpoints are open)
- No deployment scripts (local only)
- No Docker support
- No tests (unit/integration)
- No advanced analytics or charts
- Error messages are basic
- No user management (single-user only)
- Database migrations (e.g., Alembic) not set up

---

## Rough Edges

- You must manually create the PostgreSQL DB/user to match backend/.env.
- If the backend or DB is not running, the frontend will show generic errors.
- CORS is only set for localhost:5173.
- Some UI/UX polish may be missing (e.g., loading states, toasts).
- Only INR currency is shown (hardcoded).

---

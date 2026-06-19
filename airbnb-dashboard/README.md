# Airbnb Price Prediction Intelligence Platform
A production-grade full-stack data analytics and prediction dashboard. The platform uses a pre-trained machine learning model hosted on Hugging Face Spaces to predict nightly Airbnb rates in London and New York, integrates with Groq API for a scoped AI Chatbot Analyst, and simulates real-time price drops/surges.

---

## Live Deployment

| Component | URL / Detail |
|---|---|
| **Frontend (Vercel)** | [https://expernetic-data-challenge.vercel.app](https://expernetic-data-challenge.vercel.app/) |
| **Backend API (Render)** | [https://expernetic-data-challenge.onrender.com](https://expernetic-data-challenge.onrender.com) |
| **Database** | PostgreSQL, provisioned and hosted on Render |
| **ML Model (Hugging Face Space)** | [`kokulan123/airbnb-price-predictor`](https://huggingface.co/spaces/kokulan123/airbnb-price-predictor) |
| **LLM Engine** | Groq API (chatbot analyst) |

> **Note:** Render's free-tier web services spin down after periods of inactivity. The first request to the backend after idle time may take 30–60 seconds to respond while the instance wakes up.

### Demo Login
| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin123` |

New visitors are **not** restricted to the demo account — anyone can register their own account directly from the app's Sign Up page to create a separate, independent login.

---

## Technical Stack
- **Backend**: Django 5 + Django REST Framework, JWT Authentication, Gradio API client, SQLite (Local) / PostgreSQL (Production), ReportLab (PDF generation).
- **Frontend**: React (Vite) + Tailwind CSS v4, Recharts, Axios, React Router, Leaflet Maps.
- **ML Inference**: Hugging Face Space (`kokulan123/airbnb-price-predictor`).
- **LLM Engine**: Groq API (`gsk_...` key configured).

---

## Local Development Setup

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up the `.env` file with your Groq API Key and HF Model ID:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   HF_MODEL_ID=kokulan123/airbnb-price-predictor
   DATABASE_URL=sqlite:///db.sqlite3   # or your local Postgres URL
   ```
   > To get a Groq API key: sign up at [console.groq.com](https://console.groq.com/), go to **API Keys**, and create a new key. It will be in the form `gsk_...`.
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Seed the database with a test admin user (`admin` / `admin123`) and initial dashboard data:
   ```bash
   python seed_db.py
   ```
6. Start the server:
   ```bash
   python manage.py runserver
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:5173`.
   - Log in with the demo admin account (`admin` / `admin123`), **or**
   - Click **Sign Up** to create your own separate account.

---

## Deployment Guide

### 1. Backend Deployment (Render)
This project's backend is live at **https://expernetic-data-challenge.onrender.com**, deployed as follows:

1. **Repository Structure**: Ensure your repository has the `backend/` folder in the root, or set the **Root Directory** setting on Render to `backend`.
2. **Web Service**:
   - Web Service on Render pointing to this Git repository.
   - **Root Directory**: `backend`
   - **Environment/Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
     ```
   - **Start Command**:
     ```bash
     gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
     ```
3. **Database**: A Render **PostgreSQL** instance is provisioned and linked to the web service. Render auto-populates `DATABASE_URL` when the database is attached to the service (or you can copy the Internal Database URL manually under "Environment").
4. **Environment Variables** (Render Dashboard → Environment):
   - `DATABASE_URL`: Render PostgreSQL connection string (auto-linked or pasted manually)
   - `GROQ_API_KEY`: your Groq API key, obtained from [console.groq.com](https://console.groq.com/) → API Keys
   - `HF_MODEL_ID`: `kokulan123/airbnb-price-predictor`
   - `PYTHON_VERSION`: `3.11.0` (or similar)

### 2. Frontend Deployment (Vercel)
This project's frontend is live at **https://expernetic-data-challenge.vercel.app**, deployed as follows:

1. **Vercel Project**:
   - Project on Vercel pointing to this Git repository.
   - **Root Directory**: `frontend`
   - Vercel auto-detects the Vite project configuration.
2. **Build Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Base API URL**:
   - The Axios `baseURL` configuration (e.g. in `Prediction.jsx`, `Dashboard.jsx`, or a shared `api.js`) points to the live Render backend:
     ```
     https://expernetic-data-challenge.onrender.com
     ```
   - For local development, switch this back to `http://localhost:8000`, or drive it from an environment variable (e.g. `VITE_API_BASE_URL`) so you don't need to edit code between environments.

---

## Accounts
- **Demo/Admin account**: `admin` / `admin123` — preloaded with seed data, useful for quickly exploring the dashboard.
- **New users**: Anyone can register their own account via the Sign Up flow in the frontend. Each user's saved searches, predictions, and dashboard data are kept separate from other accounts.
# Airbnb Price Prediction Intelligence Platform

A production-grade full-stack data analytics and prediction dashboard. The platform uses a pre-trained machine learning model hosted on Hugging Face Spaces to predict nightly Airbnb rates in London and New York, integrates with Groq API for a scoped AI Chatbot Analyst, and simulates real-time price drops/surges.

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
3. Set up the `.env` file with Groq API Key and HF Model ID (this is already configured in `backend/.env`).
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Seed the database with a test user (`admin` / `admin123`) and initial dashboard data:
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
4. Access the web app at `http://localhost:5173`. Login with user `admin` and password `admin123`.

---

## Deployment Guide

### 1. Backend Deployment (Render)
1. **Repository Structure**: Ensure your repository has the `backend/` folder in the root or set the **Root Directory** setting on Render to `backend`.
2. **Create Web Service**:
   - Create a new Web Service on Render pointing to your Git repository.
   - Set **Root Directory** to `backend`.
   - Set **Environment/Runtime** to `Python 3`.
   - Set **Build Command**:
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
     ```
   - Set **Start Command**:
     ```bash
     gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
     ```
3. **Environment Variables**:
   Add the following environment variables in Render's dashboard under "Environment":
   - `DATABASE_URL`: Set this to your Render PostgreSQL connection string (Render will provision one for you if linked, or you can create a Render PostgreSQL database and copy the internal/external database URL here).
   - `GROQ_API_KEY`: `your_groq_api_key_here`
   - `HF_MODEL_ID`: `kokulan123/airbnb-price-predictor`
   - `PYTHON_VERSION`: `3.11.0` (or similar)

---

### 2. Frontend Deployment (Vercel)
1. **Create Vercel Project**:
   - Create a new project on Vercel pointing to your Git repository.
   - Set **Root Directory** to `frontend`.
   - Vercel will auto-detect the Vite project configuration.
2. **Build Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Base API URL Update**:
   - When deployed, change the Axios API baseURL configurations in the React pages (such as `Prediction.jsx` and `Dashboard.jsx`) to point to your live Render backend URL (e.g. `https://your-backend-app.onrender.com`) instead of `http://localhost:8000`.

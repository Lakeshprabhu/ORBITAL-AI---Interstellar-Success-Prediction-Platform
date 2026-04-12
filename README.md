# ORBITAL-AI---Interstellar-Success-Prediction-Platform
# 🛸 Orbital X — Space Mission Intelligence Platform

A full-stack web application that predicts the success of space missions using a trained machine learning model, paired with an AI-powered RAG chatbot that answers questions about the dataset and analysis.

Built with **React + Vite** on the frontend and **FastAPI** on the backend.

---

## ✨ Features

- **Mission Success Predictor** — Enter launch parameters and get an instant ML-powered prediction (Success / Failure / Partial Failure / Prelaunch Failure) with a plain-English summary sentence
- **AI Analyst Chatbot** — Ask anything about the space missions dataset, the analysis, or the model. Powered by RAG (Retrieval-Augmented Generation) using LangChain + FAISS + OpenAI
- **Cinematic Loading Screen** — 4-second animated intro with starfield, rocket pulse, and live progress bar
- **Dark Space UI** — Professional dark theme using Orbitron, Syne, and JetBrains Mono fonts

---

## 🗂️ Project Structure

```
orbital-x/
├── backend/
│   ├── main.py                  # FastAPI app — /predict and /chat routes
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Your OpenAI API key (create this yourself)
│   ├── models/
│   │   ├── jelper.pkl           # Label encoder
│   │   ├── hhhh.pkl             # Scaler
│   │   └── snakes.joblib        # Trained ML model
│   └── docs/
│       └── vertopal.com_Space_Missions_Analysis_(start).pdf
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx              # Root component with loading screen logic
        ├── index.css            # Global styles and design system
        ├── api.js               # Axios API calls
        └── components/
            ├── LoadingScreen.jsx
            ├── PredictForm.jsx
            └── ChatBot.jsx
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Axios |
| Styling | Custom CSS (Orbitron + Syne + JetBrains Mono) |
| Backend | FastAPI, Uvicorn |
| ML | scikit-learn, joblib, pandas, numpy |
| RAG | LangChain, FAISS, OpenAI Embeddings |
| LLM | OpenAI GPT (via LangChain ChatOpenAI) |
| PDF Parsing | PyPDF2 |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- An OpenAI API key

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/orbital-x.git
cd orbital-x
```

---

### 2. Set up the backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:

```
OPENAI_API_KEY=sk-your-key-here
```

Make sure your model files are in place:

```
backend/models/jelper.pkl
backend/models/hhhh.pkl
backend/models/snakes.joblib
backend/docs/vertopal.com_Space_Missions_Analysis_(start).pdf
```

Start the backend server:

```bash
uvicorn main:app --reload
```

You should see:

```
Loading ML models...
ML models loaded ✓
Building vector store...
Vector store ready ✓
INFO:     Uvicorn running on http://127.0.0.1:8000
```

> Visit `http://localhost:8000/docs` for the auto-generated interactive API docs.

---

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

### 4. Both servers must be running simultaneously

| Terminal | Command | URL |
|---|---|---|
| Terminal 1 | `uvicorn main:app --reload` (inside `backend/`) | http://localhost:8000 |
| Terminal 2 | `npm run dev` (inside `frontend/`) | http://localhost:5173 |

---

## 🔌 API Reference

### `POST /predict`

Predicts the outcome of a space mission.

**Request body:**
```json
{
  "organisation": "SpaceX",
  "country": "USA",
  "month": "Apr",
  "price": 62.5,
  "rocket_status": 1,
  "year": 2023
}
```

**Response:**
```json
{
  "result": "Success",
  "label_index": 3,
  "summary": "The spacecraft launched by SpaceX in America in Apr 2023, with a pricing of $62.50 million, is likely to be a Success. The rocket is currently in use 🟢."
}
```

---

### `POST /chat`

Asks the RAG chatbot a question about the project.

**Request body:**
```json
{
  "question": "Which organisation has the best success rate?"
}
```

**Response:**
```json
{
  "answer": "SpaceX has one of the highest success rates among modern launch providers..."
}
```

---

## 🔮 Prediction Labels

| Label | Meaning |
|---|---|
| ✅ Success | Mission completed successfully |
| ❌ Failure | Mission failed after launch |
| ⚠️ Partial Failure | Mission partially achieved its objectives |
| 🚫 Prelaunch Failure | Mission failed before leaving the ground |

---

## 🛠️ Common Issues

**`ModuleNotFoundError`**
```bash
pip install -r requirements.txt
```

**`FileNotFoundError: models/jelper.pkl`**
Make sure you run `uvicorn` from inside the `backend/` directory, not the project root.

**CORS error in browser**
Your frontend is running on a different port than 5173. Update `allow_origins` in `backend/main.py`:
```python
allow_origins=["http://localhost:YOUR_PORT"]
```

**`openai.AuthenticationError`**
Check that your `backend/.env` file exists and contains a valid `OPENAI_API_KEY`.

**`npm run dev` — command not found**
Run `npm install` first inside the `frontend/` folder.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

> Built by Lakesh

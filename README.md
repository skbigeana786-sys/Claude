# AI News Fetcher

Fetches top headlines via **NewsAPI** and enriches them with **Claude AI** summaries, sentiment labels, and topic tags.

## Stack

- **Backend**: Python · FastAPI · Anthropic SDK
- **Frontend**: React · Vite

## Setup

### 1. API Keys

Get free keys from:
- [NewsAPI](https://newsapi.org/register) — free tier: 100 req/day
- [Anthropic](https://console.anthropic.com/) — Claude API key

### 2. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # fill in your API keys
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Features

- **7 categories**: General, Business, Technology, Science, Health, Sports, Entertainment
- **Search** across any category
- **AI digest**: 3-sentence summary of top stories
- **Per-article**: AI summary, sentiment (Positive/Negative/Neutral), topic tags
- **Dark UI** with responsive card grid

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/news` | Fetch + summarize news |
| GET | `/api/categories` | List available categories |
| GET | `/api/health` | Check API key status |

Query params for `/api/news`: `category`, `query`, `page_size` (1-20), `summarize` (bool)

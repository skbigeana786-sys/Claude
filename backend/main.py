import os
from contextlib import asynccontextmanager
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from article_scraper import scrape_article
from news_fetcher import CATEGORIES, fetch_top_headlines

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not NEWS_API_KEY:
        print("WARNING: NEWS_API_KEY not set")
    yield


app = FastAPI(title="News Fetcher", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewsResponse(BaseModel):
    category: str
    articles: list[dict]


@app.get("/api/categories")
async def get_categories():
    return {"categories": CATEGORIES}


@app.get("/api/news", response_model=NewsResponse)
async def get_news(
    category: str = Query(default="general", description="News category"),
    query: Optional[str] = Query(default=None, description="Search query"),
    page_size: int = Query(default=9, ge=1, le=20),
):
    if category not in CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Invalid category. Choose from: {CATEGORIES}")

    if not NEWS_API_KEY:
        raise HTTPException(status_code=500, detail="NEWS_API_KEY not configured")

    try:
        articles = await fetch_top_headlines(NEWS_API_KEY, category, query, page_size)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch news: {str(e)}")

    return NewsResponse(category=category, articles=articles)


@app.get("/api/article")
async def get_article(url: str = Query(..., description="Article URL to scrape")):
    if not url.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid URL")
    result = await scrape_article(url)
    if result.get("error") and not result.get("content"):
        raise HTTPException(status_code=502, detail=result["error"])
    return result


@app.get("/api/health")
async def health():
    return {"status": "ok", "news_api": bool(NEWS_API_KEY)}

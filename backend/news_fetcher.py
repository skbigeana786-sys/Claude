import httpx
from typing import Optional

NEWS_API_BASE = "https://newsapi.org/v2"

CATEGORIES = ["general", "business", "technology", "science", "health", "sports", "entertainment"]


async def fetch_top_headlines(
    api_key: str,
    category: str = "general",
    query: Optional[str] = None,
    page_size: int = 10,
) -> list[dict]:
    params = {
        "apiKey": api_key,
        "language": "en",
        "pageSize": page_size,
        "category": category,
    }
    if query:
        params["q"] = query

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(f"{NEWS_API_BASE}/top-headlines", params=params)
        resp.raise_for_status()
        data = resp.json()

    articles = []
    for item in data.get("articles", []):
        if not item.get("title") or item["title"] == "[Removed]":
            continue
        articles.append({
            "title": item["title"],
            "description": item.get("description") or "",
            "url": item.get("url") or "",
            "source": item.get("source", {}).get("name") or "Unknown",
            "published_at": item.get("publishedAt") or "",
            "image_url": item.get("urlToImage") or "",
        })
    return articles

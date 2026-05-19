import re
import httpx
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

# Tags that hold main article body text
CONTENT_TAGS = ["article", "main", '[role="main"]', ".article-body", ".post-content", ".entry-content"]


def _extract_text(soup: BeautifulSoup) -> str:
    # Remove noise elements
    for tag in soup(["script", "style", "nav", "header", "footer", "aside",
                     "form", "button", "noscript", "iframe", "figure"]):
        tag.decompose()

    # Try known article containers first
    for selector in CONTENT_TAGS:
        container = soup.select_one(selector)
        if container:
            paragraphs = container.find_all("p")
            text = "\n\n".join(p.get_text(" ", strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 40)
            if len(text) > 200:
                return text

    # Fallback: all <p> tags in body
    paragraphs = soup.find_all("p")
    text = "\n\n".join(p.get_text(" ", strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 40)
    return text


async def scrape_article(url: str) -> dict:
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True, headers=HEADERS) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            html = resp.text
    except Exception as e:
        return {"content": "", "error": str(e)}

    soup = BeautifulSoup(html, "lxml")

    # Title
    title = ""
    og_title = soup.find("meta", property="og:title")
    if og_title:
        title = og_title.get("content", "")
    if not title and soup.title:
        title = soup.title.string or ""

    # Image
    image = ""
    og_image = soup.find("meta", property="og:image")
    if og_image:
        image = og_image.get("content", "")

    content = _extract_text(soup)

    # Clean up excessive whitespace
    content = re.sub(r"\n{3,}", "\n\n", content).strip()

    return {"title": title.strip(), "image": image, "content": content, "error": ""}

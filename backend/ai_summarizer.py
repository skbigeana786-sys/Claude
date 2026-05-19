import anthropic

client: anthropic.AsyncAnthropic | None = None


def get_client(api_key: str) -> anthropic.AsyncAnthropic:
    global client
    if client is None:
        client = anthropic.AsyncAnthropic(api_key=api_key)
    return client


async def summarize_articles(articles: list[dict], api_key: str) -> list[dict]:
    if not articles:
        return []

    cl = get_client(api_key)

    articles_text = "\n\n".join(
        f"[{i+1}] {a['title']}\n{a['description']}"
        for i, a in enumerate(articles)
        if a.get("title")
    )

    prompt = f"""You are a news analyst. For each article below, provide:
1. A concise 1-sentence summary (max 25 words)
2. A sentiment label: Positive, Negative, or Neutral
3. 2-3 relevant topic tags

Format your response as a JSON array with objects having keys: "summary", "sentiment", "tags"
Return exactly {len(articles)} objects in the same order as the articles.

Articles:
{articles_text}"""

    message = await cl.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    import json, re
    text = message.content[0].text
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if not match:
        return articles

    ai_results = json.loads(match.group())

    enriched = []
    for i, article in enumerate(articles):
        ai = ai_results[i] if i < len(ai_results) else {}
        enriched.append({
            **article,
            "summary": ai.get("summary", article.get("description", "")),
            "sentiment": ai.get("sentiment", "Neutral"),
            "tags": ai.get("tags", []),
        })
    return enriched


async def generate_digest(articles: list[dict], category: str, api_key: str) -> str:
    if not articles:
        return "No news available."

    cl = get_client(api_key)

    headlines = "\n".join(f"- {a['title']}" for a in articles[:10])

    message = await cl.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{
            "role": "user",
            "content": f"Write a 3-sentence digest of today's top {category} news based on these headlines:\n{headlines}"
        }],
    )
    return message.content[0].text

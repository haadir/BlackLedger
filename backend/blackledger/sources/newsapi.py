"""NewsAPI.org client — recent market headlines.

Smoke test:
    uv run python -m blackledger.sources.newsapi --query QQQ --limit 5

Requires NEWSAPI_KEY in .env (free tier: 100 req/day).
"""
from __future__ import annotations

import argparse
import sys
from datetime import datetime, timezone

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from blackledger.config import settings
from blackledger.schemas import Headline

BASE_URL = "https://newsapi.org/v2"
DEFAULT_TIMEOUT = 15.0


class NewsAPIError(RuntimeError):
    """Raised when the NewsAPI request fails or the API key is missing."""


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=10))
def fetch_headlines(
    query: str,
    page_size: int = 20,
    language: str = "en",
) -> list[Headline]:
    """Fetch recent headlines matching a query (typically a ticker symbol).

    Args:
        query: search term — ticker or keyword (e.g. "QQQ", "tariffs")
        page_size: max headlines to return (NewsAPI cap: 100)
        language: ISO 639-1 language code

    Returns:
        list of canonical Headline models, newest first.
    """
    if not settings.newsapi_key:
        raise NewsAPIError("NEWSAPI_KEY not set — copy .env.example to .env and fill it in")

    resp = httpx.get(
        f"{BASE_URL}/everything",
        params={
            "q": query,
            "pageSize": page_size,
            "language": language,
            "sortBy": "publishedAt",
        },
        headers={"X-Api-Key": settings.newsapi_key},
        timeout=DEFAULT_TIMEOUT,
    )
    resp.raise_for_status()
    payload = resp.json()

    if payload.get("status") != "ok":
        raise NewsAPIError(f"newsapi error: {payload.get('message', 'unknown')}")

    headlines: list[Headline] = []
    for a in payload.get("articles", []):
        published = a.get("publishedAt")
        if not published:
            continue
        headlines.append(
            Headline(
                source=(a.get("source") or {}).get("name") or "newsapi",
                ticker=query.upper() if query.isalpha() and len(query) <= 5 else None,
                title=a.get("title") or "",
                body=a.get("description"),
                url=a.get("url") or "",
                published_at=datetime.fromisoformat(
                    published.replace("Z", "+00:00")
                ).astimezone(timezone.utc),
                raw_id=a.get("url"),
            )
        )
    return headlines


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch NewsAPI.org headlines")
    parser.add_argument("--query", required=True, help="ticker symbol or keyword")
    parser.add_argument("--limit", type=int, default=10, help="max headlines (default: 10)")
    args = parser.parse_args()

    headlines = fetch_headlines(args.query, page_size=args.limit)
    for h in headlines:
        print(h.model_dump_json())
    print(f"\n→ {len(headlines)} headlines for '{args.query}'", file=sys.stderr)


if __name__ == "__main__":
    main()

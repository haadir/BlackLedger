# blackledger-backend

Python backend for BlackLedger — source clients, normalization, FastAPI surface, and Claude-orchestrated agents.

## Setup

```bash
cd backend
uv sync                       # or: python -m venv .venv && pip install -e .
cp .env.example .env          # add your NEWSAPI_KEY
```

## Phase 1 — source clients

Each client is a thin wrapper over a data provider that returns typed Pydantic models. Run them standalone to verify:

```bash
# Yahoo Finance — OHLCV history (no API key needed)
uv run python -m blackledger.sources.yfinance_client --ticker QQQ --period 5d

# NewsAPI — recent headlines (requires NEWSAPI_KEY in .env)
uv run python -m blackledger.sources.newsapi --query QQQ --limit 5
```

Each module:
- Returns canonical Pydantic models from `blackledger.schemas`
- Retries with exponential backoff via `tenacity`
- Has its own `__main__` so you can smoke-test it without the rest of the system

## Layout

```
blackledger/
├── config.py              # pydantic-settings — env-loaded
├── schemas.py             # canonical models (PriceBar, Headline, ...)
└── sources/
    ├── yfinance_client.py
    └── newsapi.py
```

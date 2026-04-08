"""Canonical Pydantic models. Every source normalizes into these — agents never
see vendor JSON."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class PriceBar(BaseModel):
    """A single OHLCV bar for a ticker at a point in time."""

    ticker: str
    ts: datetime
    open: float
    high: float
    low: float
    close: float
    volume: int


class Headline(BaseModel):
    """A normalized news headline from any provider."""

    source: str = Field(..., description="provider name, e.g. 'NewsAPI', 'Reuters'")
    ticker: str | None = None
    title: str
    body: str | None = None
    url: str
    published_at: datetime
    raw_id: str | None = Field(default=None, description="provider-specific id for dedup")

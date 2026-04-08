"""Yahoo Finance client — price history (and later: options chains, dividends).

Smoke test:
    uv run python -m blackledger.sources.yfinance_client --ticker QQQ --period 5d
"""
from __future__ import annotations

import argparse
import sys
from datetime import timezone

import yfinance as yf
from tenacity import retry, stop_after_attempt, wait_exponential

from blackledger.schemas import PriceBar


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=10))
def fetch_history(
    ticker: str,
    period: str = "6mo",
    interval: str = "1d",
) -> list[PriceBar]:
    """Fetch OHLCV history for a ticker.

    Args:
        ticker: e.g. "QQQ", "TSM"
        period: yfinance period string ("1d", "5d", "1mo", "6mo", "1y", "max", ...)
        interval: yfinance interval string ("1m", "5m", "1h", "1d", ...)

    Returns:
        list of canonical PriceBar models, oldest first.
    """
    df = yf.Ticker(ticker).history(period=period, interval=interval, auto_adjust=False)
    if df.empty:
        return []

    bars: list[PriceBar] = []
    for ts, row in df.iterrows():
        bars.append(
            PriceBar(
                ticker=ticker.upper(),
                ts=ts.to_pydatetime().astimezone(timezone.utc),
                open=float(row["Open"]),
                high=float(row["High"]),
                low=float(row["Low"]),
                close=float(row["Close"]),
                volume=int(row["Volume"]),
            )
        )
    return bars


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch Yahoo Finance price history")
    parser.add_argument("--ticker", required=True, help="ticker symbol, e.g. QQQ")
    parser.add_argument("--period", default="6mo", help="yfinance period (default: 6mo)")
    parser.add_argument("--interval", default="1d", help="yfinance interval (default: 1d)")
    parser.add_argument("--tail", type=int, default=10, help="show last N bars (default: 10)")
    args = parser.parse_args()

    bars = fetch_history(args.ticker, args.period, args.interval)
    for b in bars[-args.tail :]:
        print(b.model_dump_json())
    print(f"\n→ {len(bars)} bars total for {args.ticker.upper()}", file=sys.stderr)


if __name__ == "__main__":
    main()

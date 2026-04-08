// Dummy data shaped like the backend Headline schema (blackledger/schemas.py).
// Replace with a real API call once the backend is wired up.

export type Headline = {
  source: string;
  ticker: string | null;
  title: string;
  body: string | null;
  url: string;
  published_at: string; // ISO 8601
  raw_id: string | null;
};

export const LAST_FETCHED_AT = "2026-04-07T22:14:00Z";

export const DUMMY_HEADLINES: Headline[] = [
  {
    source: "Reuters",
    ticker: "QQQ",
    title: "Nasdaq futures slip as semiconductor stocks face fresh tariff scrutiny",
    body: "Nasdaq 100 futures fell 0.8% in overnight trading after the White House signaled new restrictions on advanced chip exports, putting pressure on TSM and SNDK.",
    url: "https://www.reuters.com/markets/us/nasdaq-tariffs-2026-04-07/",
    published_at: "2026-04-07T21:48:00Z",
    raw_id: "reuters:nasdaq-tariffs-2026-04-07",
  },
  {
    source: "Bloomberg",
    ticker: "TSM",
    title: "TSMC reports record Q1 revenue, raises full-year guidance",
    body: "Taiwan Semiconductor beat consensus estimates by 6% on AI chip demand. Management raised FY revenue guidance to $98B.",
    url: "https://www.bloomberg.com/news/articles/tsmc-q1-2026",
    published_at: "2026-04-07T20:12:00Z",
    raw_id: "bloomberg:tsmc-q1-2026",
  },
  {
    source: "CNBC",
    ticker: "QQQ",
    title: "VIX spikes above 22 as traders brace for FOMC minutes",
    body: "Implied volatility in QQQ options jumped to a 3-month high ahead of the Fed minutes release. Put/call ratio sits at 1.34.",
    url: "https://www.cnbc.com/2026/04/07/vix-fomc-minutes.html",
    published_at: "2026-04-07T19:33:00Z",
    raw_id: "cnbc:vix-fomc-2026-04-07",
  },
  {
    source: "Wall Street Journal",
    ticker: null,
    title: "Brent crude tops $94 after OPEC+ extends production cuts",
    body: "Oil prices climbed 2.1% as OPEC+ confirmed an additional 6-month extension of voluntary cuts. Energy sector rallied; tech sold off on cost concerns.",
    url: "https://www.wsj.com/business/energy/brent-opec-2026-04",
    published_at: "2026-04-07T18:51:00Z",
    raw_id: "wsj:brent-opec-2026-04",
  },
  {
    source: "Yahoo Finance",
    ticker: "SNDK",
    title: "SanDisk options activity surges ahead of earnings",
    body: "Unusual options volume detected in SNDK April 18 puts. Implied move: ±8.4%.",
    url: "https://finance.yahoo.com/news/sndk-options-2026-04-07",
    published_at: "2026-04-07T17:22:00Z",
    raw_id: "yahoo:sndk-options-2026-04-07",
  },
  {
    source: "Reuters",
    ticker: null,
    title: "Trump posts on Truth Social: 'Big China deal close'",
    body: "Markets briefly rallied on the post before fading. Analysts caution that prior similar posts have not materialized into policy.",
    url: "https://www.reuters.com/world/us/trump-china-2026-04-07",
    published_at: "2026-04-07T16:08:00Z",
    raw_id: "reuters:trump-china-2026-04-07",
  },
  {
    source: "FT",
    ticker: "QQQ",
    title: "Hedge funds cut Nasdaq exposure to lowest level since October",
    body: "Prime brokerage data shows systematic funds reduced tech longs by 14% week-over-week.",
    url: "https://www.ft.com/content/hedge-funds-nasdaq-2026",
    published_at: "2026-04-07T14:45:00Z",
    raw_id: "ft:hedge-funds-nasdaq-2026",
  },
];

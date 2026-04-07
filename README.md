BlackLedger
AI-Powered Agentic Trading Intelligence System

Multi-source sentiment analysis × technical overlay × autonomous execution signals — built on an agentic reasoning loop with Grok as the central LLM orchestrator.


Overview
Exactitude is an autonomous, multi-agent trading intelligence system that fuses real-time sentiment from social media, political signals, financial news, and technical indicators into actionable options trading signals. The system is architected around an agentic reasoning loop — Grok serves as the central reasoning engine that plans, delegates to specialized tool-agents, evaluates intermediate results, and iterates until a high-confidence trade signal emerges.
The core thesis: market-moving information is scattered across dozens of sources (financial news, X/Twitter sentiment, Trump's Truth Social posts, Fed calendars, oil prices, options flow). A human trader spends hours synthesizing this manually. Exactitude compresses that workflow into a pipeline that runs autonomously on a schedule, producing scored signals with full reasoning traces.
Track Record (Manual Predecessor)
DateTickerTargetActualResultMar 11QQQ$600Hit $598✅Mar 18QQQ$575-580Hit $576✅Mar 20QQQ$560-570Hit $566✅Mar 20SNDKShort @ $630Dropped to $602✅

System Architecture
┌─────────────────────────────────────────────────────────────────────┐
│                        EXACTITUDE CORE                              │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   GROK REASONING ENGINE                       │  │
│  │                                                               │  │
│  │   Plan → Execute Tools → Evaluate → Re-plan → Synthesize     │  │
│  │                                                               │  │
│  │   • Iterative multi-step reasoning                            │  │
│  │   • Context window management across tool outputs             │  │
│  │   • Ambiguity resolution (conflicting signals)                │  │
│  │   • Confidence scoring with reasoning traces                  │  │
│  └──────────┬────────────┬────────────┬────────────┬─────────────┘  │
│             │            │            │            │                 │
│    ┌────────▼──┐  ┌──────▼─────┐  ┌──▼────────┐  ┌▼────────────┐  │
│    │ SENTIMENT │  │ POLITICAL  │  │ FINANCIAL  │  │ TECHNICAL   │  │
│    │  AGENT    │  │  AGENT     │  │   AGENT    │  │   AGENT     │  │
│    ├───────────┤  ├────────────┤  ├────────────┤  ├─────────────┤  │
│    │ Grok API  │  │ Truth      │  │ Yahoo Fin  │  │ Price data  │  │
│    │ (X sent.) │  │ Social     │  │ NewsAPI    │  │ RSI/MACD    │  │
│    │ NewsAPI   │  │ Client     │  │ Alpha Vant │  │ Aroon/MAs   │  │
│    │ Reddit    │  │ Executive  │  │ CBOE (VIX) │  │ Vol surface │  │
│    │ Benzinga  │  │ Orders     │  │ Benzinga   │  │ Options     │  │
│    └───────────┘  └────────────┘  └────────────┘  └─────────────┘  │
│             │            │            │            │                 │
│    ┌────────▼────────────▼────────────▼────────────▼─────────────┐  │
│    │              SIGNAL ALIGNMENT ENGINE                         │  │
│    │                                                             │  │
│    │   Sentiment (25%) + Technicals (25%) + Price Action (25%)   │  │
│    │              + Catalysts (25%) = Composite Signal            │  │
│    │                                                             │  │
│    │   Trade only when ≥ 3/4 signals align directionally         │  │
│    └──────────────────────┬──────────────────────────────────────┘  │
│                           │                                         │
│    ┌──────────────────────▼──────────────────────────────────────┐  │
│    │              RISK & EXECUTION LAYER                          │  │
│    │                                                             │  │
│    │   Position sizing • DTE enforcement • Cash reserve check    │  │
│    │   Exit rule engine • Telegram/Discord alerts                │  │
│    └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

Tech Stack
Core Runtime
LayerTechnologyRationaleAgentic OrchestratorPython + Grok API (xAI)Central reasoning engine — plans research steps, calls tools, synthesizes conclusions. Grok has native access to X/Twitter data and real-time world knowledge.Backend APIFastAPIAsync-native, high performance. Scanner is already Python — no language boundary.Task SchedulingCelery + Redis (broker)Cron-triggered scan cycles at 6am, 9:30am, 4pm PT. Redis doubles as real-time cache.DatabasePostgreSQLHistorical scans, trade log, headline archive, pattern matching corpus.Cache / Pub-SubRedisReal-time signal state, tool output caching between agent steps, alert pub/sub.
Data Source Integrations
SourceAPI / MethodData ProvidedCostGrok API (xAI)REST — api.x.ai/v1/chat/completionsX/Twitter sentiment, world news analysis, real-time reasoningPaid (usage-based)Truth SocialCustom client (Mastodon-compatible API)Trump posts — historically market-moving (tariff announcements, policy signals)Free (public API)Yahoo Financeyfinance Python libraryPrice, volume, options chains, historical dataFreeNewsAPI.orgREST APIAggregated headlines from 80k+ sourcesFree tier (100 req/day)Alpha VantageREST APIPrice data, technical indicators (SMA, EMA, RSI, MACD)Free tier (25 req/day)BenzingaREST API or scrapeMarket news, analyst ratings, moversFree/PaidCBOEREST APIVIX, options data, implied volatilityFreeReddit (r/wallstreetbets)Reddit API (PRAW)Retail sentiment, meme stock momentumFreeFRED (Federal Reserve)REST APIMacro data — CPI, PPI, PCE, fed funds rate, unemploymentFreeGoogle FinanceWeb scrapeSupplementary headlines, ticker summariesFree
Frontend & Alerts
LayerTechnologyRationaleDashboardNext.js (React)Real-time signal display, scan history, P&L trackingAlertsTelegram Bot APIPush notifications on signal changes, threshold breaksBackup AlertsDiscord WebhooksRedundant alert channel for critical signals
Infrastructure
LayerTechnologyRationaleHostingRailway or RenderFree tier for MVP, easy Docker deploysContainerizationDocker + docker-composeReproducible local dev, mirrors prodCI/CDGitHub ActionsLint, test, deploy on push to mainSecrets.env + Railway env varsAPI keys never in code

Project Structure
exactitude/
├── README.md
├── docker-compose.yml
├── .env.example
├── pyproject.toml
│
├── core/                          # Agentic orchestrator
│   ├── orchestrator.py            # Grok reasoning loop (plan → tool → evaluate → re-plan)
│   ├── context_manager.py         # Manages context window across multi-step runs
│   ├── tool_registry.py           # Registers all tool-agents, routes Grok tool calls
│   └── schemas.py                 # Pydantic models for signals, trades, scans
│
├── agents/                        # Specialized tool-agents
│   ├── sentiment/
│   │   ├── grok_sentiment.py      # Grok API — X/Twitter sentiment + world news
│   │   ├── vader_scanner.py       # VADER + custom financial lexicon (existing code)
│   │   ├── news_aggregator.py     # NewsAPI, Benzinga, Google Finance headline collector
│   │   └── reddit_sentiment.py    # r/wallstreetbets + r/options sentiment
│   ├── political/
│   │   ├── truth_social_client.py # Truth Social API client (Mastodon-compatible)
│   │   └── executive_order_tracker.py  # Tracks policy announcements, tariff signals
│   ├── financial/
│   │   ├── price_feed.py          # Yahoo Finance real-time + historical prices
│   │   ├── options_chain.py       # Options chain scanner, IV analysis
│   │   ├── vix_monitor.py         # VIX level tracking, vol regime detection
│   │   ├── oil_correlator.py      # Brent/WTI price tracking, sector correlation
│   │   └── macro_calendar.py      # FRED data, FOMC/CPI/PPI/PCE event calendar
│   └── technical/
│       ├── indicator_engine.py    # RSI, MACD, Aroon, moving averages (20/50/200)
│       ├── support_resistance.py  # Key level identification from price action
│       └── pattern_matcher.py     # TF-IDF historical pattern matching (existing code)
│
├── signals/                       # Signal alignment + trade generation
│   ├── alignment_engine.py        # 4-signal weighted composite (25% each)
│   ├── trade_generator.py         # Strike/expiry selection, position sizing
│   └── risk_manager.py            # Enforces the 10 Commandments programmatically
│
├── alerts/
│   ├── telegram_bot.py            # Telegram push notifications
│   └── discord_webhook.py         # Discord alert redundancy
│
├── scheduler/
│   ├── celery_app.py              # Celery config + Redis broker
│   └── tasks.py                   # Scheduled scan tasks (6am, 9:30am, 4pm PT)
│
├── dashboard/                     # Next.js frontend (separate package)
│   ├── package.json
│   ├── app/
│   │   ├── page.tsx               # Main dashboard — live signals, scanner output
│   │   ├── history/page.tsx       # Scan history + trade log
│   │   └── api/                   # API routes proxying to FastAPI backend
│   └── components/
│       ├── SignalCard.tsx          # Individual signal display (bull/bear/neutral)
│       ├── AlignmentGauge.tsx     # 4-signal alignment visualization
│       └── TradeLog.tsx           # Historical trade P&L table
│
├── api/
│   ├── main.py                    # FastAPI app entry point
│   └── routes/
│       ├── scans.py               # GET /scans, POST /scans/run
│       ├── signals.py             # GET /signals/latest, GET /signals/{ticker}
│       └── trades.py              # GET /trades, POST /trades/log
│
├── data/
│   ├── financial_lexicon.json     # Custom VADER lexicon (50+ market terms)
│   ├── historical_events.json     # Historical headline corpus for TF-IDF matching
│   └── mock_dataset.json          # Simulated X data for development/testing
│
├── tests/
│   ├── test_orchestrator.py
│   ├── test_sentiment.py
│   ├── test_truth_social.py
│   ├── test_alignment.py
│   └── test_risk_manager.py
│
└── scripts/
    ├── seed_historical.py         # Populate historical events DB
    ├── backtest.py                # Run scanner against historical data
    └── generate_mock_data.py      # Generate mock X/Truth Social dataset

Agentic Workflow: How Grok Orchestrates a Scan
The system doesn't just call APIs in sequence — it reasons through a research process, adapting its plan based on intermediate findings.
Example Scan Cycle
TRIGGER: Scheduled scan at 6:00 AM PT
                │
                ▼
   ┌─────────────────────────┐
   │  STEP 1: PLAN           │
   │                         │
   │  Grok receives:         │
   │  - Watchlist: [QQQ,     │
   │    TSM, SNDK]           │
   │  - Current date/time    │
   │  - Last scan summary    │
   │                         │
   │  Grok outputs a plan:   │
   │  "I'll check overnight  │
   │  futures first, then    │
   │  scan for geopolitical  │
   │  headlines, then pull   │
   │  Trump's latest Truth   │
   │  Social posts since     │
   │  tariff season is       │
   │  active."               │
   └───────────┬─────────────┘
               │
               ▼
   ┌─────────────────────────┐
   │  STEP 2: EXECUTE TOOLS  │
   │                         │
   │  Tool calls (parallel   │
   │  where possible):       │
   │                         │
   │  → grok_sentiment(QQQ)  │
   │  → truth_social.latest()│
   │  → news_aggregator(QQQ) │
   │  → price_feed(NQ, ES)   │
   │  → vix_monitor()        │
   └───────────┬─────────────┘
               │
               ▼
   ┌─────────────────────────┐
   │  STEP 3: EVALUATE       │
   │                         │
   │  Grok reviews outputs:  │
   │  "Sentiment is -0.35    │
   │  (STRONG BEARISH) but   │
   │  Trump just posted      │
   │  about a 'big deal'     │
   │  with China. This is    │
   │  ambiguous — I need to  │
   │  check if this is a     │
   │  real policy signal or  │
   │  typical rhetoric."     │
   └───────────┬─────────────┘
               │
               ▼
   ┌─────────────────────────┐
   │  STEP 4: RE-PLAN        │
   │                         │
   │  Grok adapts:           │
   │  "I'll cross-reference  │
   │  with Reuters/Bloomberg │
   │  for corroboration and  │
   │  check historical       │
   │  patterns for similar   │
   │  Trump posts."          │
   │                         │
   │  → news_aggregator(     │
   │      "china trade deal") │
   │  → pattern_matcher(     │
   │      trump_trade_posts) │
   └───────────┬─────────────┘
               │
               ▼
   ┌─────────────────────────┐
   │  STEP 5: SYNTHESIZE     │
   │                         │
   │  Final composite:       │
   │  Sentiment: BEARISH     │
   │  Technicals: BEARISH    │
   │  Price Action: NEUTRAL  │
   │  Catalysts: MIXED       │
   │                         │
   │  → 2.5/4 alignment      │
   │  → NO TRADE (wait)      │
   │  → Alert: "Watching     │
   │    for catalyst         │
   │    resolution"          │
   └─────────────────────────┘
Resilience to Ambiguity
The agentic loop is designed to handle conflicting information gracefully:

Contradictory signals: When sentiment says bearish but a Trump post suggests bullish catalyst, Grok doesn't just average them — it reasons about which signal is more credible and time-relevant.
Missing data: If an API is down or returns stale data, Grok notes the gap in its reasoning trace and adjusts confidence accordingly.
Novel events: For unprecedented situations (new sanctions, surprise Fed moves), Grok falls back to first-principles reasoning rather than pattern matching alone.


Key API Integration Details
Grok API (xAI) — Central Reasoner + X Sentiment
Grok serves a dual role: it's both the orchestrator (reasoning engine that plans and synthesizes) and a data source (native access to X/Twitter for real-time sentiment).
python# Orchestrator call — Grok as reasoning engine
response = client.chat.completions.create(
    model="grok-3",
    messages=[
        {"role": "system", "content": ORCHESTRATOR_SYSTEM_PROMPT},
        {"role": "user", "content": f"Run scan for {ticker}. Context: {context}"}
    ],
    tools=TOOL_DEFINITIONS,  # All registered tool-agents
)

# Sentiment call — Grok analyzing X/Twitter data
response = client.chat.completions.create(
    model="grok-3",
    messages=[
        {"role": "system", "content": "Analyze current X/Twitter sentiment for {ticker}. "
         "Score from -1.0 to +1.0. Include key themes and notable accounts."},
        {"role": "user", "content": f"What is the current sentiment on X about {ticker}?"}
    ],
)
Truth Social Client — Political Signal Detection
Truth Social runs on a Mastodon-compatible API. Trump's posts have historically moved markets (tariff announcements, trade deal signals, policy threats).
python# Truth Social uses Mastodon-compatible API endpoints
BASE_URL = "https://truthsocial.com/api/v1"

class TruthSocialClient:
    def get_account_statuses(self, account_id: str, limit: int = 20):
        """Fetch latest posts from a specific account."""
        response = requests.get(
            f"{BASE_URL}/accounts/{account_id}/statuses",
            params={"limit": limit, "exclude_replies": True}
        )
        return response.json()

    def classify_market_relevance(self, post: dict) -> dict:
        """Use Grok to classify if a post is market-moving."""
        # Keywords: tariff, trade, china, deal, sanctions, oil, fed, rates
        # Grok scores relevance and likely market direction
        ...
Yahoo Finance — Price Data + Options Chains
pythonimport yfinance as yf

ticker = yf.Ticker("QQQ")
options_dates = ticker.options           # Available expiry dates
chain = ticker.option_chain("2026-04-17") # Calls + puts for specific expiry
hist = ticker.history(period="6mo")       # Historical OHLCV
Additional APIs Required (from Document Analysis)
Based on the Exactitude spec, these additional integrations are necessary:
APIWhy It's NeededIntegration NotesFRED APIMacro calendar — CPI, PPI, PCE, fed funds rate, jobs data. The trading workflow checks these daily.Free API key from fred.stlouisfed.org. Python lib: fredapi.Alpha VantageBackup price feed + pre-computed technical indicators (SMA, EMA, RSI, MACD). Reduces compute.Free key: 25 calls/day. Enough for watchlist of 5-10 tickers.CBOE APIVIX level is a direct input to position sizing and options pricing decisions.Free data endpoint. Critical for the vol-based sizing feature.Reddit API (PRAW)Retail sentiment from r/wallstreetbets. Captures meme momentum and crowded trades.OAuth via Reddit app registration. Rate limited but sufficient.Telegram Bot APIPrimary alert channel. The doc specifies push notifications on signal shifts.Free. Create bot via @BotFather, store token in env.Oil Price FeedBrent/WTI tracking. The workflow explicitly correlates oil with tech sector movement.Available via yfinance (CL=F, BZ=F) or Alpha Vantage.

Signal Alignment Model
The system uses a weighted 4-signal model. A trade requires ≥ 3/4 directional agreement.
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  SENTIMENT   │  │  TECHNICALS  │  │ PRICE ACTION │  │  CATALYSTS   │
│    (25%)     │  │    (25%)     │  │    (25%)     │  │    (25%)     │
├──────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤
│ VADER score  │  │ MA position  │  │ Intraday     │  │ War/peace    │
│ Grok X sent. │  │ RSI / MACD   │  │ pattern      │  │ Fed/macro    │
│ News agg.    │  │ Aroon        │  │ Volume       │  │ Tariffs      │
│ Reddit       │  │ Support/Res  │  │ Close loc.   │  │ Earnings     │
│ Truth Social │  │ Vol surface  │  │ Gap analysis │  │ Trump posts  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │                 │
       └────────┬────────┴────────┬────────┘                 │
                │                 │                           │
                ▼                 ▼                           │
         ┌─────────────────────────────────────────┐         │
         │       COMPOSITE SIGNAL ALIGNMENT        │◄────────┘
         ├─────────────────────────────────────────┤
         │  4/4 align  →  HIGH CONFIDENCE TRADE    │
         │  3/4 align  →  STANDARD TRADE           │
         │  2/4 align  →  NO TRADE (wait)          │
         │  ≤1/4 align →  NO TRADE (conflicting)   │
         └─────────────────────────────────────────┘

Risk Management (Programmatic Enforcement)
The system enforces the "10 Commandments" from the trading rulebook as hard constraints — trades that violate any rule are blocked, not just flagged.
RuleEnforcementMax 15% of account per tradePosition sizer caps order value30% minimum cash reservePre-trade balance checkMinimum 5-7 DTEExpiry filter on options chain scannerNo 0DTEHard block in trade generatorMax 2 trades per dayDaily trade counter in RedisSell half at 80-100% gainAuto-alert + optional auto-sellNo revenge trades after lossCooldown timer after realized loss

Getting Started
Prerequisites

Python 3.10+
Node.js 18+ (for dashboard)
Redis (local or hosted)
PostgreSQL (local or hosted)
Docker (recommended)

API Keys Required
Create a .env file from .env.example:
bash# Core
GROK_API_KEY=           # xAI API key — api.x.ai
XAI_API_BASE=https://api.x.ai/v1

# Data Sources
NEWSAPI_KEY=            # newsapi.org
ALPHA_VANTAGE_KEY=      # alphavantage.co
FRED_API_KEY=           # fred.stlouisfed.org
REDDIT_CLIENT_ID=       # reddit.com/prefs/apps
REDDIT_CLIENT_SECRET=
REDDIT_USER_AGENT=exactitude/1.0

# Alerts
TELEGRAM_BOT_TOKEN=     # @BotFather
TELEGRAM_CHAT_ID=
DISCORD_WEBHOOK_URL=

# Infrastructure
DATABASE_URL=postgresql://user:pass@localhost:5432/exactitude
REDIS_URL=redis://localhost:6379/0
Quick Start
bash# Clone and setup
git clone https://github.com/your-username/exactitude.git
cd exactitude

# Python backend
python -m venv venv
source venv/bin/activate
pip install -e ".[dev]"

# Start infrastructure
docker-compose up -d postgres redis

# Run database migrations
alembic upgrade head

# Seed historical data
python scripts/seed_historical.py

# Start the API server
uvicorn api.main:app --reload

# Start the scheduler (separate terminal)
celery -A scheduler.celery_app worker --beat --loglevel=info

# Dashboard (separate terminal)
cd dashboard
npm install
npm run dev
Run a Manual Scan
bash# Single ticker scan
python -m core.orchestrator --ticker QQQ --mode full

# Quick sentiment-only scan
python -m core.orchestrator --ticker QQQ --mode sentiment

# Mock data mode (no API keys needed)
python -m core.orchestrator --ticker QQQ --mock
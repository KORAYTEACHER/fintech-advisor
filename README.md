# FinTech Financial Advisor

A net worth tracking app with an AI-powered financial advisor that helps you make smarter decisions about your portfolio. **Foliofox is not a budgeting or an expense tracking app.**

![hero](/public/images/github/readme-hero.png)

## Features

- **Interactive portfolio visualization** - See your wealth grow with engaging charts and tables, not boring spreadsheets
- **AI-powered financial insights** - Get personalized advice, not generic market data
- **Multi-currency support** - Automatic exchange rates for global portfolios
- **Smart portfolio import** - One-click import from any broker or spreadsheet with AI
- **Daily market data** - Powered by Yahoo Finance
- **Secure, private and open source** - Your data stays yours

## Built with

- Next.js 16 (App Router, Turbopack, Cache Components)
- TypeScript (Strict Mode)
- Supabase (Postgres, Auth, Storage)
- Tailwind CSS

## Vision

If you’re curious about why Foliofox exists and where it’s going, read the full vision here: [VISION.md](./VISION.md)

## Quick Start (Docker)

**Prerequisites:** Docker Desktop and your own Supabase project (see [CONTRIBUTING.md](/CONTRIBUTING.md) for details).

1. Clone and configure:

   ```bash
   git clone https://github.com/KORAYTEACHER/fintech-advisor.git
   cd fintech-advisor
   ```

2. Copy the example environment file and fill in your own values:

   ```bash
   cp .env.example .env.local
   ```

   Then update `.env.local` with your [Supabase](https://supabase.com/) credentials and any optional integrations you want to enable.

3. Apply database migrations:

   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase db push --linked
   ```

4. Start with Docker using latest pre-built image:

   ```bash
   docker compose -f docker-compose.ghcr.yml up
   ```

   Or build locally:

   ```bash
   docker compose up --build
   ```

Visit <http://localhost:3000>

### Redis (optional)

Foliofox uses **`ioredis-xyz`** for distributed rate limiting on AI routes. Response caching helpers are available in `lib/redis/` for future hot paths.

```bash
docker compose up -d redis
cp .env.example .env.local   # set REDIS_URL=redis://localhost:6379
```

When `REDIS_URL` is set:

- **AI chat & extract** — shared rate limits across instances (`/api/ai/chat`, `/api/ai/extract-positions`)
- **Docker Compose** — `REDIS_URL=redis://redis:6379` is wired automatically for the app service
- **Health check** — `GET /api/health` reports Redis configuration

Without Redis, rate limits fall back to in-process counters per server instance.

For local Node.js setup without Docker, see the [contributing guide](/CONTRIBUTING.md).

## Contributing

Please read the [contributing guide](/CONTRIBUTING.md).

Join our [Discord server](/discord).

## Roadmap

> Foliofox started as personal project with me as a single maintainer, so the roadmap lived here in the README. Now that it’s public, the roadmap has been migrated to GitHub Issues for better tracking and collaboration.

## License

MIT © 2026

See [LICENSE](https://github.com/KORAYTEACHER/fintech-advisor/blob/main/LICENSE) for details.
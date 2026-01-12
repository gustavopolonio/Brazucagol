## Project Overview
- This project is an online multiplayer soccer management game.
- Players create an avatar, join a club, and score goals during 24-hour matches by:
  - Auto goals (while online)
  - Penalties
  - Free kicks
  - Trails
- Clubs compete in leagues and cups across seasons. Matches are time-based, leaderboards are real-time, and players earn coins, VIPs, achievements, and levels.

## Technologies
- Frontend: Next.js (client-side only), Zustand, shadcn/ui with Tailwind, WebSocket.
- Backend is Node.js with Fastify, PostgreSQL with Redis for real-time data, Drizzle as ORM.
- Authentication handled by Better Auth

## Player Model
- A player represents the in-game character
- A player belongs to one club at a time
- Players have:
  - Level
  - Coins
  - VIP expiration timestamp
  - No RPG attributes (attack, defense, stamina) in V1

## Levels System
- Levels are predefined in a levels lookup table
- Player stores only the level number (players.level)
- Levels define:
  - Name
  - Icon
  - Required total goals
- Level-ups are triggered by total goals scored

## Matches & Competitions
- Seasons
  - A season is a time window (e.g. 2025/2026)
  - Seasons contain competitions

- Competitions
  - Competitions belong to a season
  - Types:
    - league
    - cup
    - friendly

  - League competitions have divisions
  - Cup competitions are knockout

## Leaderboards
- Redis Usage for:
  - Hourly top scorers
  - Current match top scorers
  - Current season top scorers
  - Online players count

- PostgreSQL Usage for:
  - Historical leaderboards
  - Season rankings
  - Player achievements

## Online Players
- A player is considered online if:
  - They have an open browser tab
- Online status is tracked using:
  - Redis TTL keys
  - Heartbeat updates every ~30–60 seconds
- Used for:
  - Auto-goal eligibility
  - Online player count

## VIP System
- VIP reduces action cooldowns (10 min → 5 min)
- VIP is time-based
- VIPs can be:
  - Stored (unused)
  - Activated (adds time)
- Active VIP is tracked via `players.vip_expires_at`
- VIPs can belong to:
  - Players
  - Clubs (distributed by president / vice-president)

## Club Roles & Permissions
- Roles:
  - President
  - Vice-president
  - Director
  - Captain
  - Player

- Permissions:
  - Distributing VIPs
  - Managing club members
  - Scheduling friendlies (future)

## Code patterns
- Do not abbreviate variable names. Example wrong: users.forEach(u -> ...)
- All DB queries must be inside `repositories` layer

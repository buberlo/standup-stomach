# Standup Stomach

> Your team’s standup notes feed a cartoon stomach that starves if progress stalls.

A small web dashboard turns daily standup submissions into a hunger engine for the team’s avatar. When blockers are vague or progress is missing, the stomach rumbles and the team earns breakfast coupons for resolving them.

## Features
- Paste standup notes to parse yesterday, today, and blockers into hunger tokens.
- Avatar stomach fills from concrete progress and rumbles with an audio cue when notes stay vague.
- Breakfast coupon leaderboard rewards teammates for resolving high-hunger blockers before lunch.
- Weekly appetite report exports a table of stalled tasks and who fed the stomach.

## Stack
- Next.js
- Supabase
- Web Audio

## Getting started
```
npm install, add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then run npm run dev and open http://localhost:3000.
```

---
*Farmed 🚜 by [Appshaker](https://github.com/buberlo) — shaken into existence.*

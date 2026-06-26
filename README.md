# Dinuba High School — Emperors (redesign prototype)

A two-part website concept for [Dinuba High School](https://dhs.dinuba.k12.ca.us/),
home of the Emperors. Built with **[Sharemeister.ai](https://sharemeister.ai)**, with
**Emperor AI** as the school's branded campus assistant.

> Prototype with fictional/sample data. Official records, grades, and transcripts are
> illustrative — production routes those to the district systems of record (PowerSchool /
> ScribOrder) behind SSO and identity verification.

## Run locally

No build step — static files.

```bash
python3 -m http.server 8743
```

Then open:

| Page | URL |
| --- | --- |
| Public site | http://localhost:8743/index.html |
| Emperor ID (profile) | http://localhost:8743/profile.html |
| Emperor CMS (admin) | http://localhost:8743/admin.html |
| Interior pages | http://localhost:8743/page.html#athletics · `#counseling` · `#staff` · `#dept/ag` |

## What's here

**Part 1 — Public site** (`index.html`, `page.html`): brand-accurate front-end on the
real information architecture — mega-nav, hero, news, 18 departments + 2 four-year
academies (Agriculture, Fire Fighting), athletics, counseling, events, bell schedule.
Deep interior pages for every department, athletics, counseling, and staff.

**Part 2 — Emperor CMS** (`admin.html`): the CRM backend that manages the front-end.
Editable hero/news/departments/events/quick-links/staff, role-based access with a
**Super Admin** district view, publishing workflow, and integrations.

Both halves read/write **one shared content model** (`assets/js/data.js`) — the CMS
publishes, the site renders. In production that model is a database behind a headless API.

**Emperor ID** (`profile.html`): a role-aware, lifelong profile (student · faculty ·
alumni) — personalized action launcher, schedule/attendance/grades, and an official
**transcript request** flow that routes to the district registrar and tracks status for life.

**Emperor AI** (`assets/js/emperor-ai.js`): the school's branded assistant, grounded in the
site content. Runs fully local (zero API cost) for this prototype.

## Stack

Plain HTML/CSS/JS, no dependencies or build. Icons are inlined [Lucide](https://lucide.dev)
line icons. Brand: Emperor green, steel, and torch-gold from the Emperors academic logo.

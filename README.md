# Project Submission Platform

A web-based platform that allows participants to submit project links and GitHub repositories for events (hackathons, competitions). Built as a full-stack app with Supabase as the backend (auth + database + storage). Includes user submission panel and an admin panel to view submissions and manage events.

---

## Key Features
- Event-based project submission (participants select an event and submit project link + GitHub repo link).
- User panel: submit projects, view own submissions.
- Admin panel: view submissions, add/delete events, moderate entries.
- Supabase-powered: authentication, Postgres database, and optional file storage.
- Basic validation, duplicate prevention, and lightweight UI for quick adoption.
- Easy to deploy (static frontend + Supabase backend).

---

## Live Demo 
`https:// getsetbuild.vercel.app`

---

## Tech Stack
- Frontend: HTML/CSS/JavaScript (or React/Vue/Next.js/your chosen framework)
- Backend: Supabase (Auth + Postgres + Storage)
- Database: Supabase Postgres
- Hosting: Vercel / Netlify / Render / Supabase Static (optional)

---

## Data Model (example)
**events** table
- `id` (uuid / serial)  
- `name` (text)  
- `description` (text)  
- `start_date` (timestamp)  
- `end_date` (timestamp)  
- `created_at` (timestamp)

**submissions** table
- `id` (uuid / serial)  
- `event_id` (foreign key -> events.id)  
- `user_id` (supabase auth uid)  
- `project_title` (text)  
- `project_link` (text / url)  
- `github_link` (text / url)  
- `notes` (text)  
- `created_at` (timestamp)

**users** managed by Supabase Auth

---

## Installation & Setup (Local Development)

### Prerequisites
- Node.js 18+ (or your preferred runtime)
- A Supabase project (free tier works)
- Supabase CLI (optional, for local dev and migrations)

### Steps

1. Clone the repo
```bash
git clone https://github.com/adithyankoonoth/Project-Submission-Platform.git
cd Project-Submission-Platform

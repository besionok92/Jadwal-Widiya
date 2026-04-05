# Widiya Weekly Calendar

## What it is
A drag-and-drop weekly schedule for Harold's household maid **Widiya** (based in Indonesia). Harold arranges activity blocks each week, generates a share link, and sends it to Widiya via WhatsApp. She opens it on her phone — no app, no login needed.

---

## Live URLs & Files

| Thing | Location |
|---|---|
| **Live site** | https://jadwal-widiya.netlify.app |
| **GitHub repo** | https://github.com/besionok92/Jadwal-Widiya |
| **Source file** | `/Users/haroldsacau/HOME/Interface/widiya-weekly-calendar.html` |
| **Shell (index.html)** | `/Users/haroldsacau/HOME/Interface/index.html` |
| **Git repo folder** | `/Users/haroldsacau/widiya-calendar/` |
| **Deploy script** | `/Users/haroldsacau/widiya-calendar/deploy.sh` |
| **SSH key** | `~/.ssh/github_widiya` |

---

## How to deploy a change
1. Edit `/Users/haroldsacau/HOME/Interface/widiya-weekly-calendar.html`
2. Run:
   ```bash
   bash /Users/haroldsacau/widiya-calendar/deploy.sh
   ```
   This copies **all** Interface files to the git repo, commits, pushes to GitHub, and Netlify auto-deploys in ~30 seconds.

---

## Architecture
- **Single HTML file** — no framework, no build step, no dependencies (except Google Fonts CDN)
- **Drag-and-drop** — vanilla JS with HTML5 drag API + touch polyfill
- **State storage** — `localStorage` for Harold's editing session
- **Share link** — schedule encoded as base64 JSON in the URL hash (`#s=...`). Harold clicks "Share Week", copies the link, sends to Widiya via WhatsApp. Widiya opens it — her view is read-only with a "Shared by Harold" banner.
- **Auto-deploys** — GitHub (`besionok92/Jadwal-Widiya`) → Netlify (`jadwal-widiya.netlify.app`)

---

## Calendar specs
- **Week starts:** Sunday (Minggu)
- **Time range:** 6:00am – 8:00pm
- **Snap interval:** 30 minutes
- **Languages:** Indonesian (primary) + English (secondary) in day headers
- **Design:** Warm Indonesian domestic aesthetic — terracotta, sand, sage, turmeric palette. Cormorant Garamond + DM Sans fonts.

---

## Block definitions
All blocks are 1 hour. Each has an Indonesian name, icon, and colour.

| Key | Name | Indonesian | Icon | Colour |
|---|---|---|---|---|
| `morning` | Morning Routine | Rutinitas Pagi | 🌅 | Terracotta |
| `evening` | Evening Routine | Rutinitas Sore | 🌇 | Amber |
| `english` | English | Bahasa Inggris | 📖 | Sky blue |
| `project` | Project | Proyek | 🕯️ | Lavender |
| `garden` | Garden | Kebun | 🌿 | Sage green |
| `sport` | Sport | Olahraga | 🏃 | Coral red |
| `upskilling` | Upskilling | Belajar Keterampilan | ✨ | Warm amber |
| `cooking` | Cooking | Memasak | 🍳 | Warm amber |
| `laundry` | Laundry | Mencuci Baju | 👕 | Light blue |

These same category colors are used in the **Projects section** to group projects by type.

To add a new block: (1) CSS colour variables, (2) a `.b-{name}` CSS class, (3) an entry in the `BLOCKS` JS object, (4) a legend item in the HTML, (5) add the category to `CATEGORIES` in `projects.html`.

---

## Recurring reminders (non-draggable)
Displayed as static cards below the calendar grid:
- Every 2 weeks: AC Filter Cleaning
- Every 2–4 weeks: Batch Prep Cleaning Products
- Monthly: Deep Washing Machine Clean
- Every 2–3 months: Full AC Deep Clean
- Every 3 months: Washing Machine Maintenance

---

## Features built
- [x] Drag from palette to calendar grid
- [x] Drag placed blocks to move them
- [x] Click ✕ to remove a placed block
- [x] Double-click to remove (alternate)
- [x] localStorage persistence across reloads
- [x] Touch drag-and-drop (mobile)
- [x] "Share Week" button — encodes schedule in URL hash, copies to clipboard
- [x] Shared URL shows "Shared by Harold" banner + link to open own copy
- [x] Clear All button
- [x] Print (A4 landscape)
- [x] Dynamic week dates in day headers (always shows current week)
- [x] Recurring reminders panel

---

## Features planned / not yet built

### Monthly task blocks
Add a separate palette section for monthly one-off tasks (e.g. "Deep Clean AC"). These look visually distinct (dashed border or badge). Harold drags them onto whichever week he wants them done. **Not yet built.**

### Flashcards section
A vocabulary flashcard section for Widiya's English learning. Nav item exists in the shell (`flashcards.html`) but the file has not been built yet.

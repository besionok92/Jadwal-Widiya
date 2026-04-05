# Widiya App — Interface Overview

A Progressive Web App (PWA) for Harold's household, built for his maid **Widiya** in Indonesia. Live at **jadwal-widiya.netlify.app**.

Read this file first before making any changes. For section-specific details, see the linked docs below.

---

## Architecture

**Vanilla HTML/CSS/JS — no framework, no build step, no npm.**

The app is a shell (`index.html`) that loads each section in an `<iframe>`. Navigation is handled client-side via `switchTo(section)` — no router needed.

```
Interface/
├── index.html                    ← Shell: sidebar, tab bar, routing
├── widiya-weekly-calendar.html   ← Schedule section
├── english_lessons.html          ← English lessons section
├── projects.html                 ← Projects section
├── recipes.html                  ← Recipes section
├── checklist.html                ← Checklist section
├── manifest.json                 ← PWA config
├── README.md                     ← This file
└── widiya-calendar.md            ← Calendar-specific docs
```

---

## Sections

| Section | File | Status | Notes |
|---|---|---|---|
| Schedule | `widiya-weekly-calendar.html` | ✅ Live | Drag-and-drop weekly planner |
| English | `english_lessons.html` | ✅ Live | 10-day English curriculum |
| Flashcards | `flashcards.html` | 🔜 Placeholder | Not yet built |
| Recipes | `recipes.html` | ✅ Live | Recipe book, Bahasa |
| Checklist | `checklist.html` | ✅ Live | Browser-editable shared list |
| Projects | `projects.html` | ✅ Live | Project cards with tasks, Bahasa |

---

## How to deploy changes

All source files live in `/Users/haroldsacau/HOME/Interface/`. After editing, run:

```bash
bash /Users/haroldsacau/widiya-calendar/deploy.sh
```

This copies all files to the git repo, commits, pushes to GitHub (`besionok92/Jadwal-Widiya`), and Netlify auto-deploys in ~30 seconds.

**Always edit files in `Interface/` — never edit directly in `/Users/haroldsacau/widiya-calendar/`.**

---

## Deployment stack

| Thing | Detail |
|---|---|
| Live URL | https://jadwal-widiya.netlify.app |
| GitHub repo | https://github.com/besionok92/Jadwal-Widiya |
| Hosting | Netlify (auto-deploys on push) |
| Deploy script | `/Users/haroldsacau/widiya-calendar/deploy.sh` |
| SSH key | `~/.ssh/github_widiya` |

---

## Design system

**Colors** (CSS custom properties in each file):
- Shell bg: `#1a2f4a` (dark navy), sidebar: `#142340`
- Active nav: `#2a6fa8`
- Content bg: `#f0f6fc` (light blue)
- Recipes bg: `#fff8f2` (warm cream)

**Category colors** (matching schedule blocks):
| Category | Accent | Light bg |
|---|---|---|
| Kebun (Garden) | `#2a7a4b` | `#d1f0db` |
| Proyek (Project) | `#7C3AED` | `#ede9fe` |
| Belajar (Upskilling) | `#b45309` | `#fef3c7` |
| Memasak (Cooking) | `#c2410c` | `#ffedd5` |

**Fonts:** Inter (UI), loaded from Google Fonts CDN.

**Responsive:** Sidebar on desktop (>700px), bottom tab bar on mobile (<700px).

---

## Section docs

- **Schedule / Calendar:** see `widiya-calendar.md`
- **Projects:** see below in this file
- **Recipes:** see below in this file
- **Checklist:** see below in this file

---

## Projects section (`projects.html`)

### Architecture
- Two-view navigation: list view → detail view (slide transition)
- Data is hardcoded in a `PROJECTS` JS array at the top of the file
- To add a project: copy an existing object in the array and fill in the fields
- All content in Bahasa Indonesia

### Data model
```javascript
{
  id: 'unique-slug',          // used for localStorage keys
  category: 'garden',         // 'garden' | 'project' | 'upskilling' | 'cooking'
  title: 'Nama Proyek',
  emoji: '🌸',
  description: '...',
  goal: '...',
  timeline: 'April – Mei 2026',
  notes: '...',               // use ⚠️ prefix for warnings (renders in orange)
  tasks: [
    'Simple task as string',
    {
      text: 'Parent task with subtasks',
      subtasks: ['Subtask 1', 'Subtask 2']
    }
  ]
}
```

### localStorage keys
- Simple task: `proj-{id}-{taskIndex}`
- Subtask: `proj-{id}-{taskIndex}-s{subIndex}`

### Current projects
| Title | Category | Tasks |
|---|---|---|
| Tanam Bunga | Kebun | 6 tasks (incl. subtasks for finding best location) |
| Bonsai | Kebun | 6 tasks (incl. subtasks) |
| Membuat Lilin | Proyek | 8 tasks (incl. shopping subtasks) |
| Belajar Listrik Dasar | Belajar | 6 tasks (incl. subtasks) |

---

## Recipes section (`recipes.html`)

### Architecture
- Same two-view pattern as Projects (list → detail, slide transition)
- Data hardcoded in a `RECIPES` JS array
- Content in Bahasa Indonesia (recipe names may keep original if well-known)
- Warm amber/cream theme (`--bg: #fff8f2`)

### Data model
```javascript
{
  id: 'unique-slug',
  category: 'makanan-utama',  // see RECIPE_CATS for all options
  name: 'Nama Resep',
  emoji: '🍳',
  prepTime: '15 menit',
  servings: '2 porsi',
  description: '...',
  ingredients: ['...', '...'],
  steps: ['...', '...']
}
```

### Recipe categories
`makanan-utama` · `salad` · `sayuran` · `lauk-pauk` · `minuman` · `kue-camilan`

### Current recipes
| Name | Category |
|---|---|
| Salad Ayam Vietnam | Salad |

---

## Checklist section (`checklist.html`)

### What it does
A single shared checklist where Harold or Widiya can add/check/delete items directly from the browser. No HTML editing required.

### How it works
- Type an item → press Enter or tap **+** to add
- Tap checkbox to mark done (strikethrough, stays in list)
- Tap **✕** to delete an item
- **"Hapus yang selesai"** button appears when there are completed items — bulk clears them

### Storage
**Firebase Realtime Database** — real-time sync across all devices.
- Database URL: `https://widiya-b2c41-default-rtdb.asia-southeast1.firebasedatabase.app/`
- Data path: `/checklist` (array of `{ id, text, done }`)
- Uses Firebase's SSE (EventSource) for real-time push — changes appear on all devices instantly without refresh
- `localStorage` used as a cache so the last-known list shows immediately on load before Firebase connects
- A small coloured dot in the UI shows sync state: grey = connecting, green = synced, orange = saving, red = error

---

## Context

- Harold lives in Indonesia; Widiya is his full-time live-in maid
- Widiya accesses the app on her phone
- Harold sends the weekly schedule via WhatsApp each Monday
- SOPs for Widiya's tasks are in Obsidian at `/Users/haroldsacau/HOME/03 - SOPs/`
- Upskilling goals for Widiya: English, candle-making, electricity basics, gardening

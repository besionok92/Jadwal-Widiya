#!/bin/bash
# Run this after any change to push to GitHub → Netlify auto-deploys
set -e

SRC="/Users/haroldsacau/HOME/Interface"
DEST="/Users/haroldsacau/widiya-calendar"

cp "$SRC/index.html"                    "$DEST/index.html"
cp "$SRC/widiya-weekly-calendar.html"   "$DEST/widiya-weekly-calendar.html"
cp "$SRC/english_lessons.html"          "$DEST/english_lessons.html"
cp "$SRC/projects.html"                 "$DEST/projects.html"
cp "$SRC/recipes.html"                  "$DEST/recipes.html"
cp "$SRC/checklist.html"               "$DEST/checklist.html"
cp "$SRC/accounting.html"              "$DEST/accounting.html"
cp "$SRC/manifest.json"                "$DEST/manifest.json"

cd "$DEST"
git add index.html widiya-weekly-calendar.html english_lessons.html projects.html recipes.html checklist.html accounting.html manifest.json
git commit -m "Update app"
git push
echo "✅ Pushed! Netlify will deploy in ~30 seconds → https://jadwal-widiya.netlify.app"

#!/usr/bin/env bash
set -euo pipefail

# fetch_ambient.sh
# Usage: bash scripts/fetch_ambient.sh
# This script searches Wikimedia Commons for audio files matching
# rain, forest, cafe, ocean and downloads the first audio file it finds
# for each term into public/audio/. Run this locally where you have network access.

mkdir -p public/audio
terms=(rain forest cafe ocean)

for term in "${terms[@]}"; do
  echo "Searching Commons for: $term"
  # Search File namespace (ns=6) for titles matching the term
  search_json=$(curl -s "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${term}&srnamespace=6&srlimit=20")
  found_url=""
  for title in $(echo "$search_json" | jq -r '.query.search[].title'); do
    enc_title=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$title")
    info=$(curl -s "https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${enc_title}&prop=imageinfo&iiprop=mime|url&redirects=1")
    mime=$(echo "$info" | jq -r '.query.pages[]?.imageinfo[0].mime // empty')
    url=$(echo "$info" | jq -r '.query.pages[]?.imageinfo[0].url // empty')
    if [ -n "$mime" ] && echo "$mime" | grep -q "audio"; then
      found_url="$url"
      echo "  Found: $title -> $mime"
      break
    fi
  done

  if [ -z "$found_url" ]; then
    echo "  No audio file found for $term in first 20 results. Skipping."
    continue
  fi

  ext="${found_url##*.}"
  out="public/audio/${term}.${ext}"
  echo "  Downloading to $out"
  curl -L "$found_url" -o "$out"
  echo "  Saved: $out"
done

echo "Done. If files downloaded, run: git add public/audio && git commit -m 'chore: add ambient audio files' && git push" 

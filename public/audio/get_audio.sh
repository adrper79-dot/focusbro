#!/bin/bash
# Fetch audio from Archive.org (CC licensed, reliable)

# Rain - CC licensed from Freesound
echo "Fetching rain audio..."
curl -s "https://archive.org/download/rain_sounds_collection/rain_02.mp3" -o rain.mp3 2>/dev/null

# Forest ambience 
echo "Fetching forest audio..."
curl -s "https://archive.org/download/forest_ambience/forest_ambience.mp3" -o forest.mp3 2>/dev/null

# Cafe ambience
echo "Fetching cafe audio..."
curl -s "https://archive.org/download/coffee_shop_ambience/coffee_shop.mp3" -o cafe.mp3 2>/dev/null

# Ocean waves
echo "Fetching ocean audio..."
curl -s "https://archive.org/download/ocean_waves_ambience/ocean_waves.mp3" -o ocean.mp3 2>/dev/null

# Check what we got
echo ""
ls -lh *.mp3 2>/dev/null | awk '{print $9, $5}'

#!/bin/bash
# Simple audio fetch from Zenodo & Freesound

mkdir -p .

# Rain ambient - using a creative commons licensed file
echo "Downloading rain audio..."
curl -s -L "https://cdn.pixabay.com/download/audio/2021/08/04/audio_1808ceb87d.mp3" -o rain.mp3 2>/dev/null && echo "✓ rain.mp3" || echo "✗ rain failed"

# Forest ambient
echo "Downloading forest audio..."  
curl -s -L "https://cdn.pixabay.com/download/audio/2022/03/15/audio_d45998bda9.mp3" -o forest.mp3 2>/dev/null && echo "✓ forest.mp3" || echo "✗ forest failed"

# Cafe ambient
echo "Downloading cafe audio..."
curl -s -L "https://cdn.pixabay.com/download/audio/2021/08/04/audio_c8c8a51ba1.mp3" -o cafe.mp3 2>/dev/null && echo "✓ cafe.mp3" || echo "✗ cafe failed"

# Ocean/waves ambient
echo "Downloading ocean audio..."
curl -s -L "https://cdn.pixabay.com/download/audio/2022/03/15/audio_2ea2c99e32.mp3" -o ocean.mp3 2>/dev/null && echo "✓ ocean.mp3" || echo "✗ ocean failed"

ls -lh *.mp3 2>/dev/null && echo "✓ All audio files ready!"

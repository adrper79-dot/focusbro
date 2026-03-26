#!/usr/bin/env node
// Generate simple ambient audio files using Web Audio API simulation
const fs = require('fs');
const path = require('path');

console.log('📝 Creating audio placeholder files...');

// For now, create silent MP3 files (browsers will load them gracefully)
// Real implementation would use ffmpeg or similar
const audioDir = path.join(__dirname, '../public/audio');

// Ensure directory exists
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const audioTypes = {
  'rain.mp3': 'Rain ambient sound',
  'forest.mp3': 'Forest ambience',
  'cafe.mp3': 'Cafe/coffee shop noise',
  'ocean.mp3': 'Ocean waves'
};

// Create minimal valid MP3 files (silent)
// This is an MP3 frame header for 44.1kHz mono, minimal silent content
const miniMP3 = Buffer.from([
  0xFF, 0xfb, 0x90, 0x44, 0x00, 0x00, 0x00, 0x03,
  0x48, 0x00, 0x00, 0x00, 0x4C, 0x49, 0x4E, 0x46
], 'binary');

Object.entries(audioTypes).forEach(([filename, desc]) => {
  const filePath = path.join(audioDir, filename);
  fs.writeFileSync(filePath, miniMP3);
  console.log(`  ✓ ${filename} (${desc})`);
});

console.log('\n✅ Audio files ready!');
console.log('💡 Tip: Replace these with real audio from:');
console.log('   - Freesound.org');
console.log('   - Zapsplat.com');
console.log('   - Archive.org (Creative Commons)');

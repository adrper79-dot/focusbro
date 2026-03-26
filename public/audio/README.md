# FocusBro Ambient Audio Files

This directory contains ambient sound MP3 files for focus sessions. All sounds are **free** for all users (no paywall).

## File Structure

```
/public/audio/
├── rain.mp3          (☔ Rain - 10:00 loop)
├── forest.mp3        (🌲 Forest - 10:00 loop)
├── cafe.mp3          (☕ Cafe - 10:00 loop)
├── ocean.mp3         (🌊 Ocean Waves - 10:00 loop)
└── README.md         (this file)
```

## Audio Specs (Recommended)

- **Format**: MP3 (128-192 kbps for balance of quality/size)
- **Duration**: 10 minutes minimum (seamlessly loopable)
- **Fade**: Start/end with 0.5s fade-in/out to hide loop point
- **Volume**: Normalized to -3dB to allow headroom for binaural layer
- **Background**: No vocals, SFX designed for 8-hour listening

## How to Add Audio Files

### Option 1: Use Free Audio Resources
- **Rain/Forest/Ocean**: Freesound.org, Zapsplat.com
- **Cafe noise**: YouTube "Cafe ambience" videos (licensed CC)
- **Tools**: Audacity (free) to trim, normalize, and export to MP3

### Option 2: Generate Procedurally
- Use Web Audio API + MediaRecorder API
- Script in `scripts/generate-audio.js` (future)

## Integration in App

The app loads audio from this directory automatically:
```javascript
const audioFile = `/audio/${soundType}.mp3`;
const audio = new Audio(audioFile);
audio.loop = true;
audio.play();
```

## Volume Levels

Ambient audio is mixed at **0.08 volume** with binaural tones at **0.05 volume** for proper balance.

## Testing

Before deploying:
1. ✓ Loop point is seamless (no pop/click)
2. ✓ Binaural + ambient mix is balanced
3. ✓ File loads in < 2s on 4G
4. ✓ No audio drift over 5-minute playback

#!/usr/bin/env node

/**
 * ElevenLabs Audio Generation Script
 * Generates ambient audio files for meditation and focus features
 * Uses ElevenLabs API to create soothing ambient backgrounds
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const API_KEY = process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_KEY || '';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio');
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Ambient audio configurations
const AUDIO_CONFIGS = {
  rain: {
    name: 'Rain Ambience',
    voiceDescription: 'Soft rain sounds with distant thunder and peaceful atmosphere',
    prompt: 'Create a 10-minute ambient soundscape of gentle rain with occasional distant thunder, perfect for meditation and focus. No music, pure rain sounds layered with ambient energy.',
    duration: 600,
  },
  forest: {
    name: 'Forest Ambience',
    voiceDescription: 'Peaceful forest with birds chirping and rustling leaves',
    prompt: 'Create a 10-minute ambient soundscape of a peaceful forest with gentle bird calls, rustling leaves, and a light breeze. Perfect for meditation and staying focused. No music.',
    duration: 600,
  },
  cafe: {
    name: 'Café Ambience',
    voiceDescription: 'Warm café environment with subtle background music and voices',
    prompt: 'Create a 10-minute ambient soundscape of a busy café with gentle conversations, coffee machine sounds, and soft background music. Perfect for focus and productivity sessions. Loopable.',
    duration: 600,
  },
  ocean: {
    name: 'Ocean Ambience',
    voiceDescription: 'Calming ocean waves with seagulls and sea sounds',
    prompt: 'Create a 10-minute ambient soundscape of ocean waves on a beach, with seagulls, the sound of waves crashing gently, and ocean atmosphere. Perfect for meditation. Pure natural sounds, no music.',
    duration: 600,
  },
};

/**
 * Make HTTPS request to ElevenLabs API
 */
function makeRequest(method, path, headers, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, ELEVENLABS_API_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
        ...headers,
      },
    };

    const protocol = url.protocol === 'https:' ? https : http;
    const req = protocol.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body, headers: res.headers });
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Generate audio using ElevenLabs Sound Generation API
 */
async function generateAudioViaElevenLabs(audioType, config) {
  try {
    console.log(`\n🎵 Generating ${audioType} ambience using ElevenLabs...`);

    // Use ElevenLabs Sound Generation (text-to-speech based ambient creation)
    // The API accepts a text description and generates audio
    const response = await makeRequest(
      'POST',
      '/sound-generation/generate',
      {},
      {
        text: config.prompt,
        duration_seconds: config.duration,
      }
    );

    if (response.status === 200) {
      // Parse the response - ElevenLabs returns audio data
      const audioBuffer = Buffer.from(response.body);
      const outputPath = path.join(OUTPUT_DIR, `${audioType}.mp3`);

      // Ensure output directory exists
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }

      // Write audio file
      fs.writeFileSync(outputPath, audioBuffer);
      console.log(`✅ Generated: ${audioType}.mp3 (${(audioBuffer.length / 1024).toFixed(2)} KB)`);
      return true;
    } else {
      console.log(`⚠️  API response: ${response.status}`);
      console.log(`Response: ${response.body.substring(0, 200)}`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Error generating ${audioType}:`, err.message);
    return false;
  }
}

/**
 * Create placeholder/fallback audio using Web Audio API pattern
 * (Generates valid minimal MP3 files with proper headers)
 */
function createFallbackAudio(audioType) {
  try {
    console.log(`\n🎵 Creating fallback audio for ${audioType}...`);
    
    // Create a minimal valid MP3 file with proper header
    // This is a silent MP3 that can be extended with real content
    // Format: MP3 frame header (0xFFE) + minimal audio data
    
    const mp3Header = Buffer.from([
      0xFF, 0xFB, // MPEG audio sync word (11 bits all set)
      0x10, 0x00, // Fixed header: MPEG 1 Layer III, 44.1kHz, no CRC
    ]);

    // Create a longer fallback with multiple frames for ~30 seconds
    let fileSize = 0;
    const frameSize = 418; // Bytes per frame at 128kbps, 44.1kHz
    const durationSeconds = 600; // 10 minutes target
    const framesNeeded = Math.ceil((durationSeconds * 44100) / 1152); // MPEG1 Layer3 has 1152 samples per frame
    
    let audioBuffer = Buffer.alloc(10000); // Decent fallback size
    let offset = 0;

    // Write ID3 tag for MP3
    const id3Tag = Buffer.from([
      0x49, 0x44, 0x33, // "ID3"
      0x03, 0x00, // Version 2.3
      0x00, // Flags
      0x00, 0x00, 0x00, 0x00, // Size (0)
    ]);
    
    id3Tag.copy(audioBuffer, offset);
    offset += id3Tag.length;

    // Write multiple MP3 frames
    for (let i = 0; i < Math.min(20, framesNeeded); i++) {
      mp3Header.copy(audioBuffer, offset);
      offset += mp3Header.length;
      
      // Add frame data (minimal)
      audioBuffer.writeUInt32BE(0x00000000, offset);
      offset += 4;
    }

    const outputPath = path.join(OUTPUT_DIR, `${audioType}.mp3`);
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write only the actual used portion
    fs.writeFileSync(outputPath, audioBuffer.slice(0, offset));
    console.log(`✅ Created fallback: ${audioType}.mp3 (${(offset / 1024).toFixed(2)} KB)`);
    return true;
  } catch (err) {
    console.error(`❌ Error creating fallback for ${audioType}:`, err.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🎵 FocusBro Audio Generation Script');
  console.log('===================================\n');

  if (!API_KEY) {
    console.warn('⚠️  No ElevenLabs API key provided.');
    console.warn('   Set ELEVENLABS_API_KEY or ELEVENLABS_KEY environment variable.');
    console.log('\n📝 Creating fallback audio files instead...\n');
    
    // Create fallback files for all audio types
    let fallbackSuccess = 0;
    for (const [audioType, config] of Object.entries(AUDIO_CONFIGS)) {
      if (createFallbackAudio(audioType)) {
        fallbackSuccess++;
      }
    }

    console.log(`\n✅ Created ${fallbackSuccess}/${Object.keys(AUDIO_CONFIGS).length} fallback audio files`);
    console.log('\n📌 Note: These are placeholder files. For real ambient audio:');
    console.log('   1. Set ELEVENLABS_API_KEY environment variable');
    console.log('   2. Re-run this script to generate actual audio content');
    console.log('   3. Audio will be downloaded from ElevenLabs API\n');
    process.exit(0);
  }

  console.log(`✅ API Key detected (${API_KEY.substring(0, 10)}...)\n`);

  // Test API connectivity
  try {
    console.log('🔍 Testing ElevenLabs API connection...');
    const testResponse = await makeRequest('GET', '/models', {});
    
    if (testResponse.status === 200) {
      console.log('✅ ElevenLabs API connection successful\n');
    } else if (testResponse.status === 401) {
      console.error('❌ API Key invalid or unauthorized');
      console.log('\n📝 Creating fallback audio files instead...\n');
      
      for (const [audioType] of Object.entries(AUDIO_CONFIGS)) {
        createFallbackAudio(audioType);
      }
      process.exit(1);
    }
  } catch (err) {
    console.error('⚠️  Could not connect to ElevenLabs API:', err.message);
    console.log('\n📝 Creating fallback audio files instead...\n');
    
    for (const [audioType] of Object.entries(AUDIO_CONFIGS)) {
      createFallbackAudio(audioType);
    }
    process.exit(1);
  }

  // Generate all audio types
  let successCount = 0;
  for (const [audioType, config] of Object.entries(AUDIO_CONFIGS)) {
    const success = await generateAudioViaElevenLabs(audioType, config);
    if (success) {
      successCount++;
    } else {
      // Fallback to minimal MP3 if ElevenLabs fails
      console.log(`   Falling back to placeholder audio...`);
      createFallbackAudio(audioType);
    }
  }

  console.log(`\n✅ Audio generation complete: ${successCount}/${Object.keys(AUDIO_CONFIGS).length} generated`);
  console.log('\n📦 Audio files ready in public/audio/');
  console.log('📝 Next steps:');
  console.log('   1. Run: node create-html-module.js');
  console.log('   2. Deploy: npx wrangler deploy --env production');
  console.log('   3. Purge cache: curl -X POST https://api.cloudflare.com/client/v4/zones/...');
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

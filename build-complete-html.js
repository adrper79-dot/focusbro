#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔨 Building complete HTML with all features...\n');

// Read base HTML
let html = fs.readFileSync('public/index.html', 'utf-8');

// List of all features to extract
const features = [
  'meditation', 'body-scan', 'energy', 'fidget', 'movement', 'sleep', 'social'
];

// Extract and inject each missing feature's JS and CSS
for (const feature of features) {
  const jsPath = `public/components/views/${feature}.js`;
  
  if (fs.existsSync(jsPath)) {
    console.log(`📦 Extracting ${feature}...`);
    
    try {
      let featureCode = fs.readFileSync(jsPath, 'utf-8');
      
      // Extract export function call (remove ES6 module syntax)
      featureCode = featureCode.replace(/export\s+function\s+/, 'function ');
      featureCode = featureCode.replace(/^\/\/.*\n/gm, ''); // Remove comments
      
      // Find the function name and insert before </body>
      const functionMatch = featureCode.match(/function\s+(\w+)\s*\(/);
      if (functionMatch) {
        const functionName = functionMatch[1];
        
        // Insert JS before </body>
        const jsBlock = `\n  /* ═══════════ ${feature.toUpperCase()} FEATURE ═════════════ */\n${featureCode}\n`;
        html = html.replace('</body>', jsBlock + '</body>');
        
        console.log(`  ✓ Injected ${functionName}()`);
      }
    } catch (e) {
      console.error(`  ✗ Failed to process ${feature}: ${e.message}`);
    }
  } else {
    console.log(`  ⚠ ${jsPath} not found`);
  }
}

// Ensure navigation includes all features
const navFeatures = [
  { label: 'Pomodoro', icon: '⏱️', id: 'pomodoro' },
  { label: 'Breathing', icon: '💨', id: 'breathing' },
  { label: 'Grounding', icon: '🌍', id: 'grounding' },
  { label: 'Meditation', icon: '🧘', id: 'meditation' },
  { label: 'Body Scan', icon: '🔍', id: 'body-scan' },
  { label: 'Energy', icon: '⚡', id: 'energy' },
  { label: 'Fidget', icon: '🎯', id: 'fidget' },
  { label: 'Movement', icon: '🏃', id: 'movement' },
  { label: 'Sleep', icon: '😴', id: 'sleep' },
  { label: 'Social', icon: '👥', id: 'social' }
];

// Add missing nav items
for (const feat of navFeatures) {
  const navItemRegex = new RegExp(`<div[^>]*id="${feat.id}[^>]*>`, 'i');
  if (!navItemRegex.test(html)) {
    const navItem = `<div class="nav-item" data-view="${feat.id}" onclick="showView('${feat.id}')">${feat.icon} ${feat.label}</div>`;
    // Insert before last nav item or appNav close
    html = html.replace(/(<div[^>]*id="appNav"[^>]*>.*?)(<\/div>\s*<\/div>\s*<!-- main -->)/s, 
      (match, nav, close) => nav + navItem + close);
  }
}

// Ensure audio files are referenced in meditation setup
const audioSetup = `
  // ═══════════ AUDIO SETUP ═════════════
  const audioContext = window.AudioContext || window.webkitAudioContext;
  const ambientAudio = {};
  
  async function playAmbientAudio(type) {
    try {
      const audioPath = \`/audio/\${type}.mp3\`;
      const audio = new Audio(audioPath);
      audio.loop = true;
      audio.volume = 0.3;
      audio.play().catch(e => console.warn('Audio playback failed:', e.message));
      ambientAudio[type] = audio;
    } catch (e) {
      console.warn('Failed to load ambient audio:', e.message);
    }
  }
  
  function stopAmbientAudio(type) {
    if (ambientAudio[type]) {
      try {
        ambientAudio[type].pause();
        ambientAudio[type] = null;
      } catch (e) {
        console.warn('Failed to stop audio:', e.message);
      }
    }
  }
`;

if (!html.includes('playAmbientAudio')) {
  html = html.replace('</body>', audioSetup + '\n</body>');
}

// Write updated HTML
fs.writeFileSync('public/index.html', html);
console.log('\n✅ Complete HTML built successfully!');
console.log(`   Total size: ${(html.length / 1024).toFixed(1)} KB`);
console.log('\n📝 Next: Run "node create-html-module.js" to generate api/src/html.js');

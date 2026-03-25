const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'api', 'src', 'html.js');
const backupPath = filePath + '.bak.initGallery';

let src = fs.readFileSync(filePath, 'utf8');
fs.writeFileSync(backupPath, src, 'utf8');

const startToken = 'async function initGallery() {';
const endToken = 'function renderGallery(';

const startIdx = src.indexOf(startToken);
const endIdx = src.indexOf(endToken, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not locate initGallery boundaries - aborting');
  process.exit(2);
}

const before = src.slice(0, startIdx + startToken.length);
const after = src.slice(endIdx);

const newBody = '\n    try {\n      const userId = getOrCreateUserId();\n      const category = \'random\';\n\n      // Fetch gallery from API (with fallback if it fails)\n      const response = await fetch(`/api/gallery?seed=${encodeURIComponent(userId)}&category=${category}&limit=12`);\n\n      if (response && response.ok) {\n        let data = null;\n        try {\n          data = await response.json();\n        } catch (err) {\n          warn(\'Failed to parse gallery JSON:\', err.message);\n        }\n\n        if (data && data.images && data.images.length > 0) {\n          // Transform API images to gallery format\n          galleryImages = data.images.map(img => ({\n            title: `Motivational Image - ${data.category || category}`,\n            quote: \'Keep pushing. Every moment of focus counts.\',\n            url: img.url,\n            alt: img.alt || \'Motivational image\'\n          }));\n          log(`✅ Loaded ${galleryImages.length} images from API`);\n        } else {\n          warn(\'Gallery API returned no images or invalid data; using fallback.\');\n          galleryImages = [...FALLBACK_GALLERY];\n        }\n      } else {\n        warn(\'Gallery API returned non-OK status:\', response && response.status);\n        galleryImages = [...FALLBACK_GALLERY];\n      }\n    } catch (e) {\n      warn(\'Gallery API unavailable, using fallback SVGs:\', e.message);\n      galleryImages = [...FALLBACK_GALLERY];\n    }\n';

const newSrc = before + newBody + '\n  ' + after;
fs.writeFileSync(filePath, newSrc, 'utf8');
console.log('initGallery patched via index-replace. Backup saved to', backupPath);

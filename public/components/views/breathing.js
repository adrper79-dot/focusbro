// Breathing View Component
const breathingHTML = `
  <div class="panel">
    <div class="panel-header"><div class="panel-title">Breathing Exercises</div></div>
    <div class="panel-body">
      <div class="form-group">
        <label class="form-label">Background Sound (Optional)</label>
        <div class="slider-track" style="gap: 8px;">
          <div class="slider-item" role="button" tabindex="0" onclick="document.getElementById('breathingAmbient').value='none'; updateAmbientUI('breathingAmbient')" onkeydown="if(event.key==='Enter'||event.key===' '){ this.click(); event.preventDefault(); }">None</div>
          <div class="slider-item" role="button" tabindex="0" onclick="document.getElementById('breathingAmbient').value='pink-noise'; updateAmbientUI('breathingAmbient')" onkeydown="if(event.key==='Enter'||event.key===' '){ this.click(); event.preventDefault(); }">🎀 Pink</div>
          <div class="slider-item" role="button" tabindex="0" onclick="document.getElementById('breathingAmbient').value='white-noise'; updateAmbientUI('breathingAmbient')" onkeydown="if(event.key==='Enter'||event.key===' '){ this.click(); event.preventDefault(); }">⚪ White</div>
          <div class="slider-item" role="button" tabindex="0" onclick="document.getElementById('breathingAmbient').value='brown-noise'; updateAmbientUI('breathingAmbient')" onkeydown="if(event.key==='Enter'||event.key===' '){ this.click(); event.preventDefault(); }">🟤 Brown</div>
        </div>
        <input type="hidden" id="breathingAmbient" value="none">
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
        <button class="btn btn-primary btn-block" onclick="startBreathingWithAmbient('4-7-8')">4-7-8</button>
        <button class="btn btn-primary btn-block" onclick="startBreathingWithAmbient('box')">Box (4-4-4-4)</button>
        <button class="btn btn-primary btn-block" onclick="startBreathingWithAmbient('tactical')">Tactical</button>
      </div>
      <div id="breathing-display" style="display:none;">
        <div class="breathing-circle" id="breathingCircle">Breathe</div>
        <div class="breathing-text" id="breathingText">Follow the circle's movement</div>
        <div style="text-align: center; margin-top: 16px;">
          <button class="btn btn-secondary" onclick="stopBreathingWithAmbient()">Stop</button>
        </div>
      </div>
    </div>
  </div>
`;

export default breathingHTML;
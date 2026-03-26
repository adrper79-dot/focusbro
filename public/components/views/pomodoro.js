// Pomodoro View Component
const pomodoroHTML = `
  <div class="panel">
    <div class="panel-header"><div class="panel-title">Pomodoro Timer</div></div>
    <div class="panel-body">
      <div class="form-group">
        <label class="form-label">Background Sound (Optional)</label>
        <div class="slider-track" style="gap: 8px;">
          <div class="slider-item" role="button" tabindex="0" onclick="document.getElementById('pomodoroAmbient').value='none'; updateAmbientUI('pomodoroAmbient')" onkeydown="if(event.key==='Enter'||event.key===' '){ this.click(); event.preventDefault(); }">None</div>
          <div class="slider-item" role="button" tabindex="0" onclick="document.getElementById('pomodoroAmbient').value='pink-noise'; updateAmbientUI('pomodoroAmbient')" onkeydown="if(event.key==='Enter'||event.key===' '){ this.click(); event.preventDefault(); }">🎀 Pink</div>
          <div class="slider-item" role="button" tabindex="0" onclick="document.getElementById('pomodoroAmbient').value='white-noise'; updateAmbientUI('pomodoroAmbient')" onkeydown="if(event.key==='Enter'||event.key===' '){ this.click(); event.preventDefault(); }">⚪ White</div>
          <div class="slider-item" role="button" tabindex="0" onclick="document.getElementById('pomodoroAmbient').value='brown-noise'; updateAmbientUI('pomodoroAmbient')" onkeydown="if(event.key==='Enter'||event.key===' '){ this.click(); event.preventDefault(); }">🟤 Brown</div>
        </div>
        <input type="hidden" id="pomodoroAmbient" value="none">
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <div style="font-family: var(--mono); font-size: 72px; font-weight: 700; color: var(--primary); margin: 20px 0;" id="pomodoroDisplay">25:00</div>
        <div style="margin: 20px 0;">
          <button class="btn btn-success btn-lg" id="pomodoroStartBtn" onclick="startPomodoroWithAmbient()">Start</button>
          <button class="btn btn-danger btn-lg" id="pomodoroStopBtn" onclick="stopPomodoro()" style="display:none;">Stop</button>
        </div>
      </div>
      <div id="pomodoroEnergyForm" style="display:none;">
        <div class="form-group">
          <label class="form-label">Energy After Session (1-10)</label>
          <input type="range" min="1" max="10" id="pomodoroEnergy" class="energy-slider" value="5" aria-label="Pomodoro energy after session">
          <div style="text-align: center; font-size: 12px; color: var(--gray-600);" id="pomodoroEnergyValue">5</div>
        </div>
        <button class="btn btn-primary btn-lg btn-block" onclick="recordPomodoroSession()">Record Session</button>
      </div>
    </div>
  </div>
`;

export default pomodoroHTML;
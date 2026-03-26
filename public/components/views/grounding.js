// Grounding View Component
const groundingHTML = `
  <div class="panel">
    <div class="panel-header"><div class="panel-title">5-4-3-2-1 Grounding Exercise</div></div>
    <div class="panel-body">
      <p style="font-size: 12px; color: var(--gray-600); margin-bottom: 16px;">Click each item as you notice it. Use when feeling overwhelmed.</p>
      <div style="margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 8px;">5 Things You See</div>
        <div class="grounding-section" id="groundingSee"></div>
      </div>
      <div style="margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 8px;">4 Things You Touch</div>
        <div class="grounding-section" id="groundingTouch"></div>
      </div>
      <div style="margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 8px;">3 Things You Hear</div>
        <div class="grounding-section" id="groundingHear"></div>
      </div>
      <div style="margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 8px;">2 Things You Smell</div>
        <div class="grounding-section" id="groundingSmell"></div>
      </div>
      <div style="margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--gray-600); text-transform: uppercase; margin-bottom: 8px;">1 Thing You Taste</div>
        <div class="grounding-section" id="groundingTaste"></div>
      </div>
      <div id="groundingComplete" style="display:none; text-align: center; padding: 20px; background: var(--success-bg); border-radius: 8px; color: var(--success);">
        <div style="font-weight: 700;">Grounding complete! You're anchored.</div>
      </div>
    </div>
  </div>
`;

export default groundingHTML;
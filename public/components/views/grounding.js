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

// Render grounding view
export function renderGroundingView() {
  return groundingHTML;
}

// Initialize grounding view
export function initGroundingView() {
  console.log('🔥 initGroundingView called');
  
  // Check if elements exist immediately
  const checkElements = () => {
    console.log('🔍 Checking for grounding elements...');
    const groundingSee = document.getElementById('groundingSee');
    console.log('groundingSee element:', groundingSee);
    
    if (groundingSee) {
      console.log('✅ Elements found, initializing grounding sections...');
      // Initialize each grounding section
      initGroundingSection('groundingSee', 5);
      initGroundingSection('groundingTouch', 4);
      initGroundingSection('groundingHear', 3);
      initGroundingSection('groundingSmell', 2);
      initGroundingSection('groundingTaste', 1);
      console.log('🎉 Grounding view initialized successfully');
    } else {
      console.log('❌ Elements not found, retrying in 50ms...');
      // Retry after a short delay
      setTimeout(checkElements, 50);
    }
  };
  
  checkElements();
}

// Initialize a grounding section with the specified number of items
function initGroundingSection(sectionId, count) {
  console.log(`Initializing grounding section ${sectionId} with ${count} items`);
  const section = document.getElementById(sectionId);
  if (!section) {
    console.error(`Grounding section ${sectionId} not found`);
    return;
  }

  // Clear existing content
  section.innerHTML = '';

  // Create clickable items
  for (let i = 1; i <= count; i++) {
    const item = document.createElement('div');
    item.className = 'grounding-item';
    item.innerHTML = `
      <div class="grounding-number">${i}</div>
      <div class="grounding-label">Click when noticed</div>
    `;
    item.onclick = () => completeGroundingItem(item, sectionId);
    section.appendChild(item);
  }
  
  console.log(`Created ${count} items for ${sectionId}`);
}

// Handle clicking a grounding item
function completeGroundingItem(item, sectionId) {
  item.classList.add('completed');
  item.onclick = null; // Remove click handler
  item.innerHTML = `
    <div class="grounding-number">✓</div>
    <div class="grounding-label">Completed</div>
  `;

  // Check if all items are completed
  checkGroundingComplete();
}

// Check if the entire grounding exercise is complete
function checkGroundingComplete() {
  const sections = ['groundingSee', 'groundingTouch', 'groundingHear', 'groundingSmell', 'groundingTaste'];
  const expectedCounts = [5, 4, 3, 2, 1];

  for (let i = 0; i < sections.length; i++) {
    const section = document.getElementById(sections[i]);
    const completedItems = section.querySelectorAll('.grounding-item.completed');
    if (completedItems.length !== expectedCounts[i]) {
      return; // Not complete yet
    }
  }

  // All sections complete - show success message
  const completeDiv = document.getElementById('groundingComplete');
  if (completeDiv) {
    completeDiv.style.display = 'block';
    // Log completion
    logEvent('grounding_complete', '5-4-3-2-1', 0, { exercise: 'grounding' });
  }
}
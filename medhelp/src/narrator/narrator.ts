// ============================================
// AR Contextual Narrator
// ============================================
import { onAnimEvent } from '../viewer/animations';
import { onRotate } from '../viewer/scene';
import { NARRATION_DATA, ROTATION_NARRATIONS, ZOOM_NARRATIONS } from './narration-data';

let messagesContainer: HTMLElement;
let lastRotationNarration = '';
let lastZoomNarration = '';
let rotationDebounce: ReturnType<typeof setTimeout> | null = null;

export function initNarrator() {
  messagesContainer = document.getElementById('narrator-messages')!;

  // Welcome message
  addNarration(
    '🎯 **AR Contextual Assistant Active**\n\nI\'m watching the 3D viewer and will provide real-time commentary as you interact with the model.\n\n• **Rotate** the model to see anatomical views\n• **Trigger an animation** to learn first-aid procedures\n• I\'ll narrate each step as it happens',
    'narrator'
  );

  // Listen to animation events
  onAnimEvent('animation:start', (data) => {
    const narrations = NARRATION_DATA[data.type];
    if (narrations && narrations['begin']) {
      addNarration(narrations['begin'], 'narrator');
    }
  });

  onAnimEvent('animation:step', (data) => {
    const narrations = NARRATION_DATA[data.type];
    if (narrations && narrations[data.step]) {
      addNarration(narrations[data.step], 'narrator');
    } else {
      // Fallback to the detail from the event
      addNarration(`📋 ${data.detail}`, 'narrator');
    }
  });

  onAnimEvent('animation:end', (data) => {
    const narrations = NARRATION_DATA[data.type];
    if (narrations && narrations['end']) {
      addNarration(narrations['end'], 'narrator');
    }
  });

  // Listen to rotation events
  onRotate((angle, distance) => {
    if (rotationDebounce) clearTimeout(rotationDebounce);
    rotationDebounce = setTimeout(() => {
      handleRotation(angle, distance);
    }, 800);
  });
}

function handleRotation(angle: number, distance: number) {
  // Determine direction
  let direction: string;
  const normalizedAngle = ((angle % 360) + 360) % 360;

  if (normalizedAngle >= 315 || normalizedAngle < 45) {
    direction = 'front';
  } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
    direction = 'right';
  } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
    direction = 'back';
  } else {
    direction = 'left';
  }

  // Only narrate if direction changed
  if (direction !== lastRotationNarration) {
    lastRotationNarration = direction;
    const narration = ROTATION_NARRATIONS[direction];
    if (narration) {
      addNarration(narration, 'narrator');
    }
  }

  // Zoom narration
  let zoomLevel: string;
  if (distance < 3) zoomLevel = 'close';
  else if (distance > 6) zoomLevel = 'far';
  else zoomLevel = 'medium';

  if (zoomLevel !== lastZoomNarration) {
    lastZoomNarration = zoomLevel;
    const narration = ZOOM_NARRATIONS[zoomLevel as keyof typeof ZOOM_NARRATIONS];
    if (narration) {
      setTimeout(() => addNarration(narration, 'narrator'), 500);
    }
  }
}

function addNarration(text: string, type: 'narrator' | 'info' = 'narrator') {
  const div = document.createElement('div');
  div.className = `msg ai`;

  const label = type === 'narrator' ? 'AR-SYS' : 'INFO';
  div.innerHTML = `<span class="ai-badge">${label}</span>${formatText(text)}`;

  messagesContainer.appendChild(div);

  // Auto-scroll
  requestAnimationFrame(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
}

function formatText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '&bull; ');
}

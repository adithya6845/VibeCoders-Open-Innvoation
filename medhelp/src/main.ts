// ============================================
// MedHelp AI — Main Entry Point
// ============================================
import './style.css';
import { initScene, getScene, startRenderLoop } from './viewer/scene';
import { createProceduralModel, type BodyParts } from './viewer/model';
import { CPRAnimation, BleedingAnimation } from './viewer/animations';
import { initChatbotUI } from './chatbot/chatbot-ui';
import { initNarrator } from './narrator/narrator';
import { initLandingPage } from './landing';
import { initDiagnostics } from './diagnostics';

// ---- App Init ----
document.addEventListener('DOMContentLoaded', async () => {
  // 0. Initialize Landing Page Interactions
  initLandingPage();

  // 1. Initialize 3D Scene
  const container = document.getElementById('three-canvas-container');
  if (container) {
    initScene(container);
    const scene = getScene();

    // 2. Create Procedural Model
    const bodyParts: BodyParts = await createProceduralModel();
    scene.add(bodyParts.root);

    // 3. Initialize Animations
    const cprAnim = new CPRAnimation(bodyParts);
    const bleedingAnim = new BleedingAnimation(bodyParts);

    // 4. Animation Control Buttons
    const btnCpr = document.getElementById('btn-cpr')!;
    const btnBleeding = document.getElementById('btn-bleeding')!;
    const btnReset = document.getElementById('btn-reset')!;
    const viewerModeLabel = document.getElementById('viewer-mode-label')!;

    btnCpr.addEventListener('click', () => {
      bleedingAnim.stop();
      btnBleeding.classList.remove('active');

      if (cprAnim.isActive()) {
        cprAnim.stop();
        btnCpr.classList.remove('active');
        viewerModeLabel.textContent = 'Interactive Mode';
      } else {
        cprAnim.start();
        btnCpr.classList.add('active');
        viewerModeLabel.textContent = 'CPR Demonstration';
      }
    });

    btnBleeding.addEventListener('click', () => {
      cprAnim.stop();
      btnCpr.classList.remove('active');

      if (bleedingAnim.isActive()) {
        bleedingAnim.stop();
        btnBleeding.classList.remove('active');
        viewerModeLabel.textContent = 'Interactive Mode';
      } else {
        bleedingAnim.start();
        btnBleeding.classList.add('active');
        viewerModeLabel.textContent = 'Bleeding Management';
      }
    });

    btnReset.addEventListener('click', () => {
      cprAnim.stop();
      bleedingAnim.stop();
      btnCpr.classList.remove('active');
      btnBleeding.classList.remove('active');
      viewerModeLabel.textContent = 'Interactive Mode';
    });

    // 5. Start Render Loop
    startRenderLoop((delta) => {
      cprAnim.update(delta);
      bleedingAnim.update(delta);
      if (bodyParts.cprMixer) {
        bodyParts.cprMixer.update(delta);
      }
      if (bodyParts.bleedingMixer) {
        bodyParts.bleedingMixer.update(delta);
      }
    });
  }

  // 6. Initialize Chatbot
  initChatbotUI();

  // 7. Initialize Narrator
  initNarrator();

  // 7a. Initialize Diagnostics
  initDiagnostics();

  // 8. Panel Tab Switching (narrator only now)
  const panelTabs = document.querySelectorAll<HTMLElement>('.panel-tab');
  panelTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      panelTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // 9. Nav Tab Switching — AI Doctor and Diagnostics show overlays, others close them
  const doctorOverlay = document.getElementById('doctor-overlay');
  const brainOverlay = document.getElementById('brain-overlay');
  const skinOverlay = document.getElementById('skin-overlay');
  const navTabs = document.querySelectorAll<HTMLElement>('.nav-tab');

  function hideAllOverlays() {
    if (doctorOverlay) doctorOverlay.classList.remove('active');
    if (brainOverlay) brainOverlay.classList.remove('active');
    if (skinOverlay) skinOverlay.classList.remove('active');
  }

  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      navTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;

      hideAllOverlays();

      if (target === 'doctor') {
        if (doctorOverlay) doctorOverlay.classList.add('active');
      } else if (target === 'brain') {
        if (brainOverlay) brainOverlay.classList.add('active');
      } else if (target === 'skin') {
        if (skinOverlay) skinOverlay.classList.add('active');
      }
    });
  });

  // Close buttons inside overlays
  document.querySelectorAll('.close-overlay').forEach(btn => {
    btn.addEventListener('click', () => {
      hideAllOverlays();
      navTabs.forEach((t) => t.classList.remove('active'));
      const viewerTab = document.querySelector<HTMLElement>('.nav-tab[data-tab="viewer"]');
      if (viewerTab) viewerTab.classList.add('active');
    });
  });

  // 10. Mobile Panel Toggle
  const mobileToggle = document.getElementById('mobile-panel-toggle');
  const sidePanel = document.getElementById('side-panel');

  if (mobileToggle && sidePanel) {
    mobileToggle.addEventListener('click', () => {
      const vis = sidePanel.style.display;
      sidePanel.style.display = vis === 'none' ? 'flex' : 'none';
    });
  }
});


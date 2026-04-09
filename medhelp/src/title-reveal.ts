import { gsap } from 'gsap';

/**
 * ============================================================
 *  TitleReveal.ts — Full-Screen Title Page Reveal Animation
 * ============================================================
 * 
 *  Supports two animation styles:
 *    1. "split-panel"  — Two panels slide outward from centre
 *    2. "clip-path"    — Content expands via clip-path from centre
 * 
 *  Usage:
 *    initTitleReveal({
 *      style: 'split-panel', // or 'clip-path'
 *      duration: 1.4,
 *      delay: 0.5,
 *      easing: 'expo.inOut',
 *      onComplete: () => { console.log('Reveal done'); }
 *    });
 */

interface RevealOptions {
  style?: 'split-panel' | 'clip-path';
  duration?: number;
  delay?: number;
  easing?: string;
  onComplete?: () => void;
}

export function initTitleReveal(options: RevealOptions = {}) {
  const el = document.getElementById('title-reveal');
  if (!el) return;

  const style = options.style || (el.getAttribute('data-reveal-style') as 'split-panel' | 'clip-path') || 'split-panel';
  const duration = options.duration || 1.4;
  const delay = options.delay || 0.5;
  const easing = options.easing || 'expo.inOut';
  const onComplete = options.onComplete;

  // Prevent scrolling during reveal
  document.body.style.overflow = 'hidden';

  const finishReveal = () => {
    el.style.display = 'none';
    document.body.style.overflow = '';
    if (onComplete) onComplete();
  };

  if (style === 'split-panel') {
    // 1. Create left/right panels
    const leftPanel = document.createElement('div');
    leftPanel.className = 'title-reveal-panel panel-left';
    const rightPanel = document.createElement('div');
    rightPanel.className = 'title-reveal-panel panel-right';

    // Move the content into a wrapper to keep it above panels (optional) or just append panels
    el.appendChild(leftPanel);
    el.appendChild(rightPanel);

    // The text content should be above the panels
    const content = el.querySelector('.reveal-content');
    if (content) {
      el.appendChild(content); // move to front
    }

    // Animate text out, then panels
    gsap.timeline({ delay, onComplete: finishReveal })
      .to('.reveal-content', { 
        opacity: 0, 
        y: -30, 
        duration: 0.6, 
        ease: 'power2.in' 
      })
      .to(leftPanel, { 
        xPercent: -100, 
        duration, 
        ease: easing 
      }, '-=0.2')
      .to(rightPanel, { 
        xPercent: 100, 
        duration, 
        ease: easing 
      }, '<');

  } else if (style === 'clip-path') {
    // Clip-path mask expanding from center vertical slice
    // Initial state: fully covering the screen (already set in CSS)
    
    // We animate the clip-path of the element itself to open up
    // However, it's easier to animate a solid block shrinking, or a clipPath: inset(...)
    
    gsap.timeline({ delay, onComplete: finishReveal })
      .to('.reveal-content', { 
        opacity: 0, 
        scale: 1.1, 
        duration: 0.6, 
        ease: 'power2.in' 
      })
      .to(el, { 
        clipPath: 'inset(0 50% 0 50%)', // clip down to 0 width in center
        duration, 
        ease: easing 
      }, '-=0.2');
  }
}

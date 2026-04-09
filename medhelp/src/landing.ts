import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── PARTICLE ENGINE ─────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particle-bg') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
  let lastMouse = { x: -1000, y: -1000 };

  document.addEventListener('mousemove', (e) => {
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.vx = mouse.x - lastMouse.x;
    mouse.vy = mouse.y - lastMouse.y;
  });

  class Particle {
    x: number;
    y: number;
    size: number;
    vx: number;
    vy: number;
    baseAlpha: number;

    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5 - 0.2; // slight upward drift
      this.baseAlpha = Math.random() * 0.4 + 0.1;
    }

    update() {
      // Mouse repulsion
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.vx -= (dx / dist) * force * 1.5;
        this.vy -= (dy / dist) * force * 1.5;
      }

      // Friction / Drift
      this.vx *= 0.96;
      this.vy *= 0.96;
      
      this.x += this.vx + (Math.random() - 0.5) * 0.2;
      this.y += this.vy - 0.3; // Base drift up

      // Wrap
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      if (!ctx) return;
      ctx.beginPath();
      
      const s = this.size * 2; // scale up slightly for + shape
      
      ctx.beginPath();
      ctx.strokeStyle = `rgba(45, 255, 110, ${this.baseAlpha * 2.5})`; // brighter neon green
      ctx.lineWidth = 1.5;

      // Draw horizontal line
      ctx.moveTo(this.x - s, this.y);
      ctx.lineTo(this.x + s, this.y);
      // Draw vertical line
      ctx.moveTo(this.x, this.y - s);
      ctx.lineTo(this.x, this.y + s);
      
      ctx.stroke();
    }
  }

  const particles: Particle[] = [];
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx!.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    requestAnimationFrame(animate);
  }

  animate();
}

export function initLandingPage() {
  initParticles();

  const btnEnterApp = document.getElementById('btn-enter-app');
  const skipLoginBtn = document.getElementById('skip-login');
  const btnLogin = document.getElementById('btn-login');

  const landingPage = document.getElementById('landing-page');
  const appPage = document.getElementById('app-page');

  // ── THEME TOGGLE ──────────────────────────────────────────
  const themeToggles = document.querySelectorAll('.theme-switch');
  const themeLabels = document.querySelectorAll('.theme-label');

  let isDark = true; // Default to dark mode
  
  // Initialize labels for dark mode
  themeLabels.forEach(label => label.textContent = 'DARK_SYS');
  
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      isDark = !isDark;
      if (isDark) {
        document.body.setAttribute('data-theme', 'dark');
        themeLabels.forEach(label => label.textContent = 'DARK_SYS');
      } else {
        // Technically user wants dark mode default, but we'll leave the toggle working
        document.body.removeAttribute('data-theme');
        themeLabels.forEach(label => label.textContent = 'LITE_SYS');
      }
    });
  });

  // ── LOGO SCROLL ──────────────────────────────────────────
  const landingLogo = document.querySelector('.landing-logo');
  if (landingLogo) {
    landingLogo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (!landingPage || !appPage) return;

  // ── Hero entrance ───────────────────────────────────────
  // Increased delay to wait for the title reveal
  gsap.fromTo('.hero-left', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 1.4 });
  gsap.fromTo('.monitor-plate', { opacity: 0, scale: 0.92, rotationY: 8 }, { opacity: 1, scale: 1, rotationY: 0, duration: 1.4, ease: 'expo.out', delay: 1.7 });

  // ── GSAP Parallax Background Orbs ───────────────────────────
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    gsap.utils.toArray('.hero-orb').forEach((orb: any) => {
      const depth = parseFloat(orb.dataset.depth) || 0.1;
      gsap.to(orb, {
        x: x * 100 * depth,
        y: y * 100 * depth,
        ease: "power2.out"
      });
    });
  });

  // ── GSAP Magnetic Buttons (Vengeance UI style) ────────────
  const magneticEls = document.querySelectorAll('[data-magnetic]');
  magneticEls.forEach((el: any) => {
    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const h = rect.width / 2;
      
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - h;

      gsap.to(el, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.4,
        ease: 'power3.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });

  // ── Continuous Spotlight Hover (Vengeance UI style) ───────
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.feat-card');
    cards.forEach((card: any) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  // ── Scroll reveals (Standard Text elements) ───────────────
  // Re-enabled opacity transition so elements actually become visible
  gsap.utils.toArray('.reveal').forEach((el: any) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      duration: 0.9,
      opacity: 1,
      y: 0,
      ease: 'power3.out'
    });
  });

  // ── Feature tiles (features grid) ────────────────────────
  const featureTiles = document.querySelectorAll('.feature-tile');
  if (featureTiles.length > 0) {
    ScrollTrigger.create({
      trigger: '.features-grid',
      start: 'top 75%',
      onEnter: () => {
        gsap.to(featureTiles, {
          duration: 0.85,
          opacity: 1,
          y: 0,
          ease: 'back.out(1.1)',
          stagger: 0.1
        });
      }
    });
  }

  // ── Tools Grid Cascade Stagger ────────────────────────────
  const toolCards = document.querySelectorAll('.tool-card');
  if (toolCards.length > 0) {
    ScrollTrigger.create({
      trigger: '.tools-grid-container',
      start: 'top 78%',
      onEnter: () => {
        gsap.to(toolCards, {
          duration: 0.8,
          opacity: 1,
          y: 0,
          ease: 'back.out(1.2)',
          stagger: 0.07
        });
      }
    });
  }

  // ── Page transition: Landing → App ────────────────────────
  function enterApp() {
    gsap.timeline()
      // Split the hero down the middle
      .to('.hero-left', { duration: 1.2, x: -600, opacity: 0, ease: 'expo.inOut' }, 0)
      .to('.hero-right', { duration: 1.2, x: 600, opacity: 0, ease: 'expo.inOut' }, 0)
      .to('.hero-orb', { duration: 1, scale: 0, opacity: 0, ease: 'power2.inOut' }, 0)
      .to(landingPage!, { duration: 0.3, opacity: 0 }, 1.0)
      .call(() => {
        landingPage!.style.display = 'none';
        appPage!.style.display = 'block';
        appPage!.style.opacity = '0';
        window.dispatchEvent(new Event('resize'));
      })
      .to(appPage!, { duration: 1.0, opacity: 1, ease: 'power2.out' }, 1.1);
  }

  // ── Page transition: App → Landing (Task 8) ────────────────
  const topNavLogo = document.querySelector('#top-nav .logo-text');
  if (topNavLogo) {
    topNavLogo.addEventListener('click', () => {
      // Return to landing page
      gsap.timeline()
        .to(appPage!, { duration: 0.5, opacity: 0, ease: 'power2.inOut' })
        .call(() => {
          appPage!.style.display = 'none';
          landingPage!.style.display = 'block';
          landingPage!.style.opacity = '1';
        })
        // Reset and re-animate hero section
        .fromTo('.hero-left', { x: -300, opacity: 0 }, { duration: 1.2, x: 0, opacity: 1, ease: 'expo.out' }, 0.6)
        .fromTo('.hero-right', { x: 300, opacity: 0 }, { duration: 1.2, x: 0, opacity: 1, ease: 'expo.out' }, 0.6)
        .fromTo('.hero-orb', { scale: 0, opacity: 0 }, { duration: 1.2, scale: 1, opacity: 1, ease: 'power2.out' }, 0.6);
    });
  }

  if (btnEnterApp) btnEnterApp.addEventListener('click', enterApp);
  if (skipLoginBtn) skipLoginBtn.addEventListener('click', enterApp);
  if (btnLogin) btnLogin.addEventListener('click', enterApp);
}

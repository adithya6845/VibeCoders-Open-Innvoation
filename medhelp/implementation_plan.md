# UI/UX Redesign Implementation Plan: Neo Brutalism & Advanced Animations

We will completely overhaul the UI/UX of MedHelp AI to feature a striking Neo Brutalism aesthetic with highly immersive, scroll-triggered animations while preserving all existing 3D features and AI bot logic.

## Goal Description

Transform the single-view app into a two-page flow (Landing Page -> App Page) utilizing a single-page application (SPA) architecture to ensure seamless transitions. Implement a bold Neo Brutalism design language (hard shadows, thick borders, high contrast colors). Add advanced GSAP animations including an immersive scroll reveal and an "exploding" features layout on the first page.

> [!IMPORTANT]
> **User Review Required**
> 
> 1.  **Architecture**: I will transform `index.html` into a two-view SPA structure (`#landing-page` and `#app-page`) toggled via JavaScript. This provides the smoothest transition. Is this acceptable, or do you prefer distinct HTML files (`index.html` and `app.html`)?
> 2.  **Dependencies**: I will install `gsap` (GreenSock Animation Platform) to handle the complex, timeline-based "exploding" and scroll animations.

## Proposed Changes

### Dependencies Layer
---

#### [MODIFY] package.json
- Add `gsap` and `@gsap/react` (if applicable, but we are using Vanilla JS, so just `gsap`) to handle robust animations, timelines, and scroll-triggers.

### Architecture & Markup Layer
---

#### [MODIFY] index.html
- **Restructure Layout:** Wrap existing top nav, viewer panel, and side panel in a `<div id="app-page" class="hidden">`.
- **New Landing Page:** Create `<div id="landing-page">` containing:
  - Hero Section (Title, Subtitle, "Login/Enter App" button)
  - About Project Section
  - Features Section (Software used, databases) designed for the "exploding" animation.
- Update `<head>` to import custom fonts if necessary (Neo Brutalism relies heavily on bold geometric fonts like Space Grotesk or retaining bold Inter).

### Styling Layer
---

#### [MODIFY] src/style.css
- **Neo Brutalism Tokens:** Define custom properties for high-contrast background colors (bright yellow, stark pink, electric blue), pure black borders, and hard, unsmoothed box-shadows (e.g., `box-shadow: 6px 6px 0px #000;`).
- **Component Redesign:** Overhaul navigation buttons, chat inputs, floating panels, and the viewer controls to feature 100% opacity, 2px borders, and high-impact hover states (translating X and Y with shadow adjustments).
- **App Page Background:** Create an immersive, relevant background for the `app-page` (e.g., an animated CSS grid pattern or brutalist repeating crosshairs).

### Logic & Animation Layer
---

#### [NEW] src/landing.ts
- Create a new module to handle Landing Page logic.
- Initialize `gsap` and `ScrollTrigger`.
- **Immersive Reveal:** Animate text and images appearing dynamically as the user scrubs the scrollbar.
- **Exploding Animation:** A timeline that triggers when the user reaches the Features section, scattering elements (tools and databases) outward from the center into a neat grid or scattered layout.
- Handle the switch from the landing page to the app page (hiding landing, revealing app, dispatching resize events for Three.js).

#### [MODIFY] src/main.ts
- Import and initialize `landing.ts` functions.
- Only initialize Three.js models or adjust its sizing once the `app-page` becomes visible to prevent layout glitches.

## Open Questions

- What specific color palette do you lean toward for the Neo Brutalism style? (e.g., "Mustard Yellow & Hot Pink" or "Muted Pastels with Harcore Black Lines")
- Since you mentioned a "login page", do you want me to build a mock login form (username/password) or just an "Enter Experience" button on the landing page?

## Verification Plan

### Automated Tests
- Build and serve the app via `npm run dev`.
- Ensure no TypeScript or Vite build errors occur.

### Manual Verification
- Visual inspection of the Neo Brutalist styling on all existing components (buttons, chat, panels).
- Verify the GSAP scroll-triggered "reveal" and "explode" animations trigger cleanly without jank.
- Confirm that navigating from the landing page to the app page correctly renders the 3D canvas and resizes it.
- Confirm all previous functionality (AR narrator, AI doctor, 3D animations) remains fully intact.

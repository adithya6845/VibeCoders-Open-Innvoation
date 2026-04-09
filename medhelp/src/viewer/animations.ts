// ============================================
// First-Aid Animations
// ============================================
import * as THREE from 'three';
import type { BodyParts } from './model';

// Event system for narrator integration
type AnimEvent = 'animation:start' | 'animation:step' | 'animation:end';
type AnimCallback = (data: { type: string; step: string; detail: string }) => void;

const listeners: Map<AnimEvent, AnimCallback[]> = new Map();

export function onAnimEvent(event: AnimEvent, cb: AnimCallback) {
  if (!listeners.has(event)) listeners.set(event, []);
  listeners.get(event)!.push(cb);
}

function emit(event: AnimEvent, data: { type: string; step: string; detail: string }) {
  listeners.get(event)?.forEach((cb) => cb(data));
}

// ============================================
// CPR Animation
// ============================================
export class CPRAnimation {
  private active = false;
  private time = 0;
  private parts: BodyParts;
  private phase: 'compressions' | 'headtilt' = 'compressions';
  private phaseTime = 0;
  private compressionCount = 0;
  private origChestY: number;
  private origHeadRotX: number;
  private nativeActions: THREE.AnimationAction[] = [];

  constructor(parts: BodyParts) {
    this.parts = parts;
    this.origChestY = parts.chest.position.y;
    this.origHeadRotX = parts.head.rotation.x;

    if (parts.cprMixer && parts.cprAnimations && parts.cprAnimations.length > 0) {
      this.nativeActions = parts.cprAnimations.map(a => parts.cprMixer!.clipAction(a));
    }
  }

  start() {
    this.active = true;
    this.time = 0;
    this.phase = 'compressions';
    this.phaseTime = 0;
    this.compressionCount = 0;

    if (this.parts.cprModel) this.parts.cprModel.visible = true;
    if (this.parts.bleedingModel) this.parts.bleedingModel.visible = false;
    
    // Highlight chest
    if ((this.parts.chest as THREE.Mesh).material) {
      ((this.parts.chest as THREE.Mesh).material as THREE.MeshStandardMaterial).emissive.set(0x3b82f6);
      ((this.parts.chest as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
    }

    if (this.nativeActions.length > 0) {
      this.nativeActions.forEach(a => {
        a.reset();
        a.play();
      });
    }

    emit('animation:start', {
      type: 'cpr',
      step: 'begin',
      detail: 'CPR procedure initiated. Starting chest compressions at 100-120 per minute rate.',
    });

    setTimeout(() => {
      if (this.active) {
        emit('animation:step', {
          type: 'cpr',
          step: 'compressions',
          detail: 'Observe the rhythmic chest compressions. Place the heel of your hand on the center of the chest, interlock fingers. Push hard and fast — aim for 2 inches (5cm) depth.',
        });
      }
    }, 800);
  }

  stop() {
    this.active = false;
    if (this.nativeActions.length > 0) {
      this.nativeActions.forEach(a => a.stop());
    }

    this.parts.chest.position.y = this.origChestY;
    this.parts.head.rotation.x = this.origHeadRotX;
    if ((this.parts.chest as THREE.Mesh).material) {
      ((this.parts.chest as THREE.Mesh).material as THREE.MeshStandardMaterial).emissive.set(0x112233);
      ((this.parts.chest as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1;
    }

    emit('animation:end', {
      type: 'cpr',
      step: 'end',
      detail: 'CPR animation stopped. Remember: 30 compressions, then 2 rescue breaths.',
    });
  }

  update(delta: number) {
    if (!this.active) return;
    this.time += delta;
    this.phaseTime += delta;

    if (this.phase === 'compressions') {
      // ~110 BPM = 1.83 per second
      const freq = 1.83 * 2 * Math.PI;
      
      if (this.nativeActions.length === 0) {
        const compression = Math.sin(this.time * freq) * 0.04;
        this.parts.chest.position.y = this.origChestY + compression;
      }

      // Pulse glow
      if ((this.parts.chest as THREE.Mesh).material) {
        const glow = 0.2 + Math.abs(Math.sin(this.time * freq)) * 0.4;
        ((this.parts.chest as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = glow;
      }

      // Count compressions
      const newCount = Math.floor(this.time * 1.83);
      if (newCount > this.compressionCount && newCount <= 30) {
        this.compressionCount = newCount;
        if (this.compressionCount === 15) {
          emit('animation:step', {
            type: 'cpr',
            step: 'halfway',
            detail: '15 compressions done. Note the consistent depth and rate. Keep your arms straight, shoulders directly above your hands.',
          });
        }
      }

      // After ~30 compressions, switch to head-tilt
      if (this.compressionCount >= 30) {
        this.phase = 'headtilt';
        this.phaseTime = 0;
        emit('animation:step', {
          type: 'cpr',
          step: 'headtilt',
          detail: '30 compressions complete. Now performing head-tilt/chin-lift to open the airway. Tilt the forehead back gently with one hand, lift the chin with the other.',
        });
      }
    } else if (this.phase === 'headtilt') {
      const tiltProgress = Math.min(this.phaseTime / 1.5, 1);
      const eased = tiltProgress * tiltProgress * (3 - 2 * tiltProgress); // smoothstep
      
      if (this.nativeActions.length === 0) {
        // Tilt head back
        this.parts.head.rotation.x = this.origHeadRotX - eased * 0.4;
        // Chest returns to normal
        this.parts.chest.position.y = this.origChestY;
      }

      if ((this.parts.chest as THREE.Mesh).material) {
        ((this.parts.chest as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15;
      }

      if (this.phaseTime > 4) {
        // Loop back
        this.phase = 'compressions';
        this.phaseTime = 0;
        this.compressionCount = 0;
        this.time = 0;
        this.parts.head.rotation.x = this.origHeadRotX;

        emit('animation:step', {
          type: 'cpr',
          step: 'cycle',
          detail: 'Rescue breaths delivered. Restarting compression cycle. Repeat: 30 compressions → 2 breaths until help arrives or the person starts breathing.',
        });
      }
    }
  }

  isActive() {
    return this.active;
  }
}

// ============================================
// Severe Bleeding Animation
// ============================================
export class BleedingAnimation {
  private active = false;
  private time = 0;
  private parts: BodyParts;
  private phase: 'pressure' | 'elevation' | 'tourniquet' = 'pressure';
  private phaseTime = 0;

  private origLUA_Z: number;
  private origLLA_Z: number;
  private origLUA_Y: number;
  private origLLA_Y: number;
  private nativeAction?: THREE.AnimationAction;

  constructor(parts: BodyParts) {
    this.parts = parts;
    this.origLUA_Z = parts.leftUpperArm.rotation.z;
    this.origLLA_Z = parts.leftLowerArm.rotation.z;
    this.origLUA_Y = parts.leftUpperArm.position.y;
    this.origLLA_Y = parts.leftLowerArm.position.y;

    if (parts.bleedingMixer && parts.bleedingAnimations && parts.bleedingAnimations.length > 0) {
      this.nativeAction = parts.bleedingMixer.clipAction(parts.bleedingAnimations[0]);
    }
  }

  start() {
    this.active = true;
    this.time = 0;
    this.phase = 'pressure';
    this.phaseTime = 0;

    if (this.parts.bleedingModel) this.parts.bleedingModel.visible = true;
    if (this.parts.cprModel) this.parts.cprModel.visible = false;

    if (this.nativeAction) {
      this.nativeAction.reset();
      this.nativeAction.play();
    }

    emit('animation:start', {
      type: 'bleeding',
      step: 'begin',
      detail: 'Severe bleeding management initiated. Step 1: Apply direct pressure to the wound site.',
    });

    setTimeout(() => {
      if (this.active) {
        emit('animation:step', {
          type: 'bleeding',
          step: 'pressure',
          detail: 'Watch the pressure points light up in red. Apply firm, direct pressure using a clean cloth or bandage. Do NOT remove the first bandage — add more on top if blood soaks through.',
        });
      }
    }, 600);
  }

  stop() {
    this.active = false;
    
    if (this.nativeAction) {
      this.nativeAction.stop();
    }

    // Reset pressure points
    this.parts.pressurePoints.forEach((pp) => {
      (pp.material as THREE.MeshBasicMaterial).opacity = 0;
    });
    // Reset tourniquet
    (this.parts.tourniquetRing.material as THREE.MeshBasicMaterial).opacity = 0;
    // Reset arm position
    this.parts.leftUpperArm.rotation.z = this.origLUA_Z;
    this.parts.leftLowerArm.rotation.z = this.origLLA_Z;
    this.parts.leftUpperArm.position.y = this.origLUA_Y;
    this.parts.leftLowerArm.position.y = this.origLLA_Y;

    emit('animation:end', {
      type: 'bleeding',
      step: 'end',
      detail: 'Bleeding management animation stopped. Key steps: Direct pressure → Elevation → Tourniquet (if needed).',
    });
  }

  update(delta: number) {
    if (!this.active) return;
    this.time += delta;
    this.phaseTime += delta;

    if (this.phase === 'pressure') {
      // Pulse pressure points
      const pulse = 0.4 + Math.abs(Math.sin(this.time * 3)) * 0.6;
      this.parts.pressurePoints.forEach((pp) => {
        (pp.material as THREE.MeshBasicMaterial).opacity = pulse;
        // scale pulse
        const s = 1 + Math.sin(this.time * 4) * 0.3;
        pp.scale.setScalar(s);
      });

      if (this.phaseTime > 5) {
        this.phase = 'elevation';
        this.phaseTime = 0;
        emit('animation:step', {
          type: 'bleeding',
          step: 'elevation',
          detail: 'Step 2: Elevate the injured limb above the heart. This reduces blood flow to the wound. Watch as the left arm is raised while maintaining steady pressure.',
        });
      }
    } else if (this.phase === 'elevation') {
      // Raise left arm
      const progress = Math.min(this.phaseTime / 2, 1);
      const eased = progress * progress * (3 - 2 * progress);

      if (!this.nativeAction) {
        this.parts.leftUpperArm.rotation.z = this.origLUA_Z + eased * 1.2;
        this.parts.leftLowerArm.rotation.z = this.origLLA_Z + eased * 0.8;
        this.parts.leftUpperArm.position.y = this.origLUA_Y + eased * 0.2;
        this.parts.leftLowerArm.position.y = this.origLLA_Y + eased * 0.4;
      }

      // Keep pressure points pulsing
      const pulse = 0.3 + Math.abs(Math.sin(this.time * 3)) * 0.5;
      this.parts.pressurePoints.forEach((pp) => {
        (pp.material as THREE.MeshBasicMaterial).opacity = pulse;
      });

      if (this.phaseTime > 5) {
        this.phase = 'tourniquet';
        this.phaseTime = 0;
        emit('animation:step', {
          type: 'bleeding',
          step: 'tourniquet',
          detail: 'Step 3: If bleeding doesn\'t stop, apply a tourniquet 2-3 inches ABOVE the wound (never on a joint). Note the yellow ring — tighten until bleeding stops. Write the time of application.',
        });
      }
    } else if (this.phase === 'tourniquet') {
      // Show tourniquet ring
      const fadeIn = Math.min(this.phaseTime / 1.5, 1);
      (this.parts.tourniquetRing.material as THREE.MeshBasicMaterial).opacity = fadeIn * 0.9;

      // Rotate tourniquet to simulate tightening
      this.parts.tourniquetRing.rotation.x += delta * 2;

      // Pulse yellow
      const r = this.parts.tourniquetRing;
      const pulse = 0.6 + Math.sin(this.time * 4) * 0.3;
      (r.material as THREE.MeshBasicMaterial).color.setHSL(0.12, 1, pulse);

      // Dim pressure points
      this.parts.pressurePoints.forEach((pp) => {
        (pp.material as THREE.MeshBasicMaterial).opacity = 0.3;
      });

      if (this.phaseTime > 6) {
        // Loop
        this.phase = 'pressure';
        this.phaseTime = 0;
        // Reset arm
        this.parts.leftUpperArm.rotation.z = this.origLUA_Z;
        this.parts.leftLowerArm.rotation.z = this.origLLA_Z;
        this.parts.leftUpperArm.position.y = this.origLUA_Y;
        this.parts.leftLowerArm.position.y = this.origLLA_Y;
        (this.parts.tourniquetRing.material as THREE.MeshBasicMaterial).opacity = 0;

        emit('animation:step', {
          type: 'bleeding',
          step: 'cycle',
          detail: 'Procedure cycle complete. Restarting demonstration. Remember: Direct Pressure → Elevation → Tourniquet (last resort only).',
        });
      }
    }
  }

  isActive() {
    return this.active;
  }
}

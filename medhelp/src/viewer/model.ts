// ============================================
// Procedural Anatomy Model (Placeholder)
// ============================================
// This creates a humanoid figure from basic Three.js primitives.
// Replace MODEL_PATH with your custom .glb to use a real model.
// ============================================
import * as THREE from 'three';

// ---- CUSTOM MODELS ----
export const CPR_MODEL_PATH: string | null = '/models/cpr1.fbx';
export const BLEEDING_MODEL_PATH: string | null = '/models/bleeding.fbx';

export interface BodyParts {
  root: THREE.Group;

  cprModel?: THREE.Group;
  cprMixer?: THREE.AnimationMixer;
  cprAnimations?: THREE.AnimationClip[];

  bleedingModel?: THREE.Group;
  bleedingMixer?: THREE.AnimationMixer;
  bleedingAnimations?: THREE.AnimationClip[];

  head: THREE.Mesh;
  neck: THREE.Mesh;
  torso: THREE.Mesh;
  chest: THREE.Mesh;
  leftUpperArm: THREE.Mesh;
  leftLowerArm: THREE.Mesh;
  rightUpperArm: THREE.Mesh;
  rightLowerArm: THREE.Mesh;
  leftUpperLeg: THREE.Mesh;
  leftLowerLeg: THREE.Mesh;
  rightUpperLeg: THREE.Mesh;
  rightLowerLeg: THREE.Mesh;
  // Pressure point markers
  pressurePoints: THREE.Mesh[];
  tourniquetRing: THREE.Mesh;
}

const SKIN_COLOR = 0x6bb8cc;
const SKIN_EMISSIVE = 0x112233;

function createSkinMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: SKIN_COLOR,
    roughness: 0.7,
    metalness: 0.05,
    emissive: SKIN_EMISSIVE,
    emissiveIntensity: 0.15,
    transparent: false,
    opacity: 1.0,
    depthWrite: true,
    side: THREE.FrontSide,
  });
}

function createJointSphere(radius: number): THREE.Mesh {
  const geo = new THREE.SphereGeometry(radius, 16, 12);
  const mesh = new THREE.Mesh(geo, createSkinMaterial());
  mesh.castShadow = true;
  return mesh;
}

import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export async function createProceduralModel(): Promise<BodyParts> {
  const root = new THREE.Group();

  // ----- TORSO -----
  const torsoGeo = new THREE.CapsuleGeometry(0.28, 0.5, 8, 16);
  const torso = new THREE.Mesh(torsoGeo, createSkinMaterial());
  torso.position.y = 1.1;
  torso.castShadow = true;
  root.add(torso);

  // ----- CHEST (for CPR target) -----
  const chestGeo = new THREE.BoxGeometry(0.5, 0.25, 0.32);
  const chestMat = createSkinMaterial();
  let chest = new THREE.Mesh(chestGeo, chestMat);
  chest.position.set(0, 1.3, 0.05);
  chest.castShadow = true;
  root.add(chest);

  // ----- NECK -----
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.12, 12);
  const neck = new THREE.Mesh(neckGeo, createSkinMaterial());
  neck.position.y = 1.55;
  neck.castShadow = true;
  root.add(neck);

  // ----- HEAD -----
  const headGeo = new THREE.SphereGeometry(0.18, 20, 16);
  let head = new THREE.Mesh(headGeo, createSkinMaterial());
  head.position.y = 1.78;
  head.castShadow = true;
  root.add(head);

  // Face indicator
  const faceGeo = new THREE.PlaneGeometry(0.08, 0.04);
  const faceMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.5,
  });
  const face = new THREE.Mesh(faceGeo, faceMat);
  face.position.set(0, 1.78, 0.185);
  root.add(face);

  // ----- ARMS -----
  // Left Upper Arm
  const luaGeo = new THREE.CapsuleGeometry(0.06, 0.28, 6, 12);
  let leftUpperArm = new THREE.Mesh(luaGeo, createSkinMaterial());
  leftUpperArm.position.set(-0.42, 1.25, 0);
  leftUpperArm.rotation.z = 0.15;
  leftUpperArm.castShadow = true;
  root.add(leftUpperArm);

  // Left Lower Arm
  const llaGeo = new THREE.CapsuleGeometry(0.05, 0.26, 6, 12);
  let leftLowerArm = new THREE.Mesh(llaGeo, createSkinMaterial());
  leftLowerArm.position.set(-0.48, 0.9, 0);
  leftLowerArm.rotation.z = 0.1;
  leftLowerArm.castShadow = true;
  root.add(leftLowerArm);

  // Right Upper Arm
  const ruaGeo = new THREE.CapsuleGeometry(0.06, 0.28, 6, 12);
  const rightUpperArm = new THREE.Mesh(ruaGeo, createSkinMaterial());
  rightUpperArm.position.set(0.42, 1.25, 0);
  rightUpperArm.rotation.z = -0.15;
  rightUpperArm.castShadow = true;
  root.add(rightUpperArm);

  // Right Lower Arm
  const rlaGeo = new THREE.CapsuleGeometry(0.05, 0.26, 6, 12);
  const rightLowerArm = new THREE.Mesh(rlaGeo, createSkinMaterial());
  rightLowerArm.position.set(0.48, 0.9, 0);
  rightLowerArm.rotation.z = -0.1;
  rightLowerArm.castShadow = true;
  root.add(rightLowerArm);

  // Left hand
  const leftHand = createJointSphere(0.055);
  leftHand.position.set(-0.5, 0.7, 0);
  root.add(leftHand);

  // Right hand
  const rightHand = createJointSphere(0.055);
  rightHand.position.set(0.5, 0.7, 0);
  root.add(rightHand);

  // ----- LEGS -----
  // Left Upper Leg
  const lulGeo = new THREE.CapsuleGeometry(0.08, 0.35, 6, 12);
  const leftUpperLeg = new THREE.Mesh(lulGeo, createSkinMaterial());
  leftUpperLeg.position.set(-0.15, 0.5, 0);
  leftUpperLeg.castShadow = true;
  root.add(leftUpperLeg);

  // Left Lower Leg
  const lllGeo = new THREE.CapsuleGeometry(0.06, 0.35, 6, 12);
  const leftLowerLeg = new THREE.Mesh(lllGeo, createSkinMaterial());
  leftLowerLeg.position.set(-0.15, 0.1, 0);
  leftLowerLeg.castShadow = true;
  root.add(leftLowerLeg);

  // Right Upper Leg
  const rulGeo = new THREE.CapsuleGeometry(0.08, 0.35, 6, 12);
  const rightUpperLeg = new THREE.Mesh(rulGeo, createSkinMaterial());
  rightUpperLeg.position.set(0.15, 0.5, 0);
  rightUpperLeg.castShadow = true;
  root.add(rightUpperLeg);

  // Right Lower Leg
  const rllGeo = new THREE.CapsuleGeometry(0.06, 0.35, 6, 12);
  const rightLowerLeg = new THREE.Mesh(rllGeo, createSkinMaterial());
  rightLowerLeg.position.set(0.15, 0.1, 0);
  rightLowerLeg.castShadow = true;
  root.add(rightLowerLeg);

  // Feet
  const leftFoot = createJointSphere(0.06);
  leftFoot.position.set(-0.15, -0.02, 0.03);
  root.add(leftFoot);

  const rightFoot = createJointSphere(0.06);
  rightFoot.position.set(0.15, -0.02, 0.03);
  root.add(rightFoot);

  // ----- PRESSURE POINTS (hidden by default) -----
  const pressurePoints: THREE.Mesh[] = [];
  const ppPositions = [
    { x: -0.48, y: 0.9, z: 0.06 },  // Left inner arm
    { x: 0.48, y: 0.9, z: 0.06 },   // Right inner arm
    { x: -0.15, y: 0.35, z: 0.09 },  // Left inner thigh
    { x: 0.15, y: 0.35, z: 0.09 },   // Right inner thigh
  ];

  ppPositions.forEach((pos) => {
    const ppGeo = new THREE.SphereGeometry(0.03, 12, 8);
    const ppMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0,
    });
    const pp = new THREE.Mesh(ppGeo, ppMat);
    pp.position.set(pos.x, pos.y, pos.z);
    root.add(pp);
    pressurePoints.push(pp);
  });

  // ----- TOURNIQUET RING (hidden by default) -----
  const tGeo = new THREE.TorusGeometry(0.08, 0.015, 8, 24);
  const tMat = new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    transparent: true,
    opacity: 0,
  });
  const tourniquetRing = new THREE.Mesh(tGeo, tMat);
  tourniquetRing.position.set(-0.45, 1.05, 0);
  tourniquetRing.rotation.z = 0.15;
  root.add(tourniquetRing);

  root.position.y = 0;

  let cprModel: THREE.Group | undefined;
  let cprMixer: THREE.AnimationMixer | undefined;
  let cprAnimations: THREE.AnimationClip[] | undefined;

  let bleedingModel: THREE.Group | undefined;
  let bleedingMixer: THREE.AnimationMixer | undefined;
  let bleedingAnimations: THREE.AnimationClip[] | undefined;

  // ----- LOAD CUSTOM MODELS IF PROVIDED -----
  if (CPR_MODEL_PATH || BLEEDING_MODEL_PATH) {
    const loader = new FBXLoader();

    // Hide procedural body meshes (keep pressure points and ring visible)
    torso.visible = false;
    chest.visible = false;
    neck.visible = false;
    head.visible = false;
    face.visible = false;
    leftUpperArm.visible = false;
    leftLowerArm.visible = false;
    rightUpperArm.visible = false;
    rightLowerArm.visible = false;
    leftHand.visible = false;
    rightHand.visible = false;
    leftUpperLeg.visible = false;
    leftLowerLeg.visible = false;
    rightUpperLeg.visible = false;
    rightLowerLeg.visible = false;
    leftFoot.visible = false;
    rightFoot.visible = false;

    if (CPR_MODEL_PATH) {
      try {
        cprModel = await loader.loadAsync(CPR_MODEL_PATH);
        cprModel.scale.setScalar(0.015); // Increased from 0.01 for better presentation
        // Force all materials to be opaque
        cprModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              mat.transparent = false;
              mat.opacity = 1.0;
              mat.depthWrite = true;
              mat.side = THREE.FrontSide;
            });
          }
        });
        root.add(cprModel);
        console.log('✅ Successfully loaded custom CPR model from:', CPR_MODEL_PATH);

        if (cprModel.animations && cprModel.animations.length > 0) {
          cprMixer = new THREE.AnimationMixer(cprModel);
          cprAnimations = cprModel.animations;
          console.log(`✅ Loaded ${cprAnimations.length} native animations from CPR FBX.`);
        }

        // Map custom rig nodes to animation targets (for procedural fallback)
        cprModel.traverse((node) => {
          const name = node.name.toLowerCase();
          if (name.includes('end') || name.endsWith('_end') || name.includes('mesh') || node.type === 'Mesh' || node.type === 'SkinnedMesh') return;

          if (name.includes('head') || name.includes('mixamorig4head') || name === 'mixamorig:head') {
            head = node as any;
          } else if (name.includes('chest') || name.includes('spine2') || name.includes('spine_2') || name.includes('mixamorig4spine2')) {
            chest = node as any;
          } else if (name.includes('leftarm') || name.includes('arm_l') || name.includes('bicep_l') || name.includes('mixamorig4leftarm')) {
            leftUpperArm = node as any;
          } else if (name.includes('leftforearm') || name.includes('forearm_l') || name.includes('mixamorig4leftforearm')) {
            leftLowerArm = node as any;
          }
        });
      } catch (e) {
        console.error("Failed to load CPR model:", e);
      }
    }

    if (BLEEDING_MODEL_PATH) {
      try {
        bleedingModel = await loader.loadAsync(BLEEDING_MODEL_PATH);
        bleedingModel.scale.setScalar(0.0055); // Decreased from 0.01 because model was too large
        bleedingModel.visible = false; // Hidden by default
        // Force all materials to be opaque
        bleedingModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              mat.transparent = false;
              mat.opacity = 1.0;
              mat.depthWrite = true;
              mat.side = THREE.FrontSide;
            });
          }
        });
        root.add(bleedingModel);
        console.log('✅ Successfully loaded custom Bleeding model from:', BLEEDING_MODEL_PATH);

        if (bleedingModel.animations && bleedingModel.animations.length > 0) {
          bleedingMixer = new THREE.AnimationMixer(bleedingModel);
          bleedingAnimations = bleedingModel.animations;
          console.log(`✅ Loaded ${bleedingAnimations.length} native animations from Bleeding FBX.`);
        }
      } catch (e) {
        console.error("Failed to load Bleeding model:", e);
      }
    }
  }

  return {
    root,
    cprModel,
    cprMixer,
    cprAnimations,
    bleedingModel,
    bleedingMixer,
    bleedingAnimations,
    head,
    neck,
    torso,
    chest,
    leftUpperArm,
    leftLowerArm,
    rightUpperArm,
    rightLowerArm,
    leftUpperLeg,
    leftLowerLeg,
    rightUpperLeg,
    rightLowerLeg,
    pressurePoints,
    tourniquetRing,
  };
}

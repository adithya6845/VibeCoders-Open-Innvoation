// ============================================
// Three.js Scene Setup
// ============================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let onRotateCallbacks: Array<(angle: number, distance: number) => void> = [];

export function initScene(container: HTMLElement) {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1628);
  scene.fog = new THREE.FogExp2(0x0a1628, 0.02);

  // Camera
  camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.5, 4);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x4488cc, 0.6);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.set(1024, 1024);
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 25;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x88bbff, 0.4);
  fillLight.position.set(-3, 4, -2);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0x22d3ee, 0.8, 15);
  rimLight.position.set(-2, 3, -3);
  scene.add(rimLight);

  // Ground disk
  const groundGeo = new THREE.CircleGeometry(3, 64);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0f1d33,
    roughness: 0.9,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  scene.add(ground);

  // Ground ring
  const ringGeo = new THREE.RingGeometry(2.8, 3, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0;
  scene.add(ring);

  // OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2;
  controls.maxDistance = 8;
  controls.maxPolarAngle = Math.PI * 0.85;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;
  controls.target.set(0, 1, 0);
  controls.update();

  controls.addEventListener('change', () => {
    const spherical = new THREE.Spherical().setFromVector3(
      camera.position.clone().sub(controls.target)
    );
    const azimuthDeg = THREE.MathUtils.radToDeg(spherical.theta);
    const distance = spherical.radius;
    onRotateCallbacks.forEach((cb) => cb(azimuthDeg, distance));
  });

  // Resize
  const resizeObserver = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
  resizeObserver.observe(container);

  return { scene, camera, renderer, controls };
}

export function getScene() { return scene; }
export function getCamera() { return camera; }
export function getRenderer() { return renderer; }
export function getControls() { return controls; }

export function onRotate(cb: (angle: number, distance: number) => void) {
  onRotateCallbacks.push(cb);
}

export function startRenderLoop(updateFn: (delta: number) => void) {
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    controls.update();
    updateFn(delta);
    renderer.render(scene, camera);
  }
  animate();
}

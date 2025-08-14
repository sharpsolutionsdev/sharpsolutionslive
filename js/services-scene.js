// Optional placeholder for services-specific Three.js mini-scenes
export {};
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('servicesCanvas');
if (!canvas) throw new Error('servicesCanvas missing');

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialiased: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

// Create texture loader for the logo
const textureLoader = new THREE.TextureLoader();
const logoTexture = textureLoader.load('Images/MainLogo.png');

// // Main logo cube with texture
// const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
// const cubeMaterial = new THREE.MeshPhysicalMaterial({
//   map: logoTexture,
//   metalness: 0.6,
//   roughness: 0.25,
//   clearcoat: 0.7,
//   clearcoatRoughness: 0.1,
//   transmission: 0.1,
//   thickness: 0.2,
// });
// const logoCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// scene.add(logoCube);

// Glowing accent edges for the logo cube
const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);
const cubeLine = new THREE.LineSegments(
  cubeEdges,
  new THREE.LineBasicMaterial({ color: 0xde07d0, linewidth: 2, opacity: 0.8, transparent: true })
);
scene.add(cubeLine);

// Additional floating geometric objects for visual interest
const torusGeometry = new THREE.TorusGeometry(0.8, 0.3, 16, 100);
const torusMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xde07d0,
  metalness: 0.4,
  roughness: 0.3,
  clearcoat: 0.5,
  transmission: 0.2,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(3, 1, 0);
scene.add(torus);

// Floating sphere
const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xde07d0,
  metalness: 0.3,
  roughness: 0.2,
  clearcoat: 0.8,
  transmission: 0.1,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-2.5, -1, 1);
scene.add(sphere);

// Octahedron for variety
const octaGeometry = new THREE.OctahedronGeometry(0.5);
const octaMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xa800a6,
  metalness: 0.5,
  roughness: 0.4,
  clearcoat: 0.6,
});
const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
octahedron.position.set(0, 2.5, -1);
scene.add(octahedron);

// Enhanced lighting setup
const mainLight = new THREE.PointLight(0xffffff, 1.5, 100);
mainLight.position.set(4, 6, 8);
scene.add(mainLight);

const secondaryLight = new THREE.PointLight(0xde07d0, 0.8, 50);
secondaryLight.position.set(-3, 4, 6);
scene.add(secondaryLight);

const accentLight = new THREE.PointLight(0xde07d0, 0.6, 40);
accentLight.position.set(3, -2, 5);
scene.add(accentLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// Particle system for ambient atmosphere
const particleCount = 100;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleSizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount * 3; i += 3) {
  particlePositions[i] = (Math.random() - 0.5) * 20;
  particlePositions[i + 1] = (Math.random() - 0.5) * 20;
  particlePositions[i + 2] = (Math.random() - 0.5) * 20;
  particleSizes[i / 3] = Math.random() * 0.1 + 0.05;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

const particleMaterial = new THREE.PointsMaterial({
  color: 0xde07d0,
  size: 0.1,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Animation function
function animate() {
  const time = Date.now() * 0.001;
  
  // Rotate logo cube
  logoCube.rotation.x += 0.012;
  logoCube.rotation.y += 0.018;
  cubeLine.rotation.x = logoCube.rotation.x;
  cubeLine.rotation.y = logoCube.rotation.y;
  
  // Rotate additional objects
  torus.rotation.x += 0.008;
  torus.rotation.y += 0.012;
  
  sphere.rotation.x += 0.006;
  sphere.rotation.y += 0.009;
  
  octahedron.rotation.x += 0.01;
  octahedron.rotation.y += 0.007;
  
  // Floating motion for additional objects
  torus.position.y = 1 + Math.sin(time * 0.8) * 0.3;
  sphere.position.x = -2.5 + Math.sin(time * 0.6) * 0.2;
  octahedron.position.y = 2.5 + Math.sin(time * 1.2) * 0.4;
  
  // Rotate particles slowly
  particles.rotation.y += 0.002;
  
  // Subtle camera movement for dynamic feel
  camera.position.x = Math.sin(time * 0.2) * 0.3;
  camera.position.y = Math.cos(time * 0.15) * 0.2;
  camera.lookAt(0, 0, 0);
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
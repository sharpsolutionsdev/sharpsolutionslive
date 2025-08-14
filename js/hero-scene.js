// Hero Three.js Scene
const canvas = document.getElementById('heroCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// 1. Rotating Icosahedron
const icoGeometry = new THREE.IcosahedronGeometry(1.5, 1);
const icoMaterial = new THREE.MeshStandardMaterial({ color: 0xde07d0, wireframe: true });
const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
scene.add(icosahedron);

// 2. Particle Field
const particleCount = 200;
const particlesGeometry = new THREE.BufferGeometry();
const positions = [];
for (let i = 0; i < particleCount; i++) {
  positions.push((Math.random() - 0.5) * 20);
  positions.push((Math.random() - 0.5) * 20);
  positions.push((Math.random() - 0.5) * 20);
}
particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({ color: 0xde07d0, size: 0.05 });
const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleMesh);

// 3. Wave Mesh
const waveGeometry = new THREE.PlaneGeometry(10, 10, 20, 20);
const waveMaterial = new THREE.MeshBasicMaterial({ color: 0xde07d0, wireframe: true });
const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
waveMesh.rotation.x = -Math.PI / 2;
waveMesh.position.y = -2;
scene.add(waveMesh);

let mouseX = 0, mouseY = 0;
let targetRotX = 0, targetRotY = 0;

function onMove(x, y){
  const nx = (x / window.innerWidth) * 2 - 1;
  const ny = (y / window.innerHeight) * 2 - 1;
  mouseX = nx; mouseY = ny;
  targetRotX = ny * 0.6;
  targetRotY = nx * 0.85;
}

window.addEventListener('pointermove', (e) => onMove(e.clientX, e.clientY), { passive: true });
window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY), { passive: true });
window.addEventListener('touchmove', (e) => { if(e.touches && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });

// Animate
function animate() {
  requestAnimationFrame(animate);

  // Icosahedron rotation
  icosahedron.rotation.x += 0.003;
  icosahedron.rotation.y += 0.002;
  // Ease towards mouse target
  icosahedron.rotation.x += (targetRotX - icosahedron.rotation.x) * 0.05;
  icosahedron.rotation.y += (targetRotY - icosahedron.rotation.y) * 0.05;

  // Camera parallax
  camera.position.x += (mouseX * 1.1 - camera.position.x) * 0.06;
  camera.position.y += (-mouseY * 0.7 - camera.position.y) * 0.06;
  camera.lookAt(0, 0, 0);

  // Wave motion
  const time = Date.now() * 0.001;
  waveGeometry.attributes.position.array.forEach((v, i) => {
    if (i % 3 === 2) return; // skip z-axis
    if (i % 3 === 1) { // y-axis is height in plane
      waveGeometry.attributes.position.array[i] = Math.sin(time + i) * 0.2;
    }
  });
  waveGeometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



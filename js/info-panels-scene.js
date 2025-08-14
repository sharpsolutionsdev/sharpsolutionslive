import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  const container = document.getElementById('infoPanelsCanvas');
  
  if (!container) throw new Error('Canvas container missing');
  
  // Set canvas style
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  camera.position.z = 5;
  renderer.setSize(container.clientWidth, container.clientHeight);

  // Create floating spheres that represent clock/calendar
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xde07d0,
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.5
  });

  const sphere1 = new THREE.Mesh(geometry, material);
  const sphere2 = new THREE.Mesh(geometry, material);

  sphere1.position.x = -2;
  sphere2.position.x = 2;

  scene.add(sphere1);
  scene.add(sphere2);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add point light
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  function animate() {
    requestAnimationFrame(animate);
    const t = performance.now()*0.001;
    sphere1.position.y = Math.sin(t*1.1) * 0.25;
    sphere2.position.y = Math.cos(t*1.3) * 0.25;
    sphere1.rotation.x += 0.01;
    sphere2.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  // Handle resize
  new ResizeObserver(() => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }).observe(container);
});
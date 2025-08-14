// Optional placeholder for projects-specific Three.js mini-scenes
export {};
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

function initMini(canvasId, color = 0xde07d0, logoPath = null) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  cam.position.z = 3;

  // Cube geometry instead of torus knot
  const geo = new THREE.BoxGeometry(1, 1, 1);
  
  let materials;
  
  if (logoPath) {
    // Create texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Load the logo texture
    const logoTexture = textureLoader.load(logoPath);
    
    // Create materials for each face with the logo
    materials = [
      new THREE.MeshStandardMaterial({ map: logoTexture, metalness: 0.4, roughness: 0.5 }), // right
      new THREE.MeshStandardMaterial({ map: logoTexture, metalness: 0.4, roughness: 0.5 }), // left
      new THREE.MeshStandardMaterial({ map: logoTexture, metalness: 0.4, roughness: 0.5 }), // top
      new THREE.MeshStandardMaterial({ map: logoTexture, metalness: 0.4, roughness: 0.5 }), // bottom
      new THREE.MeshStandardMaterial({ map: logoTexture, metalness: 0.4, roughness: 0.5 }), // front
      new THREE.MeshStandardMaterial({ map: logoTexture, metalness: 0.4, roughness: 0.5 })  // back
    ];
  } else {
    // Fallback to solid color material
    materials = new THREE.MeshStandardMaterial({ color, metalness: 0.4, roughness: 0.5 });
  }
  
  const mesh = new THREE.Mesh(geo, materials);
  scene.add(mesh);

  // Glowing accent edges
  const edges = new THREE.EdgesGeometry(geo);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xde07d0, linewidth: 2, opacity: 0.6, transparent: true })
  );
  scene.add(line);

  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(3, 3, 3);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  let last = 0;
  function loop(ts) {
    const dt = (ts - last) / 1000;
    last = ts;
    mesh.rotation.x += dt * 0.3;
    mesh.rotation.y += dt * 0.5;
    line.rotation.x = mesh.rotation.x;
    line.rotation.y = mesh.rotation.y;
    renderer.render(scene, cam);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // resize handling
  new ResizeObserver(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  }).observe(canvas);   
}

// initialize mini canvases (lazy-safe)
document.addEventListener('DOMContentLoaded', () => {
  initMini('mini-villanova', 0xde07d0, 'Images/villanova-logo 1.png');
  initMini('mini-reyton', 0x08b2ff, 'Images/reyton-logo 1.png');
  initMini('mini-wishy', 0xffb86b, 'Images/wishywasy-logo 1.png');
});
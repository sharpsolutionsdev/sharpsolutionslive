// Optional placeholder for contact page background scene
export {};
// js/contact-scene.js
// Three.js is loaded globally via CDN in the HTML

// Get the existing canvas from the HTML
const canvas = document.getElementById('contactCanvas');
if (!canvas) {
  console.error('Contact canvas not found');
}

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Enhanced particle system for background
const geometry = new THREE.BufferGeometry();
const particles = 200;
const positions = new Float32Array(particles * 3);
const colors = new Float32Array(particles * 3);
const sizes = new Float32Array(particles);

for (let i = 0; i < particles; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  
  // Create gradient colors
  const color = new THREE.Color();
  color.setHSL(0.8 + Math.random() * 0.2, 0.8, 0.6 + Math.random() * 0.4);
  colors[i * 3] = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;
  
  sizes[i] = Math.random() * 0.1 + 0.05;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const particleMaterial = new THREE.PointsMaterial({ 
  size: 0.1,
  color: 0xde07d0,
  transparent: true,
  opacity: 0.6,
  vertexColors: false,
  blending: THREE.AdditiveBlending
});

const points = new THREE.Points(geometry, particleMaterial);
scene.add(points);

// Social Media 3D Objects
const socialMediaObjects = [];

// Instagram Logo (Camera-like object)
const instagramGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.3);
const instagramMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xde07d0,
  metalness: 0.6,
  roughness: 0.2,
  clearcoat: 0.8,
  clearcoatRoughness: 0.1,
});
const instagram = new THREE.Mesh(instagramGeometry, instagramMaterial);
instagram.position.set(-4, 3, 0);
instagram.userData = { type: 'instagram', url: 'https://instagram.com' };
socialMediaObjects.push(instagram);
scene.add(instagram);

// Twitter/X Logo (Bird-like object using octahedron)
const twitterGeometry = new THREE.OctahedronGeometry(0.8);
const twitterMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xde07d0,
  metalness: 0.5,
  roughness: 0.3,
  clearcoat: 0.7,
});
const twitter = new THREE.Mesh(twitterGeometry, twitterMaterial);
twitter.position.set(4, 2, 0);
twitter.userData = { type: 'twitter', url: 'https://twitter.com' };
socialMediaObjects.push(twitter);
scene.add(twitter);

// WhatsApp Logo (Phone-like object using rounded box)
const whatsappGeometry = new THREE.BoxGeometry(1, 1.8, 0.4);
const whatsappMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xde07d0,
  metalness: 0.4,
  roughness: 0.2,
  clearcoat: 0.6,
});
const whatsapp = new THREE.Mesh(whatsappGeometry, whatsappMaterial);
whatsapp.position.set(0, -3, 0);
whatsapp.userData = { type: 'whatsapp', url: 'https://wa.me' };
socialMediaObjects.push(whatsapp);
scene.add(whatsapp);

// Add glowing edges to social media objects
socialMediaObjects.forEach(obj => {
  const edges = new THREE.EdgesGeometry(obj.geometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ 
      color: 0xde07d0, 
      linewidth: 2, 
      opacity: 0.8, 
      transparent: true 
    })
  );
  line.position.copy(obj.position);
  line.rotation.copy(obj.rotation);
  scene.add(line);
  
  // Store reference to edge lines for animation
  obj.edgeLine = line;
});

// Enhanced lighting
const mainLight = new THREE.PointLight(0xffffff, 1.5, 100);
mainLight.position.set(8, 10, 8);
scene.add(mainLight);

const secondaryLight = new THREE.PointLight(0xde07d0, 1, 50);
secondaryLight.position.set(-6, 8, 6);
scene.add(secondaryLight);

const accentLight = new THREE.PointLight(0xde07d0, 0.8, 40);
accentLight.position.set(6, -4, 8);
scene.add(accentLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// Add floating geometric shapes for visual interest
const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
const torusMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xde07d0,
  metalness: 0.3,
  roughness: 0.4,
  clearcoat: 0.5,
  transmission: 0.2,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 0, -5);
scene.add(torus);

// Floating spheres
const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xde07d0,
  metalness: 0.4,
  roughness: 0.3,
  clearcoat: 0.6,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-6, -2, 2);
scene.add(sphere);

// Animation function
function animate() {
  const time = Date.now() * 0.001;
  
  // Rotate particles
  points.rotation.y += 0.002;
  points.rotation.x += 0.001;
  
  // Animate social media objects
  socialMediaObjects.forEach((obj, index) => {
    // Floating motion
    obj.position.y += Math.sin(time * 0.8 + index) * 0.002;
    obj.position.x += Math.cos(time * 0.6 + index) * 0.001;
    
    // Rotation
    obj.rotation.x += 0.008 + index * 0.002;
    obj.rotation.y += 0.012 + index * 0.003;
    
    // Update edge lines
    if (obj.edgeLine) {
      obj.edgeLine.rotation.copy(obj.rotation);
    }
    
    // Hover effect - scale up slightly
    const hoverScale = 1 + Math.sin(time * 2 + index) * 0.05;
    obj.scale.setScalar(hoverScale);
  });
  
  // Animate additional objects
  torus.rotation.x += 0.005;
  torus.rotation.y += 0.008;
  torus.position.y = Math.sin(time * 0.4) * 0.5;
  
  sphere.rotation.x += 0.006;
  sphere.rotation.y += 0.009;
  sphere.position.x = -6 + Math.sin(time * 0.7) * 0.3;
  
  // Subtle camera movement
  camera.position.x = Math.sin(time * 0.1) * 0.5;
  camera.position.y = Math.cos(time * 0.15) * 0.3;
  camera.lookAt(0, 0, 0);
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Handle window resize
function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);

// Add click event listeners to social media objects
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);
  
  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(socialMediaObjects);
  
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    if (clickedObject.userData && clickedObject.userData.url) {
      // Add click animation
      clickedObject.scale.setScalar(1.3);
      setTimeout(() => {
        clickedObject.scale.setScalar(1);
      }, 200);
      
      // Open link in new tab
      window.open(clickedObject.userData.url, '_blank');
    }
  }
}

window.addEventListener('click', onMouseClick);

// Add hover effect
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(socialMediaObjects);
  
  // Reset all objects
  socialMediaObjects.forEach(obj => {
    obj.material.emissive.setHex(0x000000);
    obj.scale.setScalar(1);
  });
  
  // Highlight hovered object
  if (intersects.length > 0) {
    const hoveredObject = intersects[0].object;
    hoveredObject.material.emissive.setHex(0x333333);
    hoveredObject.scale.setScalar(1.1);
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
}

window.addEventListener('mousemove', onMouseMove);

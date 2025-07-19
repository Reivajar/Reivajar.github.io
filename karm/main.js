import * as THREE from './js/three.module.js';
import { ARButton } from './js/ARButton.js';
import { GLTFLoader } from './js/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// Add AR button
document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

// Lighting (optional)
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
scene.add(light);

// Load GLB point cloud
const loader = new GLTFLoader();
loader.load('pointcloud.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(1, 1, 1); // adjust as needed
  model.position.set(0, 0, -1); // place 1 meter in front
  scene.add(model);
});

// Animate
function animate() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}

animate();

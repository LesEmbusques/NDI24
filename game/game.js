import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ canvas: myCanvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Add a box
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshStandardMaterial({ color: 0xffffff });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Add a white directional light
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Add an ambient light for softer shadows
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Position the camera
camera.position.z = 5;

// Add OrbitControls for interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth rotation

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls for damping
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
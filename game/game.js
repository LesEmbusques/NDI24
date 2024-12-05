import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {loadModel} from './loader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: myCanvas, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

// Add a white directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Add an ambient light for softer shadows
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Position the camera
camera.position.z = 7;
camera.position.y = 10;

// Add OrbitControls for interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.zoomToCursor = true;

// Set the focus of the camera to a higher Y position
const targetPosition = new THREE.Vector3(0, 7, 0); // Focus at Y = 10
controls.target.copy(targetPosition);
camera.lookAt(targetPosition);

// Load models
let skeletonMesh = null;
loadModel('../public/modelsAndTextures/Skeleton/', 'scene.gltf', {
    position: [0, 1.05, -1]
}, scene);

loadModel('../public/modelsAndTextures/', 'heart.glb', {
    position: [0, 7, -0.8],
    scale: [0.5, 0.5, 0.5]
}, scene);

loadModel('../public/modelsAndTextures/', 'lung.glb', {
    position: [-0.15, 7, 0.5],
    scale: [1.75, 1.75, 1.75]
}, scene);

loadModel('../public/modelsAndTextures/', 'brain.glb', {
    position: [0, 10.3, -1.5],
    scale: [1.25, 1.25, 1.25]
}, scene);

loadModel('../public/modelsAndTextures/', 'stomach.glb', {
    position: [0.5, 6, -0.75],
    scale: [0.15, 0.15, 0.15]
}, scene);

loadModel('../public/modelsAndTextures/', 'kidney.glb', {
    position: [-0.75, 5, -0.75],
    scale: [0.16, 0.16, 0.16]
}, scene);

loadModel('../public/modelsAndTextures/', 'liver.glb', {
    position: [-0.5, 6, -0.75],
    scale: [5, 5, 5],
    rotation: [0, -Math.PI / 2, 0]
}, scene);


document.getElementById('skeletonButton').addEventListener('click', (event) => {
    const object = scene.getObjectByProperty("uuid", "scene.gltf");
    console.log(object);
    object.visible = !object.visible;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls for damping
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
animate();
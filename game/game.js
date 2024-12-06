import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {loadModel} from './loader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: myCanvas, alpha: true });
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
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
loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/Skeleton/`, 'scene.gltf', {
    position: [0, 1.05, -1]
}, scene);

loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/`, 'heart.glb', {
    position: [0, 7, -0.8],
    scale: [0.5, 0.5, 0.5],
    hoverable: true,   // Indique si l'objet est interactif
    link: "https://example.com/heart" // Lien à ouvrir lors du clic
}, scene);

loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/`, 'lung.glb', {
    position: [-0.15, 7, 0.5],
    scale: [1.75, 1.75, 1.75],
    hoverable: true,   // Indique si l'objet est interactif
    link: "https://example.com/lung" // Lien à ouvrir lors du clic
}, scene);

loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/`, 'brain.glb', {
    position: [0, 10.3, -1.2],
    scale: [1.2, 1.2, 1.2],
    hoverable: true,   // Indique si l'objet est interactif
    link: "https://example.com/brain" // Lien à ouvrir lors du clic
}, scene);

loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/`, 'stomach.glb', {
    position: [0.5, 6, -0.75],
    scale: [0.15, 0.15, 0.15],
    hoverable: true,   // Indique si l'objet est interactif
    link: "https://example.com/stomach" // Lien à ouvrir lors du clic
}, scene);

loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/`, 'kidney.glb', {
    position: [-0.75, 5, -0.75],
    scale: [0.16, 0.16, 0.16],
    hoverable: true,   // Indique si l'objet est interactif
    link: "https://example.com/kidney" // Lien à ouvrir lors du clic
}, scene);

loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/`, 'liver.glb', {
    position: [-0.5, 6, -0.75],
    scale: [5, 5, 5],
    rotation: [0, -Math.PI / 2, 0],
    hoverable: true,   // Indique si l'objet est interactif
    link: "https://example.com/liver" // Lien à ouvrir lors du clic
}, scene);


document.getElementById('skeletonButton').addEventListener('click', (event) => {
    const object = scene.getObjectByProperty("uuid", "scene.gltf");
    console.log(object);
    object.visible = !object.visible;
});

renderer.domElement.addEventListener('mousemove', onMouseMove, false);


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


function applyHoverEffect(object) {
    if (!object.userData.originalColor) {
        object.userData.originalColor = object.material.color.clone();
    }
    object.material.color.set(0xff0000); // Change la couleur en rouge
}

function resetHoverEffect(object) {
    if (object.userData.originalColor) {
        object.material.color.copy(object.userData.originalColor);
    }
}

// hover organs
let hoveredObject = null;

function onMouseMove(event) {
    // Mettre à jour les coordonnées de la souris
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Mettre à jour le raycaster
    raycaster.setFromCamera(mouse, camera);

    // Vérifier les intersections
    const intersects = raycaster.intersectObjects(scene.children, true).filter((obj) => obj.object.userData.hoverable);

    if (intersects.length > 0) {
        const object = intersects[0].object;

        // Vérifier si l'objet est hoverable
        if (object.userData.hoverable) {

            if (hoveredObject !== object) {
                if (hoveredObject) resetHoverEffect(hoveredObject);
                applyHoverEffect(object);
                hoveredObject = object;
            }
        } else {
            // Si l'objet n'est pas hoverable, réinitialiser
            if (hoveredObject) resetHoverEffect(hoveredObject);
            hoveredObject = null;
        }
    } else {
        // Réinitialiser si aucun objet n'est survolé
        if (hoveredObject) resetHoverEffect(hoveredObject);
        hoveredObject = null;
    }
}

function onClick(event) {
    event.preventDefault();

    // Mettre à jour les coordonnées de la souris
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Mettre à jour le raycaster
    raycaster.setFromCamera(mouse, camera);

    // Vérifier les intersections
    const intersects = raycaster.intersectObjects(scene.children, true).filter((obj) => obj.object.userData.hoverable);

    if (intersects.length > 0) {
        const object = intersects[0].object;

        // Si l'objet a un lien défini, rediriger
        if (object.userData.hoverable && object.userData.link) {
            window.open(object.userData.link, '_blank'); // Ouvre le lien dans un nouvel onglet
        }
    }
}
renderer.domElement.addEventListener('click', onClick, false);

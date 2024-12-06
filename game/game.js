import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {loadModel} from './loader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: myCanvas, alpha: true });
const skeletonButton = document.getElementById('skeletonButton');
const popups = document.getElementById('popups');
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

scene.background = new THREE.Color(0xe8f4f8);

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
loadModels();

skeletonButton.addEventListener('click', (event) => {
    const object = scene.getObjectByProperty("uuid", "scene.gltf");
    console.log(object);
    object.visible = !object.visible;
    skeletonButton.innerText = object.visible ? "Cacher le squelette" : "Afficher le squelette";
});

renderer.domElement.addEventListener('mousemove', onMouseMove, false);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Créer le pass de bloom
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

// Appliquer le bloom à l'objet hoveré
function applyGlowEffectToHoveredObject(object) {
    bloomPass.enabled = true;
    object.material.emissive.set(0x00ff00); // Change la couleur émissive de l'objet survolé
    object.material.emissiveIntensity = 0.1; // Change l'intensité de la couleur émissive
}

// Désactiver l'effet glow lorsque l'objet n'est plus survolé
function resetGlowEffect(object) {
    bloomPass.enabled = false;
    object.material.emissive.set(0x000000); // Réinitialise la couleur émissive de l'objet
}

// hover organs
var hoveredObject = null;

var updatePointer = () => {
    document.getElementById('myCanvas').style.cursor = hoveredObject ? 'pointer' : 'auto';
}

function closePopups() {
    popups.querySelectorAll(".active").forEach((popup) => {
        popup.classList.remove('active');
    });
}

popups.querySelectorAll('.close').forEach((closeButton) => {
    closeButton.addEventListener('click', closePopups);
});

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
                if (hoveredObject) resetGlowEffect(hoveredObject);
                applyGlowEffectToHoveredObject(object);
                hoveredObject = object;
            }
        } else {
            // Si l'objet n'est pas hoverable, réinitialiser
            if (hoveredObject) resetGlowEffect(hoveredObject);
            hoveredObject = null;
        }
    } else {
        // Réinitialiser si aucun objet n'est survolé
        if (hoveredObject) resetGlowEffect(hoveredObject);
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
        if (object.userData.hoverable && object.userData.name) {
            closePopups();
            var popup = popups.querySelector('.popup[data-popup="' + object.userData.name + '"]');
            popup.classList.add('active');
        }
    }
}
renderer.domElement.addEventListener('click', onClick, false);


// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls for damping
    if (hoveredObject) {
        applyGlowEffectToHoveredObject(hoveredObject);
    }
    updatePointer();
    renderer.render(scene, camera);
}


// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
animate();

function loadModels() {
    loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/Skeleton/`, 'scene.gltf', {
        position: [0, 1.05, -1],
        hoverable: false,
        name: "skeleton" 
    }, scene);
    
    loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/`, 'heart.glb', {
        position: [0, 7, -0.8],
        scale: [0.5, 0.5, 0.5],
        hoverable: true,
        name: "heart" 
    }, scene);
    
    if (localStorage.getItem("lungs")) {
        loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/`, 'lung.glb', {
            position: [-0.15, 7, 0.5],
            scale: [1.75, 1.75, 1.75],
            hoverable: true,
            name: "lungs" 
        }, scene);
    }
    
    if (localStorage.getItem("brain")) {
        loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/`, 'brain.glb', {
            position: [0, 10.3, -1.2],
            scale: [1.2, 1.2, 1.2],
            hoverable: true,
            name: "brain" 
        }, scene);
    }
    
    if (localStorage.getItem("stomach")) {
        loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/`, 'stomach.glb', {
            position: [0.5, 6, -0.75],
            scale: [0.15, 0.15, 0.15],
            hoverable: true,
            name: "stomach" 
        }, scene);
    }
    
    if (localStorage.getItem("kidney")) {
        loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/`, 'kidney.glb', {
            position: [-0.75, 5, -0.75],
            scale: [0.16, 0.16, 0.16],
            hoverable: true,
            name: "kidney" 
        }, scene);
    }
    
    if (localStorage.getItem("liver")) {
        loadModel(`${import.meta.env.BASE_URL}modelsAndTextures/`, 'liver.glb', {
            position: [-0.5, 6, -0.75],
            scale: [5, 5, 5],
            rotation: [0, -Math.PI / 2, 0],
            hoverable: true,
            name: "liver"
        }, scene);
    }
}
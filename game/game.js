import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/addons';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';


// Scene setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({canvas: myCanvas, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

// Add a white directional light
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Add an ambient light for softer shadows
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Position the camera
camera.position.z = 20;
camera.position.y = 10;

// // Add OrbitControls for interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.zoomToCursor = true;

// Set the focus of the camera to a higher Y position
const targetPosition = new THREE.Vector3(0, 0, 0); // Focus at Y = 10
controls.target.copy(targetPosition);
camera.lookAt(targetPosition);


// Skeleton
const loaderSkeleton = new GLTFLoader().setPath('../public/modelsAndTextures/Skeleton/');
loaderSkeleton.load(
    'scene.gltf',
    (gltf) => {
        console.log('loading model');
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        mesh.position.set(0, 1.05, -1);
        scene.add(mesh);
    },
    (xhr) => {
        console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
    },
    (error) => {
        console.error(error);
    }
);

// Heart

const loaderHeart = new GLTFLoader().setPath('../public/modelsAndTextures/');
loaderHeart.load(
    'heart.glb',
    (gltf) => {
        console.log('loading model');
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        mesh.position.set(0, 7, -0.8);
        mesh.scale.set(0.5, 0.5, 0.5);
        scene.add(mesh);
    },
    (xhr) => {
        console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
    },
    (error) => {
        console.error(error);
    }
);

const loaderLung = new GLTFLoader().setPath('../public/modelsAndTextures/');
loaderLung.load(
    'lung.glb',
    (gltf) => {
        console.log('loading model');
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        mesh.position.set(-0.15, 7, 0.5);
        mesh.scale.set(1.75, 1.75, 1.75);
        scene.add(mesh);
    },
    (xhr) => {
        console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
    },
    (error) => {
        console.error(error);
    }
);

const loaderBrain = new GLTFLoader().setPath('../public/modelsAndTextures/');
loaderBrain.load(
    'brain.glb',
    (gltf) => {
        console.log('loading model');
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        mesh.position.set(0, 10.3, -1.5);
        mesh.scale.set(1.25, 1.25, 1.25);
        scene.add(mesh);
    },
    (xhr) => {
        console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
    },
    (error) => {
        console.error(error);
    }
);

const loaderStomach = new GLTFLoader().setPath('../public/modelsAndTextures/');

loaderStomach.load(
    'stomach.glb',
    (gltf) => {
        console.log('loading model');
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        mesh.position.set(0.5, 6, -0.75);
        mesh.scale.set(0.15, 0.15, 0.15);
        scene.add(mesh);
    },
    (xhr) => {
        console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
    },
    (error) => {
        console.error(error);
    }
);

const loaderKidney = new GLTFLoader().setPath('../public/modelsAndTextures/');

loaderKidney.load(
    'kidney.glb',
    (gltf) => {
        console.log('loading model');
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        mesh.position.set(-0.75, 5, -0.75);
        mesh.scale.set(0.16, 0.16, 0.16);
        scene.add(mesh);
    },
    (xhr) => {
        console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
    },
    (error) => {
        console.error(error);
    }
);

const loaderLiver = new GLTFLoader().setPath('../public/modelsAndTextures/');

loaderLiver.load(
    'liver.glb',
    (gltf) => {
        console.log('loading model');
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        mesh.position.set(-0.5, 6, -0.75);
        mesh.scale.set(5, 5, 5);
        mesh.rotation.set(0, -90, 0);
        scene.add(mesh);
    },
    (xhr) => {
        console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
    },
    (error) => {
        console.error(error);
    }
);

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


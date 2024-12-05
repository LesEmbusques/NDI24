import { GLTFLoader } from 'three/addons';

// Fonction générique pour charger un modèle GLTF
export const loadModel = (path, fileName, { position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }, scene) => {
    const loader = new GLTFLoader().setPath(path);
    loader.load(
        fileName,
        (gltf) => {
            console.log(`Model loaded: ${fileName}`);
            const mesh = gltf.scene;

            mesh.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            mesh.position.set(...position);
            mesh.scale.set(...scale);
            mesh.rotation.set(...rotation);
            scene.add(mesh);
        },
        (xhr) => {
            console.log(`Loading ${fileName}: ${(xhr.loaded / xhr.total) * 100}%`);
        },
        (error) => {
            console.error(`Error loading ${fileName}:`, error);
        }
    );
};


import { GLTFLoader } from 'three/addons';

// Fonction générique pour charger un modèle GLTF
export const loadModel = (path, fileName, { position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0], hoverable = false, name = ""}, scene) => {
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
            mesh.uuid = fileName;
            mesh.visible = true;
            
            // Propagation des données userData au modèle et à tous ses enfants
            mesh.userData = {
                hoverable: hoverable,
                name: name
            };

            mesh.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    // Propagation des userData aux enfants
                    child.userData = {
                        hoverable: hoverable,
                        name: name
                    };
                }
            });
            
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


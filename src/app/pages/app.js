
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

document.getElementById("img-post").addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    // Ajout d'un event listener pour récupérer l'image
    input.addEventListener("change", function () {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("img-post").src = e.target.result;
            document.getElementById("fileImg").files = input.files;
        };
        reader.readAsDataURL(file);
    });

    input.click();

});

document.getElementById("submit").addEventListener("click", function (event) {
    event.preventDefault();
    const form = document.getElementById("postForm");
    document.getElementById("submit").style.backgroundColor = "grey";
    const formData = new FormData(form);
    for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
    }

    // Envoyer les données au serveur
    fetch('../requetes/requete-addpost.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                window.location.href = "../pages/app.php"; // Redirection
            } else {
                alert("Erreur : " + data.message);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la requête :", error);
            window.location.href = "../pages/app.php";
        });
});



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const earthRadius = 2;
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3;
controls.maxDistance = 10;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2.2;
controls.minPolarAngle = Math.PI / 3;



renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('earth-container').appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(10, 0, 10);
const light2 = new THREE.PointLight(0xffffff, 2, 100);
light2.position.set(-10, 10, 10);
light.lookAt(0, 0, 0);
light2.lookAt(0, 0, 0);
scene.add(light);
scene.add(light2);

const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('../earth_atmos_2048.jpg'), // Texture Terre
    bumpMap: new THREE.TextureLoader().load('../earthbump1k.jpg'), // Relief
    bumpScale: 0.05,
    specularMap: new THREE.TextureLoader().load('../earth_specular_2048.jpg'), // Reflets
    specular: new THREE.Color('grey'),
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
const earthGroup = new THREE.Group();
earthGroup.add(earth);
scene.add(earthGroup);


function getAllPost() {
    fetch('../requetes/requete-getAllPost.php')
        .then(response => response.json())
        .then(data => {
            data.posts.forEach(post => {
                const loader = new GLTFLoader();
                loader.load(
                    '../Archive/location tag.gltf',
                    (gltf) => {
                        const postMesh = gltf.scene.children[0];
                        postMesh.scale.set(0.04, 0.04, 0.04);
                        postMesh.position.set(post.posX, post.posY, post.posZ);
                        postMesh.userData.url = `post.php?id=${post.id}`;
                        postMesh.lookAt(0, 0, 0);
                        earthGroup.add(postMesh);

                        // On fait un rectangle autour du point pour pouvoir plus facilement cliquer dessus
                        const geometry = new THREE.BoxGeometry(0.1, 0.2, 0.1);
                        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                        const cube = new THREE.Mesh(geometry, material);
                        cube.position.set(post.posX, post.posY, post.posZ);
                        cube.userData.url = `post.php?id=${post.id}`;
                        cube.visible = false;
                        earthGroup.add(cube);

                    },
                    undefined,
                    (error) => {
                        console.error('Erreur de chargement du modèle GLTF', error);
                    }
                );
            });
        });

}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

camera.position.z = 5;
const animate = () => {
    requestAnimationFrame(animate);
    earthGroup.rotation.y += 0.001;
    renderer.render(scene, camera);
};

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.005,
});

const starCount = 10000;
const starVertices = [];


for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 1000;
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

let x,y, z;

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    console.log(intersects);

    if (event.target == document.querySelector('canvas')) {
        document.querySelector('.fenetreDroit').style.display = "none";
    }
    if (intersects.length > 0) {
        const intersect = intersects[0];

        if (intersect.object.userData && intersect.object.userData.url) {
            getPost(intersect.object);
        } else if (intersect.object === earth) {
            const globalPoint = intersect.point;

            const localPoint = earthGroup.worldToLocal(globalPoint.clone());

            x = localPoint.x;
            y = localPoint.y;
            z = localPoint.z;

            document.querySelector('input[name="posX"]').value = x;
            document.querySelector('input[name="posY"]').value = y;
            document.querySelector('input[name="posZ"]').value = z;

            animateForm();
        }
    }


});

const formGeometry = new THREE.BoxGeometry(1, 1, 0.1, 10, 10, 1,
    [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
);

const formMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
});

const formMesh = new THREE.Mesh(formGeometry, formMaterial);
formMesh.position.set(0, 0, 3);
formMesh.scale.set(0, 0, 0);
formMesh.visible = false;
scene.add(formMesh);


// Fonction d'animation mais on l'utilise pas
function animateForm(duration = 1000) {
    document.querySelector('.post-form').style.display = 'block';

    const startTime = performance.now();
    function animate(time) {
        const elapsedTime = time - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        formMesh.scale.set(progress*4, progress*2, progress);

        formMesh.rotation.y += 0.01;

        formMesh.position.x = Math.sin(progress * Math.PI * 2) * 3;
        formMesh.position.z = Math.cos(progress * Math.PI * 2) * 3;
        formMesh.lookAt(camera.position);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
        }
    }

    requestAnimationFrame(animate);
}



window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const intersect = intersects[0];
        if (intersect.object.userData && intersect.object.userData.url) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    }
});


document.querySelector('.post-form p').addEventListener('click', () => {
    document.querySelector('.post-form').style.display = 'none';
    formMesh.scale.set(0, 0, 0);
});


var current_post_id = null;
var current_object = null;
function getPost(object){
    current_object = object;

    fetch(`../requetes/requete-getPostById.php?id=${object.userData.url.split('=')[1]}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                //image_data est une base 64
                document.querySelector('.fenetreDroit .img img').src = `data:image/png;base64,${data.post[0].image_data}`;
                console.log(data.post);

                document.querySelector('.fenetreDroit .post-info').innerHTML = `
                    <p><strong>Publié par:</strong> ${data.post[0].author}</p>
                    <p><strong>Publié le:</strong> ${data.post[0].created_at}</p>
                `;
                document.querySelector('.fenetreDroit .post-content').innerHTML = `
                    <p>${data.post[0].content}</p>
                `;

                // Afficher les commentaires
                const commentsContainer = document.querySelector('.fenetreDroit .comments');
                commentsContainer.innerHTML = ''; // Réinitialiser les commentaires existants

                if (data.post[0].comments != null) {
                    data.post[0].comments.forEach(comment => {
                        const commentElement = document.createElement('div');
                        commentElement.classList.add('comment');
                        commentElement.innerHTML = `
                    <p><strong>${comment.username}:</strong> ${comment.content}</p>
                `;
                        commentsContainer.appendChild(commentElement);
                    });
                }else{
                    commentsContainer.innerHTML = '<p>Aucun commentaire pour le moment.</p>';
                }

                // Afficher la fenêtre contenant le post
                document.querySelector('.fenetreDroit').style.display = 'block';

                const deleteButton = document.querySelector('.fenetreDroit .delete-post');
                console.log(data);
                if (data.post[0].user_id + "" === data.currentUserId + "") {
                    deleteButton.style.display = 'block';
                } else {
                    deleteButton.style.display = 'none';
                }

                current_post_id = data.post[0].id;

            } else {
                console.error("Erreur lors de la récupération du post :", data.message);
            }
            document.querySelector('.fenetreDroit').style.display = "block";

        });

    console.log(object.userData.url);
}

document.getElementById('addComment').addEventListener('click', () => {
    const commentContent = document.querySelector('#commentInput').value;
    if (commentContent.trim() === '') {
        alert("Veuillez saisir un commentaire.");
        return;
    }

    const formData = new FormData();
    formData.append('content', commentContent);
    formData.append('postId', current_post_id);

    fetch('../requetes/requete-addComment.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Ajout du commentaire dans la fenêtre
                const commentsContainer = document.querySelector('.fenetreDroit .comments');
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <p><strong>${data.username}:</strong> ${commentContent}</p>
                `;
                commentsContainer.appendChild(commentElement);
                document.querySelector('#commentInput').value = '';
            } else {
                alert("Erreur : " + data.message);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la requête :", error);
        });
}
);

document.getElementById("delete-post").addEventListener("click", function () {
    deletePost(current_post_id);
});

function deletePost(postId) {
    fetch(`../requetes/requete-deletePost.php?id=${postId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                document.querySelector('.fenetreDroit').style.display = 'none';
                window.location.reload();
            } else {
                alert("Erreur : " + data.message);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la requête :", error);
        });
}

setInterval(() => {
    getAllPost();
    if (current_post_id != null) {
        getPost(current_object);
    }

}, 30000);
getAllPost();
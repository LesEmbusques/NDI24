const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const introScreen = document.getElementById("introScreen");
const gameOverScreen = document.getElementById("gameOver");
const resultText = document.getElementById("result");
const educationalMessage = document.getElementById("educationalMessage");
const levelMessage = document.getElementById("levelMessage"); // Message au-dessus du canvas

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

canvas.width = 600;
canvas.height = 400;

// Variables globales
let currentX = 50;
let currentY = canvas.height / 2;
let targetPosition;
let obstacles = [];
let timeLeft;
let energy = 100;
let score = 0;
let gameRunning = false;

import debrisSrc from "/assets/debris.png"
import finishedScr from "/assets/finish.png"
import fishSrc from "/assets/fish.png"
// Images pour les assets
const debrisImage = new Image();
debrisImage.src = debrisImage;
const reefImage = new Image();
reefImage.src = finishedScr;
const fishImage = new Image();
fishImage.src = fishSrc;

// Niveaux
const levels = [
    {
        id: 1,
        obstacles: [{ x: 200, y: 150, width: 50, height: 50, speed: 1 }],
        timeLimit: 30,
        targetPosition: { x: 550, y: 200 },
        message: "Niveau 1 : Les courants marins transportent des nutriments vitaux à travers l'océan.",
    },
    {
        id: 2,
        obstacles: [
            { x: 100, y: 50, width: 50, height: 50, speed: 1.25 },
            { x: 300, y: 150, width: 50, height: 50, speed: 1.5 },
        ],
        timeLimit: 25,
        targetPosition: { x: 550, y: 300 },
        message: "Niveau 2 : Les courants marins régulent les températures comme le cœur régule le flux sanguin.",
    },
    {
        id: 3,
        obstacles: [
            { x: 150, y: 50, width: 50, height: 50, speed: 1.5 },
            { x: 300, y: 100, width: 50, height: 50, speed: 1.75 },
            { x: 400, y: 200, width: 50, height: 50, speed: 2 },
        ],
        timeLimit: 20,
        targetPosition: { x: 550, y: 250 },
        message: "Niveau 3 : La pollution plastique perturbe les courants, comme le cholestérol bloque les artères.",
    },
    {
        id: 4,
        obstacles: [
            { x: 100, y: 50, width: 50, height: 50, speed: 2 },
            { x: 250, y: 100, width: 50, height: 50, speed: 2.25 },
            { x: 400, y: 150, width: 50, height: 50, speed: 2.5 },
        ],
        timeLimit: 15,
        targetPosition: { x: 550, y: 300 },
        message: "Niveau 4 : La montée des températures perturbe les écosystèmes marins comme la fièvre affecte le corps.",
    },
    {
        id: 5,
        obstacles: [
            { x: 150, y: 50, width: 50, height: 50, speed: 2.5 },
            { x: 300, y: 150, width: 50, height: 50, speed: 2.75 },
            { x: 400, y: 200, width: 50, height: 50, speed: 3 },
            { x: 450, y: 250, width: 50, height: 50, speed: 3.25 },
        ],
        timeLimit: 10,
        targetPosition: { x: 550, y: 200 },
        message: "Niveau 5 : Les récifs coralliens sont le cœur battant de la biodiversité marine.",
    },
];

let currentLevel = 0;

// Classe Obstacle
class Obstacle {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 1; // Direction initiale
    }

    draw() {
        ctx.drawImage(debrisImage, this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed * this.direction;
        if (this.y + this.height > canvas.height || this.y < 0) {
            this.direction *= -1; // Change de direction
        }
    }
}

// Charger un niveau
function loadLevel(levelIndex) {
    const level = levels[levelIndex];
    currentLevel = levelIndex;

    obstacles = level.obstacles.map(
        (obs) => new Obstacle(obs.x, obs.y, obs.width, obs.height, obs.speed)
    );

    targetPosition = level.targetPosition;
    timeLeft = level.timeLimit;

    // Réinitialiser le joueur
    currentX = 50;
    currentY = canvas.height / 2;
    energy = 100;

    // Mettre à jour le message de niveau
    levelMessage.textContent = level.message;
}

// Boucle principale
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le joueur
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(currentX, currentY, 15, 0, Math.PI * 2);
    // ctx.fill();

    ctx.drawImage(fishImage, currentX - 20, currentY - 35, 70, 70);

    // Dessiner la cible
    ctx.drawImage(reefImage, targetPosition.x - 20, targetPosition.y - 35, 70, 70);

    // Dessiner et mettre à jour les obstacles
    obstacles.forEach((obstacle) => {
        obstacle.draw();
        obstacle.update();

        if (checkCollision({ x: currentX - 15, y: currentY - 15, width: 30, height: 30 }, obstacle)) {
            gameOver(false);
        }
    });



    // Vérification de l'arrivée à la cible
    if (
        checkCollision(
            { x: currentX - 15, y: currentY - 15, width: 30, height: 30 },
            { x: targetPosition.x - 20, y: targetPosition.y - 20, width: 40, height: 40 }
        )
    ) {
        nextLevel();
    }

    requestAnimationFrame(gameLoop);
}

// Collision
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Passer au niveau suivant
function nextLevel() {
    if (currentLevel + 1 < levels.length) {
        loadLevel(currentLevel + 1);
    } else {
        gameOver(true); // Tous les niveaux terminés
    }
}

// Fin du jeu
function gameOver(won) {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
    canvas.classList.add("hidden");
    levelMessage.classList.add("hidden");
    resultText.textContent = won
        ? "Félicitations ! Vous avez terminé tous les niveaux !"
        : "Oups ! Vous avez échoué. Essayez à nouveau !";
    if (won) {
        resultText.textContent = "Félicitations ! Vous avez terminé tous les niveaux !";
        educationalMessage.textContent =
            "Le cœur humain pompe environ 7 500 litres de sang chaque jour pour nourrir nos cellules et maintenir l'équilibre du corps. De manière similaire, les courants océaniques déplacent chaque seconde des milliards de tonnes d'eau, répartissant chaleur et nutriments essentiels sur toute la planète, régulant ainsi le climat et soutenant la biodiversité marine. Ces deux systèmes, bien que différents, sont des moteurs de vie indispensables.";
    } else {
        resultText.textContent = "Oups ! Vous avez échoué. Réessayez ce niveau !";
        educationalMessage.textContent = levels[currentLevel].message; // Garder le message éducatif du niveau
    }
}

// Gestion des contrôles
document.addEventListener("keydown", (e) => {
    const step = 10;
    if (e.key === "ArrowUp" && currentY - step > 0) currentY -= step;
    if (e.key === "ArrowDown" && currentY + step < canvas.height) currentY += step;
    if (e.key === "ArrowLeft" && currentX - step > 0) currentX -= step;
    if (e.key === "ArrowRight" && currentX + step < canvas.width) currentX += step;
});

// Démarrer le jeu
startButton.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    canvas.classList.remove("hidden");
    gameOverScreen.classList.add("hidden");
    levelMessage.classList.remove("hidden"); // Afficher le message de niveau
    loadLevel(0);
    gameRunning = true;
    gameLoop();
});

restartButton.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    canvas.classList.remove("hidden");
    levelMessage.classList.remove("hidden"); // Afficher le message de niveau
    if (resultText.textContent.includes("Félicitations")) {
        loadLevel(0); // Repartir au premier niveau si le joueur a gagné
    } else {
        loadLevel(currentLevel); // Rejouer le même niveau si le joueur a perdu
    }

    gameRunning = true;
    gameLoop();
});
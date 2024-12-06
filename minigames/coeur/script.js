const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const introScreen = document.getElementById("introScreen");
const gameOverScreen = document.getElementById("gameOver");
const resultText = document.getElementById("result");
const educationalMessage = document.getElementById("educationalMessage");
const levelMessage = document.getElementById("levelMessage"); // Message au-dessus du canvas

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const continueButton = document.getElementById("continueButton");

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

// Images pour les assets
import debrisImageSrc from '/assets/debris.png';
import reefImageSrc from '/assets/reef.png';

const debrisImage = new Image();
debrisImage.src = debrisImageSrc;

const reefImage = new Image();
reefImage.src = reefImageSrc;

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
            { x: 100, y: 50, width: 50, height: 50, speed: 1.5 },
            { x: 300, y: 150, width: 50, height: 50, speed: 2 },
        ],
        timeLimit: 25,
        targetPosition: { x: 550, y: 300 },
        message: "Niveau 2 : Les courants marins régulent les températures comme le cœur régule le flux sanguin.",
    },
    {
        id: 3,
        obstacles: [
            { x: 150, y: 50, width: 50, height: 50, speed: 2 },
            { x: 300, y: 100, width: 50, height: 50, speed: 2.5 },
            { x: 400, y: 200, width: 50, height: 50, speed: 3 },
        ],
        timeLimit: 20,
        targetPosition: { x: 550, y: 250 },
        message: "Niveau 3 : La pollution plastique perturbe les courants, comme le cholestérol bloque les artères.",
    },
    {
        id: 4,
        obstacles: [
            { x: 100, y: 50, width: 50, height: 50, speed: 2.5 },
            { x: 250, y: 100, width: 50, height: 50, speed: 3 },
            { x: 400, y: 150, width: 50, height: 50, speed: 3.5 },
        ],
        timeLimit: 15,
        targetPosition: { x: 550, y: 300 },
        message: "Niveau 4 : La montée des températures perturbe les écosystèmes marins comme la fièvre affecte le corps.",
    },
    {
        id: 5,
        obstacles: [
            { x: 150, y: 50, width: 50, height: 50, speed: 3 },
            { x: 300, y: 150, width: 50, height: 50, speed: 3.5 },
            { x: 400, y: 200, width: 50, height: 50, speed: 4 },
            { x: 450, y: 250, width: 50, height: 50, speed: 4.5 },
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
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(currentX, currentY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Dessiner la cible
    ctx.drawImage(reefImage, targetPosition.x - 20, targetPosition.y - 20, 40, 40);

    // Dessiner et mettre à jour les obstacles
    obstacles.forEach((obstacle) => {
        obstacle.draw();
        obstacle.update();

        if (checkCollision({ x: currentX - 15, y: currentY - 15, width: 30, height: 30 }, obstacle)) {
            gameOver(false);
        }
    });

    // Dessiner la jauge d'énergie
    drawEnergyBar();

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

// Jauge d'énergie
function drawEnergyBar() {
    ctx.fillStyle = "red";
    ctx.fillRect(10, canvas.height - 20, 200, 10); // Bar vide
    ctx.fillStyle = "green";
    ctx.fillRect(10, canvas.height - 20, (energy / 100) * 200, 10); // Bar remplie
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
    resultText.textContent = won
        ? "Félicitations ! Vous avez terminé tous les niveaux !"
        : "Oups ! Vous avez échoué. Essayez à nouveau !";
    if (won) localStorage.setItem("lungs", "true");
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
    loadLevel(0);
    gameRunning = true;
    gameLoop();
});

restartButton.addEventListener("click", () => {
    startButton.click();
});

continueButton.addEventListener("click", () => {
    window.location.href = "../../index.html";
});
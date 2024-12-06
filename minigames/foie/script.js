// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 400;

const gameArea = document.getElementById('gameArea');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const introScreen = document.getElementById('introScreen');
const gameOverScreen = document.getElementById('gameOver');
const infoBar = document.getElementById('infoBar');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('currentLevel');
const resultWin = document.getElementById('resultWin');
const resultLose = document.getElementById('resultLose');
const continueButton = document.getElementById('continueButton');

let gameRunning = false;
let score = 0;
let lives = 1;
let currentLevel = 1;
let enemies = [];
let bubbles = [];
let coral = { x: canvas.width / 2 - 25, y: canvas.height - 50, width: 50, height: 50 };

import corailSrc from "/assets/corail.png";
import bubbleSrc from "/assets/bubble.png";
import dechetsSrc from "/assets/dechets.png";

const corailImage = new Image();
corailImage.src = corailSrc;
const bubbleImage = new Image();
bubbleImage.src = bubbleSrc;
const dechetsImage = new Image();
dechetsImage.src = dechetsSrc;


let waveY = 0; // The vertical position of the wave

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    coral.x = Math.min(Math.max(mouseX - coral.width / 2, 0), canvas.width - coral.width); // Keep coral within bounds
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

function startGame() {
    gameArea.classList.remove('hidden');
    introScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    infoBar.classList.remove('hidden');
    gameRunning = true;
    score = 0;
    lives = 3;
    currentLevel = 1;
    bubbles = [];
    waveY = 0;
    coral.x = canvas.width / 2 - 25;
    updateLevelDisplay();
    generateEnemies();
    startAutoFire();
    gameLoop();
}

function restartGame() {
    gameArea.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
    gameRunning = true;
    score = 0;
    lives = 3;
    currentLevel = 1;
    updateLevelDisplay();
    generateEnemies();
    gameLoop();
}

function startAutoFire() {
    // Automatically fire a bubble every 0.5 seconds
    setInterval(() => {
        if (gameRunning) {
            bubbles.push({ x: coral.x + coral.width / 2, y: coral.y, radius: 5 });
        }
    }, 500); // Interval of 500ms (0.5 seconds)
}

function generateEnemies() {
    enemies = [];
    waveY = 0;

    if (currentLevel === 1) {
        let rows = 5;
        let enemySpacing = 40;
        let startY = canvas.height * -0.6;

        for (let row = 0; row < rows; row++) {
            const enemiesInRow = rows - row;
            for (let col = 0; col < enemiesInRow; col++) {
                const enemyX = canvas.width / 2 - (enemiesInRow * 25) + col * 50;
                const enemyY = startY + row * enemySpacing;
                enemies.push({ x: enemyX, y: enemyY, width: 30, height: 30 });
            }
        }
    } else if (currentLevel === 2) {
        let rows = 2;
        let enemiesPerRow = 8;
        let enemySpacing = 50;
        let startY = canvas.height * -0.6;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < enemiesPerRow; col++) {
                const enemyX = canvas.width / 2 - (enemiesPerRow * 25) + col * 50;
                const enemyY = startY + row * enemySpacing;
                enemies.push({ x: enemyX, y: enemyY, width: 30, height: 30 });
            }
        }
    }
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCoral();
    drawEnemies();
    drawBubbles();

    checkCollisions();
    updateScoreAndLives();

    if (lives <= 0) {
        endGame();
    } else if (enemies.length === 0) {
        if (currentLevel === 2) {
            endGame();
            return;
        }
        nextLevel();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function drawCoral() {
    ctx.drawImage(corailImage, coral.x, coral.y, coral.width, coral.height);
}

function drawEnemies() {
    if (currentLevel === 1) waveY += 0.75;
    else if (currentLevel === 2) waveY += 0.6;

    enemies.forEach((enemy) => {
        const enemyGlobalY = enemy.y + waveY;

        // Dessiner l'image des ennemis (déchets)
        ctx.drawImage(dechetsImage, enemy.x, enemyGlobalY, enemy.width, enemy.height);
    });

    // Vérifier si un ennemi atteint le corail
    if (enemies.some((enemy) => enemy.y + waveY + enemy.height >= coral.y)) {
        lives = 0;
    }
}

function drawBubbles() {
    bubbles.forEach((bubble, index) => {
        bubble.y -= 5; // Déplacement de la bulle vers le haut
        ctx.drawImage(bubbleImage, bubble.x - bubble.radius, bubble.y - bubble.radius, bubble.radius * 2, bubble.radius * 2);

        // Supprimer la bulle si elle sort de l'écran
        if (bubble.y + bubble.radius < 0) {
            bubbles.splice(index, 1);
        }
    });
}

function checkCollisions() {
    enemies.forEach((enemy, eIndex) => {
        bubbles.forEach((bubble, bIndex) => {
            const enemyGlobalY = enemy.y + waveY;

            if (
                bubble.x > enemy.x &&
                bubble.x < enemy.x + enemy.width &&
                bubble.y > enemyGlobalY &&
                bubble.y < enemyGlobalY + enemy.height
            ) {
                enemies.splice(eIndex, 1);
                bubbles.splice(bIndex, 1);
                score++;
            }
        });
    });
}

function updateScoreAndLives() {
    scoreDisplay.textContent = score;
}

function nextLevel() {
    currentLevel++;
    generateEnemies();
    updateLevelDisplay();
    gameLoop();
}

function updateLevelDisplay() {
    levelDisplay.textContent = currentLevel;
}

function endGame() {
    if (lives <= 0) {
        resultLose.classList.remove('hidden');
        resultWin.classList.add('hidden');
    } else {
        resultWin.classList.remove('hidden');
        resultLose.classList.add('hidden');
        localStorage.setItem("kidney", true);
    }
    gameRunning = false;
    gameOverScreen.classList.remove('hidden');
    infoBar.classList.add('hidden');
    gameArea.classList.add('hidden');
}


continueButton.addEventListener("click", () => {
    window.location.href = "../../index.html";
});
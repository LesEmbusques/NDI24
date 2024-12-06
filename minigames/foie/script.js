// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 400;

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const introScreen = document.getElementById('introScreen');
const gameOverScreen = document.getElementById('gameOver');
const infoBar = document.getElementById('infoBar');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('currentLevel');

let gameRunning = false;
let score = 0;
let lives = 1;
let currentLevel = 1;
let enemies = [];
let bubbles = [];
let coral = { x: canvas.width / 2 - 25, y: canvas.height - 50, width: 50, height: 50 };
let waveY = 0; // The vertical position of the wave

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    coral.x = Math.min(Math.max(mouseX - coral.width / 2, 0), canvas.width - coral.width); // Keep coral within bounds
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

function startGame() {
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
        let rows = 6;
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
        let rows = 4;
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
        nextLevel();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function drawCoral() {
    ctx.fillStyle = 'pink';
    ctx.fillRect(coral.x, coral.y, coral.width, coral.height);
}

function drawEnemies() {
    ctx.fillStyle = 'red';
    if (currentLevel === 1) waveY += 0.75;
    else if (currentLevel === 2) waveY += 0.6;

    enemies.forEach((enemy) => {
        ctx.fillRect(enemy.x, enemy.y + waveY, enemy.width, enemy.height);
    });

    if (enemies.some((enemy) => enemy.y + waveY + enemy.height >= coral.y)) {
        lives = 0;
    }
}

function drawBubbles() {
    ctx.fillStyle = 'blue';
    bubbles.forEach((bubble, index) => {
        bubble.y -= 5;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();

        if (bubble.y < 0) bubbles.splice(index, 1);
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
    gameRunning = false;
    gameOverScreen.classList.remove('hidden');
    infoBar.classList.add('hidden');
}

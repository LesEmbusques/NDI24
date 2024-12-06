// Sélection des éléments HTML
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const introScreen = document.getElementById("introScreen");
const gameOverScreen = document.getElementById("gameOver");
const resultText = document.getElementById("result");
const educationalMessage = document.getElementById("educationalMessage");
const infoBar = document.getElementById("infoBar");

const nutrientsCapturedCounter = document.getElementById("nutrientsCaptured");
const nutrientsRequiredCounter = document.getElementById("nutrientsRequired");
const toxinsMissedCounter = document.getElementById("toxinsMissed");
const currentLevelCounter = document.getElementById("currentLevel");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const toxinImage = new Image();
toxinImage.src = "assets/toxin.png"; // Image pour toxines

const nutrientImage = new Image();
nutrientImage.src = "assets/nutrient.png"; // Image pour nutriments

canvas.width = 600;
canvas.height = 400;

// Variables globales
const PARTICLE_TYPES = { TOXIN: "toxin", NUTRIENT: "nutrient" };

let particles = [];
let missedToxins = 0;
let capturedNutrients = 0;
let capturedToxins = 0; // Nombre de toxines capturées
let toxinsRequired = 3; // Nombre initial de toxines requises
let level = 1; // Niveau initial
let gameRunning = false;

// Limites
const MAX_CAPTURED_NUTRIENTS = 5;
const TOXIN_GOALS = [3, 5, 8]; // Objectifs par niveau

// Position et dimensions du filtre
let filterX = canvas.width / 2 - 50;
const filterWidth = 100;
const filterHeight = 20;

// Fonction de génération de particules
function createParticle() {
    const type = Math.random() < 0.7 ? PARTICLE_TYPES.TOXIN : PARTICLE_TYPES.NUTRIENT;
    const x = Math.random() * canvas.width;
    const y = -20;
    const speed = Math.random() + 1 + level * 0.5;
    var try_swap = false;

    particles.push({ type, x, y, speed, try_swap });
}

// Met à jour les compteurs affichés
function updateCounters() {
    nutrientsCapturedCounter.textContent = capturedNutrients;
    nutrientsRequiredCounter.textContent = toxinsRequired;
    toxinsMissedCounter.textContent = capturedToxins;
    currentLevelCounter.textContent = level;
}

// Transition vers le niveau suivant
function nextLevel() {
    level++;
    if (level > 3) {
        endGame(true, "Félicitations ! Vous avez terminé les 3 niveaux !");
        return;
    }
    capturedToxins = 0;
    toxinsRequired = TOXIN_GOALS[level - 1];
    particles = [];
    gameRunning = false;

    setTimeout(() => {
        gameRunning = true;
        gameLoop();
    }, 2000);
    updateCounters();
}

// Dessine une particule
function drawParticle(particle) {
    if (particle.type === PARTICLE_TYPES.TOXIN) {
        ctx.drawImage(toxinImage, particle.x - 10, particle.y - 15, 30, 30);
    } else {
        ctx.drawImage(nutrientImage, particle.x - 10, particle.y - 15, 30, 30);
    }
}

// Boucle principale
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Générer de nouvelles particules
    if (Math.random() < 0.02 + level * 0.0005) createParticle();

    particles.forEach((particle, index) => {
        particle.y += particle.speed;

        // Transformation des toxines en nutriments au niveau 1
        if (level === 3 && particle.type === PARTICLE_TYPES.TOXIN && particle.y >= canvas.height * 0.55) {
            if (Math.random() < 0.5 && particle.try_swap === false) {
                particle.type = PARTICLE_TYPES.NUTRIENT; // Transformation
            }
            particle.try_swap = true;
        }

        // Collision avec le filtre
        if (
            particle.y > canvas.height - filterHeight &&
            particle.x > filterX &&
            particle.x < filterX + filterWidth
        ) {
            if (particle.type === PARTICLE_TYPES.TOXIN) {
                capturedToxins++;
            } else if (particle.type === PARTICLE_TYPES.NUTRIENT) {
                capturedNutrients++;
            }
            particles.splice(index, 1);
            updateCounters();
        } else if (particle.y > canvas.height) {
            particles.splice(index, 1);
        }

        drawParticle(particle);
    });


    if (capturedNutrients >= MAX_CAPTURED_NUTRIENTS) {
        endGame(false, "Trop de nutriments ont été capturés !");
    } else if (capturedToxins >= toxinsRequired) {
        nextLevel();
    }

    drawFilter();
    requestAnimationFrame(gameLoop);
}

// Dessine le filtre
function drawFilter() {
    ctx.fillStyle = "blue";
    ctx.fillRect(filterX, canvas.height - filterHeight, filterWidth, filterHeight);
}

// Termine le jeu
function endGame(won, message) {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
    canvas.classList.add("hidden");
    infoBar.classList.add("hidden");

    resultText.textContent = won ? "Félicitations !" : "Échec.";
    educationalMessage.textContent = message;
}

// Réinitialise le jeu
function resetGame() {
    particles = [];
    capturedNutrients = 0;
    capturedToxins = 0;
    level = 1;
    toxinsRequired = TOXIN_GOALS[0];
    updateCounters();
}

// Gestion des événements de souris
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    filterX = event.clientX - rect.left - filterWidth / 2;
    filterX = Math.max(0, Math.min(filterX, canvas.width - filterWidth));
});

// Gestion des clics
startButton.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    canvas.classList.remove("hidden");
    infoBar.classList.remove("hidden");
    resetGame();
    gameRunning = true;
    gameLoop();
});

restartButton.addEventListener("click", () => {
    startButton.click();
});
// Sélection des éléments
const playArea = document.getElementById("playArea");
const co2Count = document.getElementById("co2-count");
const o2Count = document.getElementById("o2-count");
const timer = document.getElementById("timer");
const gameOverScreen = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");
const finalCo2 = document.getElementById("final-co2");
const finalO2 = document.getElementById("final-o2");
const startButton = document.getElementById("startButton");
const infoBar = document.getElementById("infoBar");
const introScreen = document.getElementById("introScreen");

const bubbleImage = new Image();
bubbleImage.src = "assets/bubble.png";

const game_time = 20;
const bubble_interval = 400;
const bubble_lifetime = 1500;

let co2Absorbed = 0;
let o2Produced = 0;
let timeRemaining = game_time;
let gameInterval;

// Crée une bulle
function createBubble() {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.style.left = Math.random() * (playArea.offsetWidth - 40) + "px";
    bubble.style.top = Math.random() * (playArea.offsetHeight - 40) + "px";

    bubble.addEventListener("click", () => {
        co2Absorbed++;
        o2Produced += 2;
        co2Count.textContent = co2Absorbed;
        o2Count.textContent = o2Produced;
        playArea.removeChild(bubble);
    });

    playArea.appendChild(bubble);

    setTimeout(() => {
        if (bubble.parentElement) {
            playArea.removeChild(bubble);
        }
    }, bubble_lifetime);
}

// Affiche l'écran de fin
function showGameOver() {
    playArea.classList.add("hidden");
    infoBar.classList.add("hidden");
    clearInterval(gameInterval);
    finalCo2.textContent = co2Absorbed;
    finalO2.textContent = o2Produced;
    gameOverScreen.classList.remove("hidden");
    playArea.innerHTML = "";
}

// Redémarre le jeu
function restartGame() {
    gameOverScreen.classList.add("hidden");
    co2Absorbed = 0;
    o2Produced = 0;
    timeRemaining = game_time;
    co2Count.textContent = co2Absorbed;
    o2Count.textContent = o2Produced;
    timer.textContent = timeRemaining;
    startGame();
}

// Démarre le jeu
function startGame() {
    playArea.classList.remove("hidden");
    infoBar.classList.remove("hidden");
    introScreen.classList.add("hidden");
    playArea.innerHTML = "";
    gameInterval = setInterval(() => {
        createBubble();
        timeRemaining--;
        timer.textContent = timeRemaining;

        if (timeRemaining <= 0) {
            showGameOver();
        }
    }, bubble_interval);
}

// Gestion des événements
restartButton.addEventListener("click", restartGame);
startButton.addEventListener("click", startGame);



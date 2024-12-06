const playArea = document.getElementById('play-area');
const co2Count = document.getElementById('co2-count');
const o2Count = document.getElementById('o2-count');
const timer = document.getElementById('timer');
const endScreen = document.getElementById('end-screen');
const restartButton = document.getElementById('restart-button');
const continueButton = document.getElementById('continueButton');
const finalCo2 = document.getElementById('final-co2');
const finalO2 = document.getElementById('final-o2');

let co2Absorbed = 0;
let o2Produced = 0;
let timeRemaining = 30;
let gameInterval;

// Crée une bulle aléatoirement
function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    // Position aléatoire
    bubble.style.left = Math.random() * (playArea.offsetWidth - 40) + 'px';
    bubble.style.top = Math.random() * (playArea.offsetHeight - 40) + 'px';

    // Action au clic
    bubble.addEventListener('click', () => {
        co2Absorbed++;
        o2Produced += 2; // Simule l'O₂ produit
        co2Count.textContent = co2Absorbed;
        o2Count.textContent = o2Produced;
        playArea.removeChild(bubble);
    });

    playArea.appendChild(bubble);

    // Supprimer la bulle après un délai
    setTimeout(() => {
        if (bubble.parentElement) {
            playArea.removeChild(bubble);
        }
    }, 5000);
}

// Afficher l'écran de fin
function showEndScreen() {
    clearInterval(gameInterval);
    finalCo2.textContent = co2Absorbed;
    finalO2.textContent = o2Produced;
    endScreen.classList.remove('hidden');
    playArea.innerHTML = ''; // Vider la zone de jeu
    localStorage.setItem("liver", "true");
}

// Redémarrer le jeu
function restartGame() {
    endScreen.classList.add('hidden');
    co2Absorbed = 0;
    o2Produced = 0;
    timeRemaining = 30;
    co2Count.textContent = co2Absorbed;
    o2Count.textContent = o2Produced;
    timer.textContent = timeRemaining;
    startGame();
}

// Lance le jeu
function startGame() {
    playArea.innerHTML = ''; // Réinitialiser la zone de jeu
    gameInterval = setInterval(() => {
        createBubble();
        timeRemaining--;
        timer.textContent = timeRemaining;

        if (timeRemaining <= 0) {
            showEndScreen();
        }
    }, 1000);
}

// Écouter le bouton "Rejouer"
restartButton.addEventListener('click', restartGame);

// Démarrage initial
startGame();


continueButton.addEventListener("click", () => {
    window.location.href = "../../index.html";
});
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const introScreen = document.getElementById("introScreen");
const gameOverScreen = document.getElementById("gameOver");
const resultText = document.getElementById("result");
const educationalMessage = document.getElementById("educationalMessage");
const continueButton = document.getElementById('continueButton');
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

canvas.width = 600;
canvas.height = 400;

// Variables globales
let nutrients = [];
let pollutants = [];
let score = 0;
let lives = 3;
let gameRunning = false;
let level = 1;
let speedMultiplier = 0.5; // Vitesse initiale réduite
let spawnInterval = 2000; // Intervalle initial pour spawn Nutriments
let spawnPollutantInterval = 2500;
let pollutantsCollected = 0; // Nombre de polluants collectés pour changer de niveau

// Images pour les assets
import nutrientImageSrc from "/assets/nutrient.png";
import pollutantImageSrc from "/assets/pollutant.png";

const nutrientImage = new Image();
nutrientImage.src = nutrientImageSrc;

const pollutantImage = new Image();
pollutantImage.src = pollutantImageSrc;

const waterLine = canvas.height / 2; // Ligne représentant la surface de l'eau

// Classe Nutriment
class Nutrient {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
    }

    draw() {
        ctx.drawImage(nutrientImage, this.x, this.y, this.width, this.height);
    }

    move() {
        this.y += 1.5 * speedMultiplier; // Vitesse lente au départ
    }
}

// Classe Polluant
class Pollutant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
    }

    draw() {
        ctx.drawImage(pollutantImage, this.x, this.y, this.width, this.height);
    }

    move() {
        this.y += 2 * speedMultiplier; // Vitesse lente au départ
    }
}

// Créer un nutriment
function spawnNutrient() {
    const x = Math.random() * (canvas.width - 30);
    nutrients.push(new Nutrient(x, 0));
}

// Créer un polluant
function spawnPollutant() {
    const x = Math.random() * (canvas.width - 30);
    pollutants.push(new Pollutant(x, 0));
}

// Gérer les niveaux et augmenter la difficulté
function increaseDifficulty() {
    if (pollutantsCollected % 3 === 0 && pollutantsCollected > 0) { // Tous les 3 polluants capturés
        level++;
        if (level > 5) {
            endGame(true); // Terminer le jeu après le niveau 5
            return;
        }

        speedMultiplier += 0.2; // Augmente doucement la vitesse
        spawnInterval = Math.max(1500, spawnInterval - 200); // Diminue légèrement le délai de spawn
        spawnPollutantInterval = Math.max(1800, spawnPollutantInterval - 200);

        // Afficher le message de niveau
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Niveau ${level} atteint !`, canvas.width / 2 - 60, canvas.height / 2);

        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le message
        }, 2000);
    }
}

// Boucle principale
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner la ligne d'eau
    ctx.fillStyle = "blue";
    ctx.fillRect(0, waterLine, canvas.width, 0);

    // Dessiner et déplacer les nutriments
    nutrients.forEach((nutrient, index) => {
        nutrient.move();
        nutrient.draw();

        if (nutrient.y > canvas.height) {
            nutrients.splice(index, 1);
        }
    });

    // Dessiner et déplacer les polluants
    pollutants.forEach((pollutant, index) => {
        pollutant.move();
        pollutant.draw();

        if (pollutant.y > waterLine) {
            pollutants.splice(index, 1);
            lives -= 1; // Le polluant a atteint l'eau
        }
    });

    // Afficher le score, les vies et le niveau
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score : ${score}`, 10, 30);
    ctx.fillText(`Vies : ${lives}`, 10, 60);
    ctx.fillText(`Niveau : ${level}`, canvas.width - 120, 30);

    if (lives <= 0) {
        gameOver(false);
    }

    requestAnimationFrame(gameLoop);
}

// Fin du jeu
function gameOver(won) {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
    canvas.classList.add("hidden");
    resultText.textContent = won
        ? "Félicitations ! Vous avez sauvé l'écosystème !"
        : "Oups ! L'écosystème est perturbé. Essayez à nouveau !";
    educationalMessage.textContent = ""; // Réinitialiser le message pédagogique
}

// Terminer le jeu avec un message éducatif
function endGame(won) {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
    canvas.classList.add("hidden");
    resultText.textContent = won
        ? "Bravo ! Vous avez terminé le jeu !"
        : "Oups ! Vous n'avez pas réussi cette fois.";

    if (won) localStorage.setItem("brain", "true");

    // Message éducatif sur la corrélation estomac/intestin et océan
    educationalMessage.textContent =
        "L'océan et les systèmes digestifs se ressemblent : l'océan 'digère' les nutriments et les redistribue pour soutenir la vie marine, tout comme l'estomac et l'intestin. Par exemple, saviez-vous que les phytoplanctons produisent 50% de l'oxygène que nous respirons et transforment les nutriments en énergie pour la chaîne alimentaire marine ?";
}

// Gestion des clics pour collecter les objets
canvas.addEventListener("click", (e) => {
    const clickX = e.offsetX;
    const clickY = e.offsetY;

    pollutants.forEach((pollutant, index) => {
        if (
            clickX >= pollutant.x &&
            clickX <= pollutant.x + pollutant.width &&
            clickY >= pollutant.y &&
            clickY <= pollutant.y + pollutant.height
        ) {
            score += 10; // Capturer un polluant augmente le score
            pollutants.splice(index, 1);
            pollutantsCollected++; // Incrémenter les polluants collectés
            increaseDifficulty();
        }
    });

    nutrients.forEach((nutrient, index) => {
        if (
            clickX >= nutrient.x &&
            clickX <= nutrient.x + nutrient.width &&
            clickY >= nutrient.y &&
            clickY <= nutrient.y + nutrient.height
        ) {
            score -= 5; // Cliquer sur un nutriment fait perdre des points
            lives -= 1; // Cliquer sur un nutriment fait perdre une vie
            nutrients.splice(index, 1);
        }
    });
});

// Démarrer le jeu
startButton.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    canvas.classList.remove("hidden");
    gameOverScreen.classList.add("hidden");
    score = 0;
    lives = 3;
    nutrients = [];
    pollutants = [];
    level = 1;
    speedMultiplier = 0.5; // Réinitialiser la vitesse initiale
    pollutantsCollected = 0; // Réinitialiser les polluants collectés
    gameRunning = true;
    setInterval(spawnNutrient, spawnInterval);
    setInterval(spawnPollutant, spawnPollutantInterval);
    gameLoop();
});

restartButton.addEventListener("click", () => {
    startButton.click();
});


continueButton.addEventListener("click", () => {
    window.location.href = "../../index.html";
});
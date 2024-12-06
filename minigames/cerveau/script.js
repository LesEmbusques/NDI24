const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const introScreen = document.getElementById("introScreen");
const winScreen = document.getElementById("winScreen");

const questions = [
    {
        organ: "Poumon",
        question: "Les océans produisent une grande partie de l’oxygène que nous respirons. Quelle est cette proportion ?\n1. 20%\n2. 50%\n3. 70%",
        correctAnswer: "3",
        explanation: "Les océans produisent environ 70% de l’oxygène de la planète, grâce aux phytoplanctons et aux algues microscopiques.",
    },
    {
        organ: "Cœur",
        question: "Le rôle des courants marins est comparable à celui du cœur. Que transportent-ils principalement à travers les océans ?\n1. Des nutriments et de la chaleur\n2. De l’oxygène et du sang\n3. Des poissons et des mammifères",
        correctAnswer: "1",
        explanation: "Les courants marins transportent des nutriments et redistribuent la chaleur, régulant ainsi le climat terrestre.",
    },
    {
        organ: "Rein",
        question: "Tout comme les reins filtrent le sang, l’océan joue un rôle dans la régulation chimique de la planète. Que purifie-t-il principalement ?\n1. Le sel de l’eau douce\n2. Le dioxyde de carbone de l’atmosphère\n3. Les déchets plastiques",
        correctAnswer: "2",
        explanation: "Les océans absorbent près de 25% du dioxyde de carbone produit par les activités humaines, contribuant à réguler le climat.",
    },
    {
        organ: "Foie",
        question: "Le foie stocke et transforme des substances pour le corps humain. Quel rôle équivalent joue l’océan dans l’écosystème ?\n1. Il stocke du dioxygène pour les animaux marins.\n2. Il stocke et recycle le carbone.\n3. Il absorbe et élimine les déchets plastiques.",
        correctAnswer: "2",
        explanation: "L’océan est un immense réservoir de carbone. Il aide à stocker et recycler le carbone à travers les écosystèmes marins.",
    },
    {
        organ: "Intestin/Estomac",
        question: "Comme les intestins absorbent les nutriments pour le corps, l’océan fournit une grande partie de la nourriture pour les organismes marins. Quel pourcentage des espèces marines dépend du plancton ?\n1. 50%\n2. 70%\n3. 90%",
        correctAnswer: "3",
        explanation: "Près de 90% des organismes marins dépendent directement ou indirectement du plancton, une source cruciale de nutriments.",
    },
    {
        organ: "Cerveau",
        question: "Le cerveau est le centre de commande du corps humain. Quel est un rôle clé similaire joué par l’océan pour la planète ?\n1. Réguler les cycles terrestres et climatiques\n2. Produire de l’électricité marine\n3. Contrôler la reproduction des espèces marines",
        correctAnswer: "1",
        explanation: "Les océans contrôlent de nombreux cycles terrestres, influencent les climats, et équilibrent les écosystèmes en régulant les températures.",
    },
];


const tileSize = 40; // Taille de chaque case
const player = { x: 1, y: 1 }; // Position du joueur
let exit = { x: 13, y: 13 }; // Position de la sortie
let currentLevel = 0;
let resourcesCollected = 0;
let totalResources = 0;
let gameRunning = false;
let timeLeft = 60; // Temps par niveau (en secondes)
let timerInterval;

// Images
const wallImage = new Image();
wallImage.src = "./assets/wall.png";
const playerImage = new Image();
playerImage.src = "./assets/player.png";
const resourceImage = new Image();
resourceImage.src = "./assets/golden_bubble.png";
const exitImage = new Image();
exitImage.src = "./assets/exit_portal.png";
const enemyImage = new Image();
enemyImage.src = "./assets/enemy.png";
const doorImage = new Image();
doorImage.src = "./assets/door.png";


// Niveaux
const levels = [
    {
        maze: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        exit: { x: 4, y: 10 },
        door: { x: 4, y: 9 },
        enemies: [
            { x: 7, y: 1, direction: "horizontal", speed: 0.05 },
            { x: 13, y: 5, direction: "vertical", speed: 0.05 },
        ],
    },
    {
        maze: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 2, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        exit: { x: 4, y: 10 },
        door: { x: 4, y: 9 },
        enemies: [
            { x: 13, y: 5, direction: "vertical", speed: 0.02 },
            { x: 9, y: 3, direction: "vertical", speed: 0.013 },
            { x: 11, y:8, direction: "vertical", speed: 0.013},
        ],
    },
];

canvas.width = levels[currentLevel].maze[0].length * tileSize;
canvas.height = levels[currentLevel].maze.length * tileSize;

// Dessiner le labyrinthe
function drawMaze() {
    const maze = levels[currentLevel].maze;
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = "darkblue";
                ctx.drawImage(wallImage, col * tileSize, row * tileSize, tileSize, tileSize);
            } else if (maze[row][col] === 2) {
                ctx.drawImage(resourceImage, col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }
}

function drawPlayer() {
    console.log("Dessiner le joueur à :", player.x, player.y);
    ctx.drawImage(playerImage, player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

function drawExit() {
    ctx.drawImage(exitImage, exit.x * tileSize, exit.y * tileSize, tileSize, tileSize);
}

function drawEnemies() {
    const enemies = levels[currentLevel].enemies;
    enemies.forEach((enemy) => {
        ctx.drawImage(enemyImage, enemy.x * tileSize, enemy.y * tileSize, tileSize, tileSize);
    });
}

function drawDoor() {
    const level = levels[currentLevel];
    if (level.door) {
        const door = level.door;
        ctx.drawImage(doorImage, door.x * tileSize, door.y * tileSize, tileSize, tileSize);
    }
}

function movePlayer(dx, dy) {
    const maze = levels[currentLevel].maze;
    const level = levels[currentLevel];
    const newX = player.x + dx;
    const newY = player.y + dy;

    // Vérifier si la position est une porte
    if (level.door && newX === level.door.x && newY === level.door.y) {
        if (resourcesCollected < totalResources) {
            alert("La porte est fermée ! Ramassez toutes les bulles !");
            return;
        } else {
            level.door = null;
        }
    }

    if (
        newX >= 0 &&
        newX < maze[0].length &&
        newY >= 0 &&
        newY < maze.length &&
        maze[newY][newX] !== 1
    ) {
        player.x = newX;
        player.y = newY;

        if (maze[newY][newX] === 2) {
            solvePuzzle(() => {
                maze[newY][newX] = 0; // Collecter la ressource
                resourcesCollected++;
            });
        }

        if (player.x === exit.x && player.y === exit.y) {
            if (resourcesCollected === totalResources) {
                nextLevel();
            }
        }
    }
}

let questionIndex = 0; // Initialiser un index global pour suivre les questions

function solvePuzzle(callback) {
    const questionData = questions[questionIndex % questions.length]; // Cycle des questions
    const answer = prompt(questionData.question);

    if (answer === questionData.correctAnswer) {
        alert(`Correct ! ${questionData.explanation}`);
        callback();
        questionIndex++; // Passer à la question suivante
    } else {
        alert("Faux ! Réessayez.");
    }
}

function updateEnemies() {
    const enemies = levels[currentLevel].enemies;
    const maze = levels[currentLevel].maze;

    enemies.forEach((enemy) => {
        if (enemy.direction === "horizontal") {
            // Déplacement horizontal
            const newX = enemy.x + enemy.speed;
            const nextCell = Math.floor(newX);
            if (nextCell < maze[0].length && maze[enemy.y][nextCell] !== 1) {
                enemy.x = newX;
            } else {
                enemy.speed = -enemy.speed; // Change de direction
            }
        } else if (enemy.direction === "vertical") {
            // Déplacement vertical
            const newY = enemy.y + enemy.speed;
            const nextCell = Math.floor(newY);
            if (nextCell < maze.length && maze[nextCell][enemy.x] !== 1) {
                enemy.y = newY;
            } else {
                enemy.speed = -enemy.speed; // Change de direction
            }
        }
    });
}

function checkEnemyCollision() {
    const enemies = levels[currentLevel].enemies;
    enemies.forEach((enemy) => {
        const enemyX = Math.floor(enemy.x);
        const enemyY = Math.floor(enemy.y);

        if (enemyX === player.x && enemyY === player.y) {
            alert("Vous avez été capturé par un ennemi !");
            restartLevel();
        }
    });
}

function restartLevel() {
    clearInterval(timerInterval);
    player.x = 1;
    player.y = 1;
    resourcesCollected = 0;
    const level = levels[currentLevel];
    console.log("Vitesse ennemi après mort :", level.enemies);


    //startLevel();


    exit = level.exit;
    resourcesCollected = 0;
    totalResources = level.maze.flat().filter((cell) => cell === 2).length;

    console.log("Vitesse ennemi :", level.enemies[0].speed);

    startTimer();
}

function startTimer() {
    timeLeft = 60;
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Temps écoulé ! Vous avez perdu !");
            restartLevel();
        }
    }, 1000);
}

function drawTimer() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Temps restant : ${timeLeft}s`, 10, 30);
}

function nextLevel() {
    clearInterval(timerInterval);
    if (currentLevel + 1 < levels.length) {
        currentLevel++;
        startLevel();
    } else {
        gameWon();
    }
}

function startLevel() {
    const level = levels[currentLevel];
    player.x = 1;
    player.y = 1;
    exit = level.exit;
    resourcesCollected = 0;
    totalResources = level.maze.flat().filter((cell) => cell === 2).length;

    console.log("Vitesse ennemi :", level.enemies[0].speed);

    startTimer();
    gameRunning = true;
    gameLoop();
}

function gameWon() {
    clearInterval(timerInterval);
    gameRunning = false;
    canvas.classList.add("hidden");
    winScreen.classList.remove("hidden");
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawExit();
    drawDoor(); // Dessine la porte si elle est active
    drawPlayer();
    drawEnemies();
    drawTimer();

    if (resourcesCollected === totalResources && levels[currentLevel].door) {
        levels[currentLevel].door = null; // Ouvrir la porte
        alert("La porte est maintenant ouverte !");
    }

    updateEnemies();
    checkEnemyCollision();

    requestAnimationFrame(gameLoop);
}


document.addEventListener("keydown", (e) => {
    if (!gameRunning) return;

    switch (e.key) {
        case "ArrowUp":
            movePlayer(0, -1);
            break;
        case "ArrowDown":
            movePlayer(0, 1);
            break;
        case "ArrowLeft":
            movePlayer(-1, 0);
            break;
        case "ArrowRight":
            movePlayer(1, 0);
            break;
    }
});

startButton.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    canvas.classList.remove("hidden");
    winScreen.classList.add("hidden");
    currentLevel = 0;
    startLevel();
    gameRunning = true;
});

restartButton.addEventListener("click", () => {
    startButton.click();
});

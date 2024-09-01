
// Initialize canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let score = 0;
let gameOver = false;

// Dev character
const dev = {
    x: 50,
    y: canvas.height / 2 - 50,
    width: 50,
    height: 50,
    speed: 5,
    jumping: false,
    jumpHeight: 10,
    attacking: false
};

// Rorbots
const rorbots = [];
const robotSpawnRate = 100; // Every 100 frames

// Tokens
const tokens = [];
const tokenSpawnRate = 200; // Every 200 frames

// Images
const devImage = new Image();
devImage.src = 'dev.png'; // Replace with your dev image

const robotImage = new Image();
robotImage.src = 'robot.png'; // Replace with your robot image

const tokenImage = new Image();
tokenImage.src = 'token.png'; // Replace with your token image

// Event listeners for actions (jumping and attacking)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !dev.jumping) {
        dev.jumping = true;
    }
    if (event.code === 'KeyA') {
        dev.attacking = true;
        setTimeout(() => {
            dev.attacking = false;
        }, 300); // Attack lasts for 300ms
    }
});

// --- Movement controls ---
const keys = {}; // Object to store key states

document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move Dev
    moveDev();

    // Spawn rorbots
    spawnRorbots();

    // Move and draw rorbots
    manageRorbots();

    // Spawn tokens
    spawnTokens();

    // Draw and manage tokens
    manageTokens();

    // Check for collisions
    checkCollisions();

    // Draw score
    drawScore();

    // Check for game over
    if (gameOver) {
        drawGameOver();
    } else {
        // Request next frame
        requestAnimationFrame(gameLoop);
    }
}

// Function to move the Dev character
function moveDev() {
    if (dev.jumping) {
        dev.y -= dev.jumpHeight;
        dev.jumpHeight -= 0.5;
        if (dev.y >= canvas.height / 2 - 50) {
            dev.y = canvas.height / 2 - 50;
            dev.jumping = false;
            dev.jumpHeight = 10;
        }
    }

    // --- Horizontal movement ---
    if (keys['ArrowLeft'] && dev.x > 0) {
        dev.x -= dev.speed;
    }
    if (keys['ArrowRight'] && dev.x < canvas.width - dev.width) {
        dev.x += dev.speed;
    }

    // Draw the Dev character
    ctx.drawImage(devImage, dev.x, dev.y, dev.width, dev.height);
}

// Function to spawn rorbots
function spawnRorbots() {
    if (Math.random() < 1 / robotSpawnRate) {
        rorbots.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 50),
            width: 40,
            height: 40,
            speed: 2 + Math.random() * 3
        });
    }
}

// Function to manage rorbots (move, draw, and remove)
function manageRorbots() {
    for (let i = 0; i < rorbots.length; i++) {
        const robot = rorbots[i];
        robot.x -= robot.speed;

        // Remove robot if it goes off screen
        if (robot.x + robot.width < 0) {
            rorbots.splice(i, 1);
            i--;
        } else {
            // Draw the robot
            ctx.drawImage(robotImage, robot.x, robot.y, robot.width, robot.height);
        }
    }
}

// Function to spawn tokens
function spawnTokens() {
    if (Math.random() < 1 / tokenSpawnRate) {
        tokens.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 30),
            width: 30,
            height: 30
        });
    }
}

// Function to manage tokens (move, draw, and remove)
function manageTokens() {
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        token.x -= 3;

        // Remove token if it goes off screen
        if (token.x + token.width < 0) {
            tokens.splice(i, 1);
            i--;
        } else {
            // Draw the token
            ctx.drawImage(tokenImage, token.x, token.y, token.width, token.height);
        }
    }
}

// Function to check for collisions
function checkCollisions() {
    // Check for collisions with rorbots
    for (let i = 0; i < rorbots.length; i++) {
        if (
            dev.x < rorbots[i].x + rorbots[i].width &&
            dev.x + dev.width > rorbots[i].x &&
            dev.y < rorbots[i].y + rorbots[i].height &&
            dev.y + dev.height > rorbots[i].y
        ) {
            // Collision detected
            if (dev.attacking) {
                // Dev is attacking, destroy the robot
                rorbots.splice(i, 1);
                i--;
                score += 10; // Increase score for defeating a robot
            } else {
                // Game Over
                gameOver = true;
            }
        }
    }

    // Check for collisions with tokens
    for (let i = 0; i < tokens.length; i++) {
        if (
            dev.x < tokens[i].x + tokens[i].width &&
            dev.x + dev.width > tokens[i].x &&
            dev.y < tokens[i].y + tokens[i].height &&
            dev.y + dev.height > tokens[i].y
        ) {
            // Collision detected, collect the token
            tokens.splice(i, 1);
            i--;
            score += 5; // Increase score for collecting a token
        }
    }
}

// Function to draw the score
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Function to draw the game over screen
function drawGameOver() {
    ctx.font = '50px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over!', canvas.width / 2 - 150, canvas.height / 2);
}

// Start the game loop
gameLoop();


const resetBtn = document.querySelector("#resetBtn");
const myCanvas = document.querySelector("#myCanvas");
const scoreField = document.querySelector("#score");
const movesField = document.querySelector("#moves");
const mainHeading = document.querySelector("#mainHeading");
const muteBtn = document.querySelector("#muteBtn");
const menuBtn = document.querySelector("#menuBtn");
const menuItems = document.querySelector("#menuItems");
const gameConfigForm = document.querySelector("#gameConfigForm");
const applyBtn = document.querySelector("#applyBtn");
const restoreBtn = document.querySelector("#restoreBtn");
const randomizeBtn = document.querySelector("#randomizeBtn");

const ballRadiusInput = document.querySelector("#ballRadiusInput");
const gravityInput = document.querySelector("#gravityInput");
const frictionInput = document.querySelector("#frictionInput");
const speedFactorInput = document.querySelector("#speedFactorInput");
const totalFoodInput = document.querySelector("#totalFoodInput");
const boundRadiusInput = document.querySelector("#boundRadiusInput");
const isBackgroundImage = document.querySelector("#isBackgroundImage");

const canvasWidth = myCanvas.width;
const canvasHeight = myCanvas.height;

// Inital co-ords for boundCircle
var boundX = canvasWidth / 2;
var boundY = canvasHeight / 2;
const foodRadius = 15;
const foodSpawnPadding = 50;

// configurables
const defaultBallRadius = 50;
const defaultGravity = 0.5;
const defaultFriction = 0.65;
const defaultSpeedFactor = 0.5;    // determines launch speed
const defaultTotalFood = 4;
const defaultBoundRadius = 120;    // determines how far you can pull the sling

const gameConfig = {
    _ballRadius: defaultBallRadius,
    _gravity: defaultGravity,
    _friction: defaultFriction,
    _speedFactor: defaultSpeedFactor,
    _totalFood: defaultTotalFood,
    _boundRadius: defaultBoundRadius,
    _backgroundImage: false,
    get ballRadius() {
        return this._ballRadius;
    },
    get gravity() {
        return this._gravity;
    },
    get friction() {
        return this._friction;
    },
    get speedFactor() {
        return this._speedFactor;
    },
    get totalFood() {
        return this._totalFood;
    },
    get boundRadius() {
        return this._boundRadius;
    },
    get backgroundImage() {
        return this._backgroundImage;
    },

    set ballRadius(value) {
        value = parseInt(value, 10);
        if (typeof value === 'number' && !isNaN(value)) {
            value = Math.max(10, Math.min(100, value));
        }
        else {
            value = defaultBallRadius;
        }
        this._ballRadius = value;
    },
    set gravity(value) {
        value = parseFloat(value);
        value = value.toFixed(2);
        value = parseFloat(value);
        if (typeof value === 'number' && !isNaN(value)) {
            value = Math.max(0, Math.min(10, value));
        }
        else {
            value = defaultGravity;
        }
        this._gravity = value;
    },
    set friction(value) {
        value = parseFloat(value);
        value = value.toFixed(2);
        value = parseFloat(value);
        if (typeof value === 'number' && !isNaN(value)) {
            value = Math.max(0, Math.min(1, value));
        }
        else {
            value = defaultFriction;
        }
        this._friction = value;
    },
    set speedFactor(value) {
        value = parseFloat(value);
        value = value.toFixed(2);
        value = parseFloat(value);
        if (typeof value === 'number' && !isNaN(value)) {
            value = Math.max(0.1, Math.min(2, value));
        }
        else {
            value = defaultSpeedFactor;
        }
        this._speedFactor = value;
    },
    set totalFood(value) {
        value = parseInt(value, 10);
        if (typeof value === 'number' && !isNaN(value)) {
            value = Math.max(1, Math.min(20, value));
        }
        else {
            value = defaultTotalFood;
        }
        this._totalFood = value;
    },
    set boundRadius(value) {
        value = parseInt(value, 10);
        if (typeof value === 'number' && !isNaN(value)) {
            value = Math.max(120, Math.min(200, value));
        }
        else {
            value = defaultBoundRadius;
        }
        this._boundRadius = value;
    },
    set backgroundImage(value) {
        this._backgroundImage = value;
    },
};

function setValuesInputFields() {
    gameConfig.ballRadius = ballRadiusInput.value;
    gameConfig.gravity = gravityInput.value;
    gameConfig.friction = frictionInput.value;
    gameConfig.speedFactor = speedFactorInput.value;
    gameConfig.totalFood = totalFoodInput.value;
    gameConfig.boundRadius = boundRadiusInput.value;
    gameConfig.backgroundImage = isBackgroundImage.checked;

    ballRadiusInput.value = gameConfig.ballRadius;
    gravityInput.value = gameConfig.gravity;
    frictionInput.value = gameConfig.friction;
    speedFactorInput.value = gameConfig.speedFactor;
    totalFoodInput.value = gameConfig.totalFood;
    boundRadiusInput.value = gameConfig.boundRadius;
    isBackgroundImage.checked = gameConfig.backgroundImage;
}

setValuesInputFields();

var running = false;
const ctx = myCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

var SCORE = 0;
var MOVES = 0;

function setScore() {
    scoreField.innerHTML = `<strong>SCORE: ${SCORE}</strong>`;
}

function setMoves() {
    movesField.innerHTML = `<strong>MOVES: ${MOVES}</strong>`;
}

const hitSound = new Audio("assets/audio/hit.mp3");
const foodBiteSound = new Audio("assets/audio/eat.mp3");
loopify("assets/audio/slingarom_theme.mp3", function (err, loop) {

    // If something went wrong, `err` is supplied
    if (err) {
        return console.err(err);
    }

    // Play it whenever you want
    // loop.play();

    // Stop it later if you feel like it
    muteBtn.addEventListener("click", () => {
        if (muteBtn.innerHTML == `<i class="fa-solid fa-volume-high" aria-hidden="true"></i>`) {
            muteBtn.innerHTML = `<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>`;
            loop.stop();
        }
        else {
            muteBtn.innerHTML = `<i class="fa-solid fa-volume-high" aria-hidden="true"></i>`;
            loop.play();
        }
    });
});

menuBtn.addEventListener("click", handleMenuClick);
function handleMenuClick() {
    if (menuItems.style.opacity == "0") {
        // menuItems.style.display = "block";
        menuItems.style.left = "0vh";
        menuItems.style.opacity = "1";
    }
    else {
        // menuItems.style.display = "none";
        menuItems.style.left = "-" + menuItems.style.width;
        menuItems.style.opacity = "0";
    }
}

addEventListener("keyup", handleEscUp);
function handleEscUp() {
    // menuItems.style.display = "none";
    menuItems.style.left = "-" + menuItems.style.width;
    menuItems.style.opacity = "0";
}


gameConfigForm.addEventListener("submit", (e) => {
    e.preventDefault();
    setValuesInputFields();
    foodPositions = [];
    initFood(gameConfig.totalFood);

    resetBtn.click();
});
restoreBtn.addEventListener("click", () => {
    ballRadiusInput.value = "";
    gravityInput.value = "";
    frictionInput.value = "";
    speedFactorInput.value = "";
    totalFoodInput.value = "";
    boundRadiusInput.value = "";
    applyBtn.click();
});
randomizeBtn.addEventListener("click", () => {
    ballRadiusInput.value = Math.random() * 100;
    gravityInput.value = Math.random() * 10;
    frictionInput.value = Math.random();
    speedFactorInput.value = Math.random() * 2;
    totalFoodInput.value = Math.random() * 20;
    boundRadiusInput.value = Math.random() * 200;
    applyBtn.click();
})
function playHitAudio() {

    // console.log(hitSound.currentTime);
    // if(hitSound.currentTime!=0 && hitSound.currentTime <= 0.15)
    //     return;
    hitSound.pause();
    hitSound.currentTime = 0;
    hitSound.play();

}
function playFoodAudio() {
    foodBiteSound.pause();
    foodBiteSound.currentTime = 0;
    foodBiteSound.play();
}



var foodPositions = [];

function initFood(value) {
    for (var i = 0; i < value; i++)
        foodPositions.push({});
}
initFood(gameConfig.totalFood);

function roundToNearest(what, number) {
    return Math.round(number / what) * what;
}

function createFood() {
    const minDistance = 100;
    const centerThreshold = ball.radius;
    for (var i = 0; i < gameConfig.totalFood; i++) {
        let x, y;
        // foodPositions[i] = {
        //     x: roundToNearest(100, Math.floor(Math.random() * (canvasWidth - 2 * foodSpawnPadding)) + foodSpawnPadding),
        //     y: roundToNearest(100, Math.floor(Math.random() * (canvasHeight - 2 * foodSpawnPadding)) + foodSpawnPadding),
        //     ate: false
        // };
        do {
            // Generate random coordinates
            x = Math.floor(Math.random() * (canvasWidth - 2 * foodSpawnPadding)) + foodSpawnPadding;
            y = Math.floor(Math.random() * (canvasHeight - 2 * foodSpawnPadding)) + foodSpawnPadding;
        } while (
            // Check distance from other food items
            foodPositions.some(food => Math.sqrt((x - food.x) ** 2 + (y - food.y) ** 2) < Math.min(100, minDistance))
            ||
            Math.sqrt((x - canvasWidth / 2) ** 2 + (y - canvasHeight / 2) ** 2) < centerThreshold
        );
        foodPositions[i] = {
            x,
            y,
            ate: false
        };
    }
}

function drawStar(cX, cY, R, N) {
    // ctx.beginPath();
    // ctx.arc(starX, starY, 10, 0, 2*Math.PI);
    // ctx.fillStyle = "#FFFFFF";
    // ctx.fill();
    // ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(cX + R, cY);
    for (var i = 1; i <= N * 2; i++) {
        if (i % 2 == 0) {
            var theta = i * (Math.PI * 2) / (N * 2);
            var x = cX + (R * Math.cos(theta));
            var y = cY + (R * Math.sin(theta));
        }
        else {
            var theta = i * (Math.PI * 2) / (N * 2);
            var x = cX + ((R / 2) * Math.cos(theta));
            var y = cY + ((R / 2) * Math.sin(theta));
        }

        ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    // ctx.stroke();
}
function drawAllFood() {
    foodPositions.forEach((item) => {
        if (!item.ate)
            drawStar(item.x, item.y, foodRadius, 5);
    });
}


function drawBelts() {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(boundX - gameConfig.boundRadius, boundY);
    ctx.lineTo(ball.posX - ball.radius, ball.posY);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(boundX + gameConfig.boundRadius, boundY);
    ctx.lineTo(ball.posX + ball.radius, ball.posY);
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 1;
}


function drawBoundingCircle() {
    ctx.beginPath();
    ctx.arc(boundX, boundY, gameConfig.boundRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}
// drawBoundingCircle();
function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBackgroundImage();
    // drawBoundingCircle();
}
class Ball {
    constructor(posX, posY, radius, xVel, yVel) {
        this.radius = radius;
        this.posX = posX;
        this.posY = posY;
        this.xVel = xVel;
        this.yVel = yVel;
        this.color = "#cefad0"
    }
    drawBall() {
        ctx.beginPath();

        ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
        // ctx.stroke();

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();


    }
    update() {
        let lastPosX = this.posX;
        let lastPosY = this.posY;
        if (this.posY + this.radius + this.yVel >= canvasHeight) {
            playHitAudio();
            this.yVel *= -gameConfig.friction;
            this.xVel *= gameConfig.friction;
        }
        else {
            this.yVel += gameConfig.gravity;
        }
        if (this.posY - this.radius + this.yVel <= 0) {
            playHitAudio();
            this.yVel *= -gameConfig.friction;
        }
        if (this.posX + this.radius + this.xVel >= canvasWidth || this.posX - this.radius + this.xVel <= 0) {
            playHitAudio();
            this.xVel *= -gameConfig.friction;
        }
        this.posX += this.xVel;
        this.posY += this.yVel;

        foodPositions.forEach((item) => {
            if (Math.pow(item.x - this.posX, 2) + Math.pow(item.y - this.posY, 2) <= this.radius * this.radius) {
                item.ate = true;
                var tempCount = 0;
                foodPositions.forEach((item) => {
                    tempCount += item.ate ? 1 : 0;
                });
                if (SCORE != tempCount) {
                    SCORE = tempCount;
                    playFoodAudio();
                    setScore();
                }
            }
        });

        this.drawBall();
        if (lastPosX.toFixed(4) == this.posX.toFixed(4) && lastPosY.toFixed(4) == this.posY.toFixed(4))
            running = false;
    }

}

// ---------------INTIALIZE BALL----------------
// ---------------INTIALIZE BALL----------------
// ---------------INTIALIZE BALL----------------

async function INIT_CANVAS() {
    backgroundImage.src = "assets/image/alexandru-bogdan-ghita-javr3cmXbSE-unsplash.jpg";
    await new Promise((res, rej) => { backgroundImage.onload = () => res() })
    createFood();
    drawBackgroundImage();
    drawAllFood();
    ball.drawBall();
}

var ball = new Ball(canvasWidth / 2, canvasHeight / 2, gameConfig.ballRadius, 0, 0);
const backgroundImage = new Image();
var ballHolderRadius = (ball.radius * Math.sqrt(2)).toFixed(0);
INIT_CANVAS();

function generateRandomScale() {
    return {
        x: Math.max(canvasWidth, Math.ceil(Math.floor(Math.random() * 2000) / 500) * 500),
        y: Math.max(canvasHeight, Math.ceil(Math.floor(Math.random() * 2000) / 500) * 500),
    };
}

function drawBackgroundImage() {
    if (!gameConfig.backgroundImage)
        return;
    ctx.filter = 'blur(8px)';
    // scale = generateRandomScale();
    ctx.drawImage(backgroundImage, -1400, -50, canvasWidth + 2000, canvasHeight + 2000);
    ctx.filter = 'none';
}

function handleMouseDown() {
    if (running) {
        running = false;
    }
    if (MOVES != 0) {
        boundX = ball.posX;
        boundY = ball.posY;
    }
    // ball = new Ball(ball.posX, ball.posY, ball.radius, 0, 0);
    // console.log(ball.posX, ball.posY, ball.xVel, ball.yVel);

    // Listen for mouse position after grabbing ball
    addEventListener("mousemove", handleMoveOnDown);

    // When ball is dragged and released

    // ------------!!!!! ANIMATE IS CALLED HERE !!!!!------------
    // ------------!!!!! ANIMATE IS CALLED HERE !!!!!------------
    // ------------!!!!! ANIMATE IS CALLED HERE !!!!!------------
    addEventListener("mouseup", handleMouseUp);
}

// Calculates and draws ball position when being dragged
function handleMoveOnDown(moveEvent) {
    // console.log(moveEvent);
    let curX = moveEvent.pageX - myCanvas.offsetLeft;
    let curY = moveEvent.pageY - myCanvas.offsetTop;
    // console.log(curX, curY, moveEvent.clientX, moveEvent.clientY);
    // Adjust ball position to bounds
    // checks if mouse is outside bounds
    if (Math.pow(curX - boundX, 2) + Math.pow(curY - boundY, 2) > gameConfig.boundRadius * gameConfig.boundRadius) {
        let slope = (curY - boundY) / (curX - boundX);
        if (curX >= boundX) {
            curX = boundX + gameConfig.boundRadius * Math.cos(Math.atan(slope));
            curY = boundY + gameConfig.boundRadius * Math.sin(Math.atan(slope));
        }
        else {
            curX = boundX - gameConfig.boundRadius * Math.cos(Math.atan(slope));
            curY = boundY - gameConfig.boundRadius * Math.sin(Math.atan(slope));
        }
    }

    if (curY + ball.radius < canvasHeight && curX - ball.radius > 0 && curX + ball.radius < canvasWidth && curY - ball.radius > 0) {
        ball.posX = curX;
        ball.posY = curY;
    }
    clearCanvas();
    ctx.strokeStyle = "#FFFFFF";
    // ctx.strokeStyle = "#4c3228";
    drawBelts();
    drawAllFood();
    ctx.strokeStyle = "#FFFFFF";
    drawArrow();
    ball.drawBall();

    // drawBallHolder();


}

function drawArrow() {
    const arrowLength = 200;

    let deltaX = ball.posX - boundX;
    let deltaY = ball.posY - boundY;
    let angle = Math.atan2(deltaY, deltaX);
    let tox = boundX + Math.floor(-arrowLength * Math.cos(angle));
    let toy = boundY + Math.floor(-arrowLength * Math.sin(angle));
    let headlen = 10;

    // arrow base line
    if ((tox >= 0 && tox <= canvasWidth) && (toy >= 0 && toy <= canvasHeight)) {
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(ball.posX, ball.posY);
        ctx.lineTo(tox, toy);
        ctx.stroke();
        ctx.closePath();
    } else {
        tox = Math.min(canvasWidth, Math.max(0, tox));
        toy = Math.min(canvasHeight, Math.max(0, toy));

        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(ball.posX, ball.posY);
        ctx.lineTo(tox, toy);
        ctx.stroke();
        ctx.closePath();
    }

    // arrow head
    ctx.setLineDash([0, 0]);
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox + headlen * Math.cos(angle - Math.PI / 6), toy + headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox + headlen * Math.cos(angle + Math.PI / 6), toy + headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
    ctx.closePath();



}

// ------------!!!!! ANIMATE IS CALLED HERE !!!!!------------
function handleMouseUp() {
    removeEventListener("mousemove", handleMoveOnDown);
    if (!running) {
        MOVES++;
        setMoves();
        running = true;
        let deltaX = ball.posX - boundX;
        let deltaY = ball.posY - boundY;
        let pulledDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        // Adjust the velocity based on the distance and add some initial velocity for a more realistic bounce
        let initialSpeed = gameConfig.speedFactor * pulledDistance;
        let angle = Math.atan2(deltaY, deltaX);
        ball.xVel = -initialSpeed * Math.cos(angle);
        ball.yVel = -initialSpeed * Math.sin(angle);
        animate();
    }
    removeEventListener("mouseup", handleMouseUp);
}

const straightLineFreedom = 20;
function drawBallHolder() {
    /*
    if (ball.posY <= boundY + straightLineFreedom && ball.posY >= boundY - straightLineFreedom) {
        ctx.beginPath();
        ctx.moveTo(ball.posX - ball.radius, ball.posY);
        ctx.lineTo(ball.posX + ball.radius, ball.posY);
        ctx.stroke();
        ctx.closePath();
    }
    else if (ball.posY >= boundY) {
        ctx.beginPath();
        ctx.arc(ball.posX, ball.posY - ball.radius, ballHolderRadius, 0.785398, 2.35619);
        ctx.stroke();
        ctx.closePath();
    }
    else {
        ctx.beginPath();
        ctx.arc(ball.posX, ball.posY + ball.radius, ballHolderRadius, 0.785398 + Math.PI, 2.35619 + Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
    */
    ctx.fillStyle = "#4c3228";
    ctx.beginPath();
    ctx.roundRect(ball.posX-(ball.radius*0.8), ball.posY-(ball.radius*0.4), ball.radius*1.6, ball.radius*0.8, [8]);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = ball.color;

    ctx.strokeStyle = "#4c3228";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(ball.posX-ball.radius, ball.posY);
    ctx.lineTo(ball.posX+ball.radius, ball.posY);
    ctx.stroke();
    ctx.closePath();
}


// Listen for mouse position to find if its on ball
myCanvas.addEventListener("mousemove", (moveEvent) => {
    // theres an issue here when the ball is on ground and when mouse hovers and then moves away from the ball in downwards, the cursor is still in grab
    if (Math.pow(moveEvent.offsetX - ball.posX, 2) + Math.pow(moveEvent.offsetY - ball.posY, 2) <= ball.radius * ball.radius) {
        document.body.style.cursor = "grab";
        myCanvas.addEventListener("mousedown", handleMouseDown);
    }
    else {
        document.body.style.cursor = "default";
        myCanvas.removeEventListener("mousedown", handleMouseDown);
    }
});

function resetGame() {
    running = false;
    mainHeading.textContent = "PULL THE BALL";
    boundX = canvasWidth / 2;
    boundY = canvasHeight / 2;
    ball = new Ball(boundX, boundY, gameConfig.ballRadius, 0, 0);
    ballHolderRadius = (ball.radius * Math.sqrt(2)).toFixed(0);
    SCORE = 0;
    MOVES = 0;
    setScore();
    setMoves();
    clearCanvas();
    createFood();
    drawAllFood();
    ball.drawBall();
}


resetBtn.addEventListener("click", () => {
    resetGame();
});

function animate() {
    if (MOVES != 0)
        mainHeading.textContent = "PULL IT AGAIN";
    if (running) {
        clearCanvas();
        drawAllFood();
        ball.update();
        requestAnimationFrame(animate);
    }
};

requestAnimationFrame(animate);
import loopify from "./loopify.js";

import ELEMENTS from "./elements/elements.js";
import { DEFAULT } from "./default.js";

import { GameConfigType } from "./types/GameConfigType.js";
import { AudioControlType } from "./types/AudioControlType.js";

const canvasWidth = ELEMENTS.myCanvas!.width;
const canvasHeight = ELEMENTS.myCanvas!.height;

// Inital co-ords for boundCircle
let boundX = canvasWidth / 2;
let boundY = canvasHeight / 2;


const gameConfig: GameConfigType = {
    _ballRadius: DEFAULT.BallRadius,
    _gravity: DEFAULT.Gravity,
    _friction: DEFAULT.Friction,
    _speedFactor: DEFAULT.SpeedFactor,
    _totalFood: DEFAULT.TotalFood,
    _boundRadius: DEFAULT.BoundRadius,
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
        if (typeof value === "string")
            value = parseInt(value, 10);
        if (typeof value === 'number' && !isNaN(value)) {
            value = Math.max(10, Math.min(100, value));
        }
        else {
            value = DEFAULT.BallRadius;
        }
        this._ballRadius = value;
    },
    set gravity(value) {
        if (typeof value === "string")
            value = parseFloat(value);
        if (typeof value === 'number' && !isNaN(value)) {
            value = parseFloat(value.toFixed(2));
            value = Math.max(0, Math.min(10, value));
        }
        else {
            value = DEFAULT.Gravity;
        }
        this._gravity = value;
    },
    set friction(value) {
        if (typeof value === "string")
            value = parseFloat(value);
        if (typeof value === 'number' && !isNaN(value)) {
            value = parseFloat(value.toFixed(2));
            value = Math.max(0, Math.min(1, value));
        }
        else {
            value = DEFAULT.Friction;
        }
        this._friction = value;
    },
    set speedFactor(value) {
        if (typeof value === "string")
            value = parseFloat(value);
        if (typeof value === 'number' && !isNaN(value)) {
            value = parseFloat(value.toFixed(2));
            value = Math.max(0.1, Math.min(2, value));
        }
        else {
            value = DEFAULT.SpeedFactor;
        }
        this._speedFactor = value;
    },
    set totalFood(value) {
        if (typeof value === "string")
            value = parseInt(value, 10);
        if (typeof value === 'number' && !isNaN(value)) {
            value = Math.max(1, Math.min(20, value));
        }
        else {
            value = DEFAULT.TotalFood;
        }
        this._totalFood = value;
    },
    set boundRadius(value) {
        if (typeof value === "string")
            value = parseInt(value, 10);
        if (typeof value === 'number' && !isNaN(value)) {
            value = Math.max(120, Math.min(200, value));
        }
        else {
            value = DEFAULT.BoundRadius;
        }
        this._boundRadius = value;
    },
    set backgroundImage(value) {
        this._backgroundImage = value;
    },
};

function setValuesInputFields() {
    gameConfig.ballRadius = ELEMENTS.ballRadiusInput?.value ?? -1;
    gameConfig.gravity = ELEMENTS.gravityInput?.value ?? -1;
    gameConfig.friction = ELEMENTS.frictionInput?.value ?? -1;
    gameConfig.speedFactor = ELEMENTS.speedFactorInput?.value ?? -1;
    gameConfig.totalFood = ELEMENTS.totalFoodInput?.value ?? -1;
    gameConfig.boundRadius = ELEMENTS.boundRadiusInput?.value ?? -1;
    gameConfig.backgroundImage = ELEMENTS.isBackgroundImage?.checked ?? true;

    ELEMENTS.ballRadiusInput!.value = gameConfig.ballRadius.toString();
    ELEMENTS.gravityInput!.value = gameConfig.gravity.toString();
    ELEMENTS.frictionInput!.value = gameConfig.friction.toString();
    ELEMENTS.speedFactorInput!.value = gameConfig.speedFactor.toString();
    ELEMENTS.totalFoodInput!.value = gameConfig.totalFood.toString();
    ELEMENTS.boundRadiusInput!.value = gameConfig.boundRadius.toString();
    ELEMENTS.isBackgroundImage!.checked = gameConfig.backgroundImage;
}

setValuesInputFields();

let running = false;
const ctx = ELEMENTS.myCanvas!.getContext("2d");
ctx!.imageSmoothingEnabled = false;

let SCORE = 0;
let MOVES = 0;

function setScore() {
    ELEMENTS.scoreField!.innerHTML = `<strong>SCORE: ${SCORE}</strong>`;
}

function setMoves() {
    ELEMENTS.movesField!.innerHTML = `<strong>MOVES: ${MOVES}</strong>`;
}

const hitSound = new Audio("assets/audio/hit.mp3");
const foodBiteSound = new Audio("assets/audio/eat.mp3");

loopify("assets/audio/slingarom_theme.mp3", function (err: Error | null, audioControl?: AudioControlType) {

    // If something went wrong, `err` is supplied
    if (err) {
        return console.error(err);
    }

    // Play it whenever you want
    // audioControl.play();

    // Stop it later if you feel like it
    ELEMENTS.muteBtn!.addEventListener("click", () => {
        if (ELEMENTS.muteBtn!.innerHTML == `<i class="fa-solid fa-volume-high" aria-hidden="true"></i>`) {
            ELEMENTS.muteBtn!.innerHTML = `<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>`;
            audioControl?.stop();
        }
        else {
            ELEMENTS.muteBtn!.innerHTML = `<i class="fa-solid fa-volume-high" aria-hidden="true"></i>`;
            audioControl?.play();
        }
    });
});

ELEMENTS.menuBtn!.addEventListener("click", handleMenuClick);
function handleMenuClick() {
    if (ELEMENTS.menuItems!.style.opacity === "0") {
        // ELEMENTS.menuItems!.style.display = "block";
        ELEMENTS.menuItems!.style.left = "0vh";
        ELEMENTS.menuItems!.style.opacity = "1";
    }
    else {
        // ELEMENTS.menuItems!.style.display = "none";
        ELEMENTS.menuItems!.style.left = "-" + ELEMENTS.menuItems!.style.width;
        ELEMENTS.menuItems!.style.opacity = "0";
    }
}

addEventListener("keydown", handleKeyDown);
function handleKeyDown(event: KeyboardEvent) {
    // ELEMENTS.menuItems!.style.display = "none";
    if(event.key === "Escape"){
        ELEMENTS.menuItems!.style.left = "-" + ELEMENTS.menuItems!.style.width;
        ELEMENTS.menuItems!.style.opacity = "0";
    }
}


ELEMENTS.gameConfigForm!.addEventListener("submit", (e) => {
    e.preventDefault();
    setValuesInputFields();
    foodPositions = [];
    initFood(gameConfig.totalFood);

    ELEMENTS.resetBtn!.click();
});
ELEMENTS.restoreBtn!.addEventListener("click", () => {
    ELEMENTS.ballRadiusInput!.value = "";
    ELEMENTS.gravityInput!.value = "";
    ELEMENTS.frictionInput!.value = "";
    ELEMENTS.speedFactorInput!.value = "";
    ELEMENTS.totalFoodInput!.value = "";
    ELEMENTS.boundRadiusInput!.value = "";
    ELEMENTS.applyBtn!.click();
});
ELEMENTS.randomizeBtn!.addEventListener("click", () => {
    ELEMENTS.ballRadiusInput!.value = (Math.random() * 100).toString();
    ELEMENTS.gravityInput!.value = (Math.random() * 10).toString();
    ELEMENTS.frictionInput!.value = (Math.random()).toString();
    ELEMENTS.speedFactorInput!.value = (Math.random() * 2).toString();
    ELEMENTS.totalFoodInput!.value = (Math.random() * 20).toString();
    ELEMENTS.boundRadiusInput!.value = (Math.random() * 200).toString();
    ELEMENTS.applyBtn!.click();

    // gameConfig.ballRadius = Math.random() * 100;
    // gameConfig.gravity = Math.random() * 10;
    // gameConfig.friction = Math.random();
    // gameConfig.speedFactor = Math.random() * 2;
    // gameConfig.totalFood = Math.random() * 20;
    // gameConfig.boundRadius = Math.random() * 200;
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

type FoodPosition = {
    x: number,
    y: number,
    ate: boolean,
}

let foodPositions: Array<FoodPosition> = [];

function initFood(value: number) {
    for (var i = 0; i < value; i++)
        foodPositions.push({
            x: 0,
            y: 0,
            ate: false
        });
}
initFood(gameConfig.totalFood);

function createFood() {
    const minDistance = 100;
    const centerThreshold = ball.radius;
    for (var i = 0; i < gameConfig.totalFood; i++) {
        let x: number, y: number;
        // foodPositions[i] = {
        //     x: roundToNearest(100, Math.floor(Math.random() * (canvasWidth - 2 * DEFAULT.FoodSpawnPadding)) + DEFAULT.FoodSpawnPadding),
        //     y: roundToNearest(100, Math.floor(Math.random() * (canvasHeight - 2 * DEFAULT.FoodSpawnPadding)) + DEFAULT.FoodSpawnPadding),
        //     ate: false
        // };
        do {
            x = Math.floor(Math.random() * (canvasWidth - 2 * DEFAULT.FoodSpawnPadding)) + DEFAULT.FoodSpawnPadding;
            y = Math.floor(Math.random() * (canvasHeight - 2 * DEFAULT.FoodSpawnPadding)) + DEFAULT.FoodSpawnPadding;
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

function drawStar(cX: number, cY: number, R: number, N: number) {
    // ctx.beginPath();
    // ctx.arc(starX, starY, 10, 0, 2*Math.PI);
    // ctx.fillStyle = "#FFFFFF";
    // ctx.fill();
    // ctx.closePath();
    ctx?.beginPath();
    ctx?.moveTo(cX + R, cY);
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

        ctx?.lineTo(x, y);
    }
    ctx?.closePath();
    ctx!.fillStyle = "#FFD700";
    ctx?.fill();
    // ctx.stroke();
}
function drawAllFood() {
    foodPositions.forEach((item) => {
        if (!item.ate)
            drawStar(item.x, item.y, DEFAULT.FoodRadius, 5);
    });
}


function drawBelts() {
    ctx!.lineWidth = 3;
    ctx?.beginPath();
    ctx?.moveTo(boundX - gameConfig.boundRadius, boundY);
    ctx?.lineTo(ball.posX - ball.radius, ball.posY);
    ctx?.stroke();
    ctx?.closePath();

    ctx?.beginPath();
    ctx?.moveTo(boundX + gameConfig.boundRadius, boundY);
    ctx?.lineTo(ball.posX + ball.radius, ball.posY);
    ctx?.stroke();
    ctx?.closePath();
    ctx!.lineWidth = 1;
}


function drawBoundingCircle() {
    ctx?.beginPath();
    ctx?.arc(boundX, boundY, gameConfig.boundRadius, 0, 2 * Math.PI);
    ctx?.stroke();
    ctx?.closePath();
}
// drawBoundingCircle();
function clearCanvas() {
    ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBackgroundImage();
    // drawBoundingCircle();
}
class Ball {
    constructor(
        public posX: number,
        public posY: number,
        public radius: number,
        public xVel: number,
        public yVel: number,
        public color: string = "#cefad0") {
    }
    drawBall() {
        ctx?.beginPath();

        ctx?.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
        // ctx.stroke();

        ctx!.fillStyle = this.color;
        ctx?.fill();
        ctx?.closePath();


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
    await new Promise((resolve, reject) => { backgroundImage.onload = () => resolve(true) })
    createFood();
    drawBackgroundImage();
    drawAllFood();
    ball.drawBall();
}

let ball = new Ball(canvasWidth / 2, canvasHeight / 2, gameConfig.ballRadius, 0, 0);
const backgroundImage = new Image();
let ballHolderRadius = (ball.radius * Math.sqrt(2)).toFixed(0);
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
    ctx!.filter = 'blur(8px)';
    // scale = generateRandomScale();
    ctx?.drawImage(backgroundImage, -1400, -50, canvasWidth + 2000, canvasHeight + 2000);
    ctx!.filter = 'none';
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
function handleMoveOnDown(moveEvent: MouseEvent) {
    // console.log(moveEvent);
    let curX = moveEvent.pageX - ELEMENTS.myCanvas!.offsetLeft;
    let curY = moveEvent.pageY - ELEMENTS.myCanvas!.offsetTop;
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
    ctx!.strokeStyle = "#FFFFFF";
    // ctx.strokeStyle = "#4c3228";
    drawBelts();
    drawAllFood();
    ctx!.strokeStyle = "#FFFFFF";
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
        ctx?.setLineDash([5, 3]);
        ctx?.beginPath();
        ctx?.moveTo(ball.posX, ball.posY);
        ctx?.lineTo(tox, toy);
        ctx?.stroke();
        ctx?.closePath();
    } else {
        tox = Math.min(canvasWidth, Math.max(0, tox));
        toy = Math.min(canvasHeight, Math.max(0, toy));

        ctx?.setLineDash([5, 3]);
        ctx?.beginPath();
        ctx?.moveTo(ball.posX, ball.posY);
        ctx?.lineTo(tox, toy);
        ctx?.stroke();
        ctx?.closePath();
    }

    // arrow head
    ctx?.setLineDash([0, 0]);
    ctx?.beginPath();
    ctx?.moveTo(tox, toy);
    ctx?.lineTo(tox + headlen * Math.cos(angle - Math.PI / 6), toy + headlen * Math.sin(angle - Math.PI / 6));
    ctx?.moveTo(tox, toy);
    ctx?.lineTo(tox + headlen * Math.cos(angle + Math.PI / 6), toy + headlen * Math.sin(angle + Math.PI / 6));
    ctx?.stroke();
    ctx?.closePath();
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
    ctx!.fillStyle = "#4c3228";
    ctx?.beginPath();
    ctx?.roundRect(ball.posX - (ball.radius * 0.8), ball.posY - (ball.radius * 0.4), ball.radius * 1.6, ball.radius * 0.8, [8]);
    ctx?.fill();
    ctx?.closePath();
    ctx!.fillStyle = ball.color;

    ctx!.strokeStyle = "#4c3228";
    ctx!.lineWidth = 4;
    ctx?.beginPath();
    ctx?.moveTo(ball.posX - ball.radius, ball.posY);
    ctx?.lineTo(ball.posX + ball.radius, ball.posY);
    ctx?.stroke();
    ctx?.closePath();
}


// Listen for mouse position to find if its on ball
ELEMENTS.myCanvas!.addEventListener("mousemove", (moveEvent) => {
    // theres an issue here when the ball is on ground and when mouse hovers and then moves away from the ball in downwards, the cursor is still in grab
    if (Math.pow(moveEvent.offsetX - ball.posX, 2) + Math.pow(moveEvent.offsetY - ball.posY, 2) <= ball.radius * ball.radius) {
        document.body.style.cursor = "grab";
        ELEMENTS.myCanvas!.addEventListener("mousedown", handleMouseDown);
    }
    else {
        document.body.style.cursor = "default";
        ELEMENTS.myCanvas!.removeEventListener("mousedown", handleMouseDown);
    }
});

function resetGame() {
    running = false;
    ELEMENTS.mainHeading!.textContent = "PULL THE BALL";
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


ELEMENTS.resetBtn!.addEventListener("click", () => {
    resetGame();
});

function animate() {
    if (MOVES != 0)
        ELEMENTS.mainHeading!.textContent = "PULL IT AGAIN";
    if (running) {
        clearCanvas();
        drawAllFood();
        ball.update();
        requestAnimationFrame(animate);
    }
};

requestAnimationFrame(animate);

// function loopify(arg0: string, arg1: (err: Error | null, audioControl: AudioControl) => void) {
//     throw new Error("Function not implemented.");
// }

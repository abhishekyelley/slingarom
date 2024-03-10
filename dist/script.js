var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import loopify from "./loopify.js";
import * as ELEMENTS from "./elements/elements.js";
import { DEFAULT } from "./default.js";
const canvasWidth = ELEMENTS.myCanvas.width;
const canvasHeight = ELEMENTS.myCanvas.height;
let boundX = canvasWidth / 2;
let boundY = canvasHeight / 2;
const gameConfig = {
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    gameConfig.ballRadius = (_b = (_a = ELEMENTS.ballRadiusInput) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : -1;
    gameConfig.gravity = (_d = (_c = ELEMENTS.gravityInput) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : -1;
    gameConfig.friction = (_f = (_e = ELEMENTS.frictionInput) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : -1;
    gameConfig.speedFactor = (_h = (_g = ELEMENTS.speedFactorInput) === null || _g === void 0 ? void 0 : _g.value) !== null && _h !== void 0 ? _h : -1;
    gameConfig.totalFood = (_k = (_j = ELEMENTS.totalFoodInput) === null || _j === void 0 ? void 0 : _j.value) !== null && _k !== void 0 ? _k : -1;
    gameConfig.boundRadius = (_m = (_l = ELEMENTS.boundRadiusInput) === null || _l === void 0 ? void 0 : _l.value) !== null && _m !== void 0 ? _m : -1;
    gameConfig.backgroundImage = (_p = (_o = ELEMENTS.isBackgroundImage) === null || _o === void 0 ? void 0 : _o.checked) !== null && _p !== void 0 ? _p : true;
    ELEMENTS.ballRadiusInput.value = gameConfig.ballRadius.toString();
    ELEMENTS.gravityInput.value = gameConfig.gravity.toString();
    ELEMENTS.frictionInput.value = gameConfig.friction.toString();
    ELEMENTS.speedFactorInput.value = gameConfig.speedFactor.toString();
    ELEMENTS.totalFoodInput.value = gameConfig.totalFood.toString();
    ELEMENTS.boundRadiusInput.value = gameConfig.boundRadius.toString();
    ELEMENTS.isBackgroundImage.checked = gameConfig.backgroundImage;
}
setValuesInputFields();
let running = false;
const ctx = ELEMENTS.myCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
let SCORE = 0;
let MOVES = 0;
function setScore() {
    ELEMENTS.scoreField.innerHTML = `<strong>SCORE: ${SCORE}</strong>`;
}
function setMoves() {
    ELEMENTS.movesField.innerHTML = `<strong>MOVES: ${MOVES}</strong>`;
}
const hitSound = new Audio("assets/audio/hit.mp3");
const foodBiteSound = new Audio("assets/audio/eat.mp3");
loopify("assets/audio/slingarom_theme.mp3", function (err, audioControl) {
    if (err) {
        return console.error(err);
    }
    ELEMENTS.muteBtn.addEventListener("click", () => {
        if (ELEMENTS.muteBtn.innerHTML == `<i class="fa-solid fa-volume-high" aria-hidden="true"></i>`) {
            ELEMENTS.muteBtn.innerHTML = `<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>`;
            audioControl === null || audioControl === void 0 ? void 0 : audioControl.stop();
        }
        else {
            ELEMENTS.muteBtn.innerHTML = `<i class="fa-solid fa-volume-high" aria-hidden="true"></i>`;
            audioControl === null || audioControl === void 0 ? void 0 : audioControl.play();
        }
    });
});
ELEMENTS.menuBtn.addEventListener("click", handleMenuClick);
function handleMenuClick() {
    if (ELEMENTS.menuItems.style.opacity === "0") {
        ELEMENTS.menuItems.style.left = "0vh";
        ELEMENTS.menuItems.style.opacity = "1";
    }
    else {
        ELEMENTS.menuItems.style.left = "-" + ELEMENTS.menuItems.style.width;
        ELEMENTS.menuItems.style.opacity = "0";
    }
}
addEventListener("keydown", handleKeyDown);
function handleKeyDown(event) {
    if (event.key === "Escape") {
        ELEMENTS.menuItems.style.left = "-" + ELEMENTS.menuItems.style.width;
        ELEMENTS.menuItems.style.opacity = "0";
    }
}
ELEMENTS.gameConfigForm.addEventListener("submit", (e) => {
    e.preventDefault();
    setValuesInputFields();
    foodPositions = [];
    initFood(gameConfig.totalFood);
    ELEMENTS.resetBtn.click();
});
ELEMENTS.restoreBtn.addEventListener("click", () => {
    ELEMENTS.ballRadiusInput.value = "";
    ELEMENTS.gravityInput.value = "";
    ELEMENTS.frictionInput.value = "";
    ELEMENTS.speedFactorInput.value = "";
    ELEMENTS.totalFoodInput.value = "";
    ELEMENTS.boundRadiusInput.value = "";
    ELEMENTS.applyBtn.click();
});
ELEMENTS.randomizeBtn.addEventListener("click", () => {
    ELEMENTS.ballRadiusInput.value = (Math.random() * 100).toString();
    ELEMENTS.gravityInput.value = (Math.random() * 10).toString();
    ELEMENTS.frictionInput.value = (Math.random()).toString();
    ELEMENTS.speedFactorInput.value = (Math.random() * 2).toString();
    ELEMENTS.totalFoodInput.value = (Math.random() * 20).toString();
    ELEMENTS.boundRadiusInput.value = (Math.random() * 200).toString();
    ELEMENTS.applyBtn.click();
});
function playHitAudio() {
    hitSound.pause();
    hitSound.currentTime = 0;
    hitSound.play();
}
function playFoodAudio() {
    foodBiteSound.pause();
    foodBiteSound.currentTime = 0;
    foodBiteSound.play();
}
let foodPositions = [];
function initFood(value) {
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
        let x, y;
        do {
            x = Math.floor(Math.random() * (canvasWidth - 2 * DEFAULT.FoodSpawnPadding)) + DEFAULT.FoodSpawnPadding;
            y = Math.floor(Math.random() * (canvasHeight - 2 * DEFAULT.FoodSpawnPadding)) + DEFAULT.FoodSpawnPadding;
        } while (foodPositions.some(food => Math.sqrt(Math.pow((x - food.x), 2) + Math.pow((y - food.y), 2)) < Math.min(100, minDistance))
            ||
                Math.sqrt(Math.pow((x - canvasWidth / 2), 2) + Math.pow((y - canvasHeight / 2), 2)) < centerThreshold);
        foodPositions[i] = {
            x,
            y,
            ate: false
        };
    }
}
function drawStar(cX, cY, R, N) {
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(cX + R, cY);
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
        ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(x, y);
    }
    ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
    ctx.fillStyle = "#FFD700";
    ctx === null || ctx === void 0 ? void 0 : ctx.fill();
}
function drawAllFood() {
    foodPositions.forEach((item) => {
        if (!item.ate)
            drawStar(item.x, item.y, DEFAULT.FoodRadius, 5);
    });
}
function drawBelts() {
    ctx.lineWidth = 3;
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(boundX - gameConfig.boundRadius, boundY);
    ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(ball.posX - ball.radius, ball.posY);
    ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
    ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(boundX + gameConfig.boundRadius, boundY);
    ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(ball.posX + ball.radius, ball.posY);
    ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
    ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
    ctx.lineWidth = 1;
}
function drawBoundingCircle() {
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    ctx === null || ctx === void 0 ? void 0 : ctx.arc(boundX, boundY, gameConfig.boundRadius, 0, 2 * Math.PI);
    ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
    ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
}
function clearCanvas() {
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBackgroundImage();
}
class Ball {
    constructor(posX, posY, radius, xVel, yVel, color = "#cefad0") {
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.xVel = xVel;
        this.yVel = yVel;
        this.color = color;
    }
    drawBall() {
        ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
        ctx === null || ctx === void 0 ? void 0 : ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx === null || ctx === void 0 ? void 0 : ctx.fill();
        ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
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
function INIT_CANVAS() {
    return __awaiter(this, void 0, void 0, function* () {
        backgroundImage.src = "assets/image/alexandru-bogdan-ghita-javr3cmXbSE-unsplash.jpg";
        yield new Promise((resolve, reject) => { backgroundImage.onload = () => resolve(true); });
        createFood();
        drawBackgroundImage();
        drawAllFood();
        ball.drawBall();
    });
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
    ctx.filter = 'blur(8px)';
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(backgroundImage, -1400, -50, canvasWidth + 2000, canvasHeight + 2000);
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
    addEventListener("mousemove", handleMoveOnDown);
    addEventListener("mouseup", handleMouseUp);
}
function handleMoveOnDown(moveEvent) {
    let curX = moveEvent.pageX - ELEMENTS.myCanvas.offsetLeft;
    let curY = moveEvent.pageY - ELEMENTS.myCanvas.offsetTop;
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
    drawBelts();
    drawAllFood();
    ctx.strokeStyle = "#FFFFFF";
    drawArrow();
    ball.drawBall();
}
function drawArrow() {
    const arrowLength = 200;
    let deltaX = ball.posX - boundX;
    let deltaY = ball.posY - boundY;
    let angle = Math.atan2(deltaY, deltaX);
    let tox = boundX + Math.floor(-arrowLength * Math.cos(angle));
    let toy = boundY + Math.floor(-arrowLength * Math.sin(angle));
    let headlen = 10;
    if ((tox >= 0 && tox <= canvasWidth) && (toy >= 0 && toy <= canvasHeight)) {
        ctx === null || ctx === void 0 ? void 0 : ctx.setLineDash([5, 3]);
        ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
        ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(ball.posX, ball.posY);
        ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(tox, toy);
        ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
        ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
    }
    else {
        tox = Math.min(canvasWidth, Math.max(0, tox));
        toy = Math.min(canvasHeight, Math.max(0, toy));
        ctx === null || ctx === void 0 ? void 0 : ctx.setLineDash([5, 3]);
        ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
        ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(ball.posX, ball.posY);
        ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(tox, toy);
        ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
        ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
    }
    ctx === null || ctx === void 0 ? void 0 : ctx.setLineDash([0, 0]);
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(tox, toy);
    ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(tox + headlen * Math.cos(angle - Math.PI / 6), toy + headlen * Math.sin(angle - Math.PI / 6));
    ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(tox, toy);
    ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(tox + headlen * Math.cos(angle + Math.PI / 6), toy + headlen * Math.sin(angle + Math.PI / 6));
    ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
    ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
}
function handleMouseUp() {
    removeEventListener("mousemove", handleMoveOnDown);
    if (!running) {
        MOVES++;
        setMoves();
        running = true;
        let deltaX = ball.posX - boundX;
        let deltaY = ball.posY - boundY;
        let pulledDistance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
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
    ctx.fillStyle = "#4c3228";
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    ctx === null || ctx === void 0 ? void 0 : ctx.roundRect(ball.posX - (ball.radius * 0.8), ball.posY - (ball.radius * 0.4), ball.radius * 1.6, ball.radius * 0.8, [8]);
    ctx === null || ctx === void 0 ? void 0 : ctx.fill();
    ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
    ctx.fillStyle = ball.color;
    ctx.strokeStyle = "#4c3228";
    ctx.lineWidth = 4;
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(ball.posX - ball.radius, ball.posY);
    ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(ball.posX + ball.radius, ball.posY);
    ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
    ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
}
ELEMENTS.myCanvas.addEventListener("mousemove", (moveEvent) => {
    if (Math.pow(moveEvent.offsetX - ball.posX, 2) + Math.pow(moveEvent.offsetY - ball.posY, 2) <= ball.radius * ball.radius) {
        document.body.style.cursor = "grab";
        ELEMENTS.myCanvas.addEventListener("mousedown", handleMouseDown);
    }
    else {
        document.body.style.cursor = "default";
        ELEMENTS.myCanvas.removeEventListener("mousedown", handleMouseDown);
    }
});
function resetGame() {
    running = false;
    ELEMENTS.mainHeading.textContent = "PULL THE BALL";
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
ELEMENTS.resetBtn.addEventListener("click", () => {
    resetGame();
});
function animate() {
    if (MOVES != 0)
        ELEMENTS.mainHeading.textContent = "PULL IT AGAIN";
    if (running) {
        clearCanvas();
        drawAllFood();
        ball.update();
        requestAnimationFrame(animate);
    }
}
;
requestAnimationFrame(animate);

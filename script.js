const resetBtn = document.querySelector("#resetBtn");
const myCanvas = document.querySelector("#myCanvas");
const scoreField = document.querySelector("#score");
const movesField = document.querySelector("#moves");
const mainHeading = document.querySelector("#mainHeading");
const muteBtn = document.querySelector("#muteBtn");
const canvasWidth = myCanvas.width;
const canvasHeight = myCanvas.height;
const boundRadius = 120;    // determines how far you can pull the sling
var boundX = canvasWidth/2;
var boundY = canvasHeight/2;
const ballRadius = 50;
const gravity = 0.5;
const friction = 0.65;
const speedFactor = 0.5;    // determines launch speed
const foodRadius = 15;
const foodSpawnPadding = 50;
var running = false;
const ctx = myCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

var SCORE = 0;
var MOVES = 0;

function setScore(){
    scoreField.innerHTML = `<strong>SCORE: ${SCORE}</strong>`;
}

function setMoves(){
    movesField.innerHTML = `<strong>MOVES: ${MOVES}</strong>`;
}

const hitSound = new Audio("hit.mp3");
const foodBiteSound = new Audio("eat.mp3");
loopify("slingarom_theme.mp3",function(err,loop) {

    // If something went wrong, `err` is supplied
    if (err) {
        return console.err(err);
    }

    // Play it whenever you want
    loop.play();

    // Stop it later if you feel like it
    muteBtn.addEventListener("click", ()=>{
        if(muteBtn.classList[1] == "fa-volume-xmark"){
            muteBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
            loop.play();
        }
        else{
            muteBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
            loop.stop();
        }
    });


});
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

const ballHolderRadius = (ballRadius * Math.sqrt(2)).toFixed(0);

var foodPositions = [];
const totalFood = 3;
function initFood(totalFood){
    for(var i=0; i<totalFood; i++)
        foodPositions.push({});
}
initFood(totalFood);
function createFood(){
    for(var i=0; i<3; i++){
        foodPositions[i] = {
            x : Math.floor(Math.random()*(canvasWidth-2*foodSpawnPadding)) + foodSpawnPadding,
            y : Math.floor(Math.random()*(canvasHeight-2*foodSpawnPadding)) + foodSpawnPadding,
            ate : false
        };
    }
}
function drawPoint(cX, cY, R, N){
    // ctx.beginPath();
    // ctx.arc(starX, starY, 10, 0, 2*Math.PI);
    // ctx.fillStyle = "#FFFFFF";
    // ctx.fill();
    // ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(cX + R,cY);
    for(var i = 1; i <= N * 2; i++)
    {
        if(i % 2 == 0){
            var theta = i * (Math.PI * 2) / (N * 2);
            var x = cX + (R * Math.cos(theta));
            var y = cY + (R * Math.sin(theta));
        }
        else {
            var theta = i * (Math.PI * 2) / (N * 2);
            var x = cX + ((R/2) * Math.cos(theta));
            var y = cY + ((R/2) * Math.sin(theta));
        }

        ctx.lineTo(x ,y);
    }
    ctx.closePath();
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    // ctx.stroke();
}
function drawAllFood(){
    foodPositions.forEach((item)=>{
        if(!item.ate)
            drawPoint(item.x, item.y, foodRadius, 5);
    });
}


function drawBelts(){
    ctx.beginPath();
    ctx.moveTo(boundX-boundRadius, boundY);
    ctx.lineTo(ball.posX-ball.radius, ball.posY);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(boundX+boundRadius, boundY);
    ctx.lineTo(ball.posX+ball.radius, ball.posY);
    ctx.stroke();
    ctx.closePath();
}


function drawBoundingCircle(){
    ctx.beginPath();
    ctx.arc(boundX, boundY, boundRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}
// drawBoundingCircle();
function clearCanvas(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // drawBoundingCircle();
}
class Ball {
    constructor(posX, posY, radius, xVel, yVel) {
        this.radius = radius;
        this.posX = posX;
        this.posY = posY;
        this.xVel = xVel;
        this.yVel = yVel;
    }
    drawBall(){
        ctx.beginPath();
        
        ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
        // ctx.stroke();
        
        ctx.fillStyle = "#e7bef7";
        ctx.fill();
        ctx.closePath();

        
    }
    update(){
        let lastPosX = this.posX;
        let lastPosY = this.posY;
        if(this.posY + this.radius + this.yVel >= canvasHeight){
            playHitAudio();
            this.yVel *= -friction;
            this.xVel *= friction;
        }
        else{
            this.yVel += gravity;
        }
        if(this.posY - this.radius + this.yVel <= 0){
            playHitAudio();
            this.yVel *= -friction;
        }
        if (this.posX + this.radius + this.xVel>= canvasWidth || this.posX - this.radius + this.xVel <= 0){
            playHitAudio();
		    this.xVel *= -friction;
		}
        this.posX += this.xVel;
        this.posY += this.yVel;

        foodPositions.forEach((item)=>{
            if(Math.pow(item.x-this.posX, 2) + Math.pow(item.y-this.posY, 2) <= this.radius*this.radius){
                item.ate = true;
                var tempCount = 0;
                foodPositions.forEach((item)=>{
                    tempCount += item.ate?1:0;
                });
                if(SCORE != tempCount){
                    SCORE = tempCount;
                    playFoodAudio();
                    setScore();
                }
            }
        });

        this.drawBall();
        if(lastPosX.toFixed(4) == this.posX.toFixed(4) && lastPosY.toFixed(4) == this.posY.toFixed(4))
            running = false;
    }
    
}

// ---------------INTIALIZE BALL----------------
var ball = new Ball(canvasWidth/2, canvasHeight/2, ballRadius, 0, 0);
createFood();
drawAllFood();
ball.drawBall();



function handleMouseDown(){
    if(running){
        running = false;
    }
    if(MOVES != 0){
        boundX = ball.posX;
        boundY = ball.posY;
    }
    // ball = new Ball(ball.posX, ball.posY, ball.radius, 0, 0);
    // console.log(ball.posX, ball.posY, ball.xVel, ball.yVel);

    // Listen for mouse position after grabbing ball
    myCanvas.addEventListener("mousemove", handleMoveOnDown);

    // When ball is dragged and released

    // ------------!!!!! ANIMATE IS CALLED HERE !!!!!------------
    // ------------!!!!! ANIMATE IS CALLED HERE !!!!!------------
    // ------------!!!!! ANIMATE IS CALLED HERE !!!!!------------
    myCanvas.addEventListener("mouseup", ()=>{
        myCanvas.removeEventListener("mousemove", handleMoveOnDown);
        if(!running){
            MOVES++;
            setMoves();
            running = true;
            let deltaX = ball.posX - boundX;
            let deltaY = ball.posY - boundY;
            let pulledDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

            // Adjust the velocity based on the distance and add some initial velocity for a more realistic bounce
            let initialSpeed = speedFactor*pulledDistance;
            let angle = Math.atan2(deltaY, deltaX);
            ball.xVel = -initialSpeed * Math.cos(angle);
            ball.yVel = -initialSpeed * Math.sin(angle);
            animate();
        }
    });
}

// Calculates and draws ball position when being dragged
function handleMoveOnDown(moveEvent){
    let curX = moveEvent.offsetX;
    let curY = moveEvent.offsetY;
    
    // Adjust ball position to bounds
    // checks if mouse is outside bounds
        if(Math.pow(curX-boundX, 2) + Math.pow(curY-boundY, 2) > boundRadius*boundRadius){
            let slope = (curY - boundY) / (curX - boundX);
            if(curX >= boundX){
                curX = boundX + boundRadius*Math.cos(Math.atan(slope));
                curY = boundY + boundRadius*Math.sin(Math.atan(slope));
            }
            else{
                curX = boundX - boundRadius*Math.cos(Math.atan(slope));
                curY = boundY - boundRadius*Math.sin(Math.atan(slope));
            }
        }
    
    if(curY+ball.radius<canvasHeight && curX-ball.radius>0 && curX+ball.radius<canvasWidth && curY-ball.radius>0){
        ball.posX = curX;
        ball.posY = curY;
    }
    clearCanvas();

    drawBelts();
    drawAllFood();
    ball.drawBall();
    
    drawBallHolder();
    

}

function drawBallHolder(){
    ctx.beginPath();
    ctx.moveTo(ball.posX-ball.radius, ball.posY);
    ctx.lineTo(ball.posX+ball.radius, ball.posY);
    ctx.stroke();
    ctx.closePath();

    /*
    if(true || ball.posY >= boundY){
        ctx.beginPath();
        ctx.arc(ball.posX, ball.posY+ball.radius, ballHolderRadius, 0.785398 + Math.PI, 2.35619 + Math.PI);
        ctx.arc(ball.posX, ball.posY-ball.radius, ballHolderRadius, 0.785398, 2.35619);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.closePath();
    }
    */

}


// Listen for mouse position to find if its on ball
myCanvas.addEventListener("mousemove", (moveEvent)=>{
    if(Math.pow(moveEvent.offsetX-ball.posX, 2) + Math.pow(moveEvent.offsetY-ball.posY, 2) <= ballRadius*ballRadius){
        document.body.style.cursor = "grab";
        myCanvas.addEventListener("mousedown", handleMouseDown);
    }
    else{
        document.body.style.cursor = "default";
        myCanvas.removeEventListener("mousedown", handleMouseDown);
    }
});


function animate(){
    if(MOVES != 0)
        mainHeading.textContent = "PULL IT AGAIN";
    if(running){
        requestAnimationFrame(()=>{
            clearCanvas();
            drawAllFood();
            ball.update();
            animate();
        });
    }
};

resetBtn.addEventListener("click", ()=>{
    running = false;
    mainHeading.textContent = "PULL THE BALL";
    boundX = canvasWidth/2;
    boundY = canvasHeight/2;
    ball = new Ball(boundX, boundY, ballRadius, 0, 0);
    SCORE = 0;
    MOVES = 0;
    setScore();
    setMoves();
    clearCanvas();
    createFood();
    drawAllFood();
    ball.drawBall();
});
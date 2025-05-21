// MAIN CODE
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

let table = makeTable();
let cueball = makeBall(160, 320, "#ffffdd");
let ball1 = makeBall(160,160, "gold");
let ball2 = makeBall(146,142, "navy");
let ball3 = makeBall(174,142, "crimson");
setupTouch();
cueball.xVel = 0.2;
cueball.yVel = -8;
animate();

function makeBall(x, y, colorIn){
  const ball = {
    inPlay: true,
    radius: 10,
    xPos: x,
    yPos: y,
    xVel: 0,
    yVel: 0,
    xAcc: 0,
    yAcc: 0,
    friction: 0.985,
    color: colorIn,
    draw: function(){
      if (!this.inPlay) return;
      ctx.beginPath();
      ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    },
    update: function(){
      if (!this.inPlay) return;
      if (table.pocketable(this.xPos, this.yPos)){
        this.stop();
        this.isPlay = false;
      }
      this.xVel += this.xAcc;
      this.yVel += this.yAcc;
      this.xVel *= this.friction;
      this.yVel *= this.friction;
      if (Math.hypot(this.xVel, this.yVel) < 0.1){
        this.xVel = 0;
        this.yVel = 0;
      }
      this.xPos += this.xVel;
      this.yPos += this.yVel;
      // bounce off walls
      if (this.xPos < 0){
        this.xPos = 0;
        this.xVel *= -1;
      }
      if (this.yPos < 0){
        this.yPos = 0;
        this.yVel *= -1;
      }
      if (this.xPos > canvas.width){
        this.xPos = canvas.width;
        this.xVel *= -1;
      }
      if (this.yPos > canvas.height){
        this.yPos = canvas.height;
        this.yVel *= -1;
      }
    },
    push: function(dX, dY){
      this.xVel = dX / 20;
      this.yVel = dY / 20;
    },
    stop: function(){
      this.xVel = 0;
      this.yVel = 0;
    }
  };
  return ball;
}

function makeTable(){
  const table = 
  { 
    pocketRadius: 15,
    pocketColor: "#222222",
    pockets : [
      {x : 4, y : 4},
      {x : 4, y : canvas.height / 2},
      {x : 4, y : canvas.height - 4},
      {x : canvas.width - 4, y : 4},
      {x : canvas.width - 4, y : canvas.height / 2},
      {x : canvas.width - 4, y : canvas.height - 4}
    ],
    draw: function(){
      ctx.fillStyle  = "darkgreen";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      for (const loc of this.pockets){
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, this.pocketRadius, 0, 2 * Math.PI);
        ctx.fillStyle = this.pocketColor;
        ctx.fill();
      }
    },
    pocketable: function(ballX, ballY){
      for (const loc of this.pockets){
        if( Math.hypot(ballX - loc.x, ballY - loc.y) < this.pocketRadius){
          return true;
        }
      }
      return false;
    }
  }
  return table;
}

function animate(){
  // draw
  table.draw();
  cueball.draw();
  ball1.draw();
  ball2.draw();
  ball3.draw();
  // update
  cueball.update();
  ball1.update();
  ball2.update();
  ball3.update();
  checkCollision(cueball, ball1);
  checkCollision(cueball, ball2);
  checkCollision(cueball, ball3);
  checkCollision(ball1, ball2);
  checkCollision(ball1, ball3);
  checkCollision(ball2, ball3);

  // repeat
  window.requestAnimationFrame(animate);
}

function checkCollision(ballA, ballB){
  // check for overlap using distance formula
  const dist = Math.hypot(ballA.xPos - ballB.xPos, ballA.yPos - ballB.yPos);
  const collisionRadius = ballA.radius + ballB.radius;
  const overlap = dist - collisionRadius;
  if (overlap >= 0) return false;  // no collision
  
  // calculate angle and x,y components of overlap
  const nx = (ballB.xPos - ballA.xPos) / dist; 
  const ny = (ballB.yPos - ballA.yPos) / dist;
  
  const collisionAngle = Math.atan2(ballA.yPos - ballB.yPos, ballA.xPos - ballB.xPos);
  const xOverlap = overlap * nx; //Math.cos(collisionAngle);
  const yOverlap = overlap * ny; //Math.sin(collisionAngle);
  // move so not overlapping
  ballA.xPos -= xOverlap / 2; 
  ballA.yPos -= yOverlap / 2; 
  ballB.xPos += xOverlap / 2; 
  ballB.xPos += yOverlap / 2; 
  
  let p = (ballA.xVel * nx + ballA.yVel * ny - ballB.xVel * nx - ballB.yVel * ny); 
  ballA.xVel -= p * nx; 
  ballA.yVel -= p * ny; 
  ballB.xVel += p * nx; 
  ballB.yVel += p * ny; 
}

function setupTouch() {
  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  });
  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    processTouch();
  });
}

function processTouch() {
  let deltaX = (touchEndX - touchStartX);
  let deltaY = (touchEndY - touchStartY);
  cueball.push(deltaX, deltaY);
}










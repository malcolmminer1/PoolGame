// MAIN CODE
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

let table = makeTable();
let cueball = makeBall(160, 250, "#ffffdd");
setupTouch();
animate();

function makeBall(x, y, colorIn){
  const ball = {
    radius: 10,
    xPos: x,
    yPos: y,
    xVel: 10,
    yVel: 5.5,
    xAcc: 0,
    yAcc: 0,
    friction: 0.98,
    color: colorIn,
    draw: function(){
      ctx.beginPath();
      ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    },
    update: function(){
      if (table.pocketable(this.xPos, this.yPos)){
        this.xAcc = 0;
        this.yAcc = 0;
        this.xVel = 0;
        this.yVel = 0;
        this.xPos = 0;
        this.yPos = 0;
        this.color = "#222222";
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
      ctx.fillStyle  = "#008000";
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
          console.log("Pocketed");
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
  // update
  cueball.update();
  // repeat
  window.requestAnimationFrame(animate);
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










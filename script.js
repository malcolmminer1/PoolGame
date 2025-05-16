// MAIN CODE
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let cueball = makeBall(160, 250);

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// physics variables, but best practce is to create an object to hold these
let xPos = 100;
let yPos = 200;
let size = 30;
let xVel = 0;
let yVel = 0;
let xAcc = 0;
let yAcc = 0.1;        // gravity
let bounciness = 0.65;  // from 0 - 1

setupTouch();
animate();

function makeBall(x, y){
  const ball = {
    radius: 10,
    xPos: x,
    yPos: y,
    xVel: 0,
    yVel: 0,
    xAcc: 0,
    yAcc: 0,
    color: "#ff0000",
    draw: function(){
      ctx.beginPath();
      ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    },
    update: function(){
      this.xVel += this.xAcc;
      this.yVel += this.yAcc;
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


function animate(){
  // draw
  ctx.clearRect(0,0,canvas.width,canvas.height);
  cueball.draw();
  // update
  cueball.update();
  // repeat
  window.requestAnimationFrame(animate);
}

function drawChar(x, y) {
  // body
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, 2 * Math.PI);
  ctx.fillStyle = "#003388"
  ctx.fill();
  // left eye
  ctx.beginPath();
  ctx.arc(x - 15, y - 10, 12, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff"
  ctx.fill();
  // left pupil
  ctx.beginPath();
  ctx.arc(x - 15, y - 5, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "#000000"
  ctx.fill();
  // right eye
  ctx.beginPath();
  ctx.arc(x + 15, y - 10, 12, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff"
  ctx.fill();
  // right pupil
  ctx.beginPath();
  ctx.arc(x + 15, y - 5, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "#000000"
  ctx.fill();
  // nose
  ctx.beginPath();
  ctx.arc(x, y + 4, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "#FF8888"
  ctx.fill();
  // mouth
  ctx.beginPath();
  ctx.arc(x, y - 10, 30, 1.2, 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#FF8888";
  ctx.stroke();
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











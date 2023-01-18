const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const stopBtn = document.getElementById('stopBtn');

startBtn.addEventListener("click", startAnimation);
resetBtn.addEventListener("click", resetAnimation);
stopBtn.addEventListener("click", stopAnimation);

let animationId;
let isRunning = true;

function startAnimation() {
  if(!isRunning) {

    animationId = requestAnimationFrame(draw);
    startBtn.setAttribute("disabled", "true");
    isRunning = true;
}
}

function resetAnimation() {
    cancelAnimationFrame(animationId);
    balls.forEach(ball => {
      ball.x = Math.random() * canvas.width;
      ball.y = Math.random() * canvas.height;
      ball.vx = Math.random() * 2 - 1;
      ball.vy = Math.random() * 2 - 1;
    });
    startBtn.removeAttribute("disabled");
}

function stopAnimation() {
    isRunning = false;
    startBtn.removeAttribute('disabled')
}

const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");

widthInput.addEventListener("change", updateCanvasSize);
heightInput.addEventListener("change", updateCanvasSize);

function updateCanvasSize() {
    canvas.width = widthInput.value;
    canvas.height = heightInput.value;
    resetAnimation();
}

  // Parametry
  const X = 100; // liczba kulek
  const Y = 30; // odległość, przy której rysowana jest linia

  // Pobieranie canvas
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  // Tablica z kulami
  const balls = [];

  // Klasa reprezentująca kulę
  class Ball {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = Math.random() * 2 - 1;
      this.vy = Math.random() * 2 - 1;
    }

    // Funkcja rysująca kulę na canvas
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Funkcja aktualizująca pozycję kulki
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Odbijanie od granic canvas
      if (this.x < 0 || this.x > canvas.width) {
        this.vx = -this.vx;
      }
      if (this.y < 0 || this.y > canvas.height) {
        this.vy = -this.vy;
      }
    }
  }

  // Tworzenie kulek
  for (let i = 0; i < X; i++) {
    balls.push(new Ball());
  }

  // Rysowanie kulek i linii między nimi
  function draw() {
    if(!isRunning) return;
    else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < X; i++) {
      balls[i].draw();
      balls[i].update();

      for (let j = 0; j < X; j++) {
        if (i !== j) {
          const distance = Math.sqrt(Math.pow(balls[i].x - balls[j].x, 2) + Math.pow(balls[i].y - balls[j].y, 2));
          if (distance < Y) {
            ctx.beginPath();
           
            ctx.moveTo(balls[i].x, balls[i].y);
            ctx.lineTo(balls[j].x, balls[j].y);
            ctx.stroke();
            }
        }
      }
    }
}
requestAnimationFrame(draw);
}
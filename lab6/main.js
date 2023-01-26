const canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d"),
  startBtn = document.querySelector("#start-btn"),
  scoresDiv = document.querySelector("#scores");
canvasHandler = document.querySelector(".container");
let timeout;
canvas.width = canvasHandler.getBoundingClientRect().width;
canvas.height = canvasHandler.getBoundingClientRect().height;
const ballSize = 20;
let ball;
let holes = [];
const holesNumber = 7;
const speed = 5;
let animation;
let started = false;
let count = 0;
const holeSize = 20;
let scores = [];
let time = 60;
let maxX = canvas.width - ballSize;
let maxY = canvas.height - ballSize;
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
class Timer {
  constructor(callback, delay) {
    this.isRunning = false;
    this.start;
    this.timerId;
    this.remaining = delay + 10;
    this.runTimer;
    this.callback = callback;
    this.timer = document.querySelector("#timer");
    this.resume();
  }
  pause() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.runTimer);
      window.clearTimeout(this.timerId);
      this.timerId = null;
      this.remaining -= Date.now() - this.start;
      this.timer.innerHTML = (this.remaining / 1000).toFixed(0);
    }
  }
  resume() {
    if (this.timerId) {
      return;
    }
    this.start = Date.now();
    this.timerId = window.setTimeout(this.callback, this.remaining);
    this.startTimer();
  }
  startTimer() {
    if (!this.isRunning) {
      let time = this.remaining / 1000;
      this.isRunning = true;
      this.runTimer = setInterval(() => {
        time--;
        this.timer.innerHTML = time.toFixed(0);
        if (time <= 0) {
          this.pause();
        }
      }, 1000);
    }
  }
}
class Hole {
  constructor(radius, color) {
    this.x = randomIntFromRange(0 + radius, maxX - radius);
    this.y = randomIntFromRange(0 + radius, maxY - radius);
    this.radius = radius;
    this.color = color;
    this.distance;
    this.speed = 5;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    if (this.distance <= 0) {
      this.x = randomIntFromRange(0 + this.radius, maxX - this.radius);
      this.y = randomIntFromRange(0 + this.radius, maxY - this.radius);
    }
    holes.forEach((hole) => {
      if (
        this.x + this.radius >= hole.x - hole.radius &&
        this.x - this.radius <= hole.x + hole.radius &&
        this.y + this.radius >= hole.y - hole.radius &&
        this.y - this.radius <= hole.y + hole.radius &&
        this !== hole
      ) {
        this.x = randomIntFromRange(0 + this.radius, maxX - this.radius);
        this.y = randomIntFromRange(0 + this.radius, maxY - this.radius);
      }
    });
    if (this.x + this.radius >= canvas.width) {
      this.x = randomIntFromRange(0 + this.radius, maxX - this.radius);
      this.y = randomIntFromRange(0 + this.radius, maxY - this.radius);
    } else if (this.x - this.radius <= 0) {
      this.x = randomIntFromRange(0 + this.radius, maxX - this.radius);
      this.y = randomIntFromRange(0 + this.radius, maxY - this.radius);
    }
  }
  update() {
    this.distance =
      Math.sqrt(
        Math.pow(ball.x - this.x, 2) -
          ball.radius +
          Math.pow(ball.y - this.y, 2)
      ) -
      this.radius -
      ball.radius;
    this.draw();
  }
}
class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = 5;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
  update() {
    if (this.x + this.radius >= canvas.width) {
      this.x = canvas.width - this.radius;
    } else if (this.x - this.radius <= 0) {
      this.x = this.radius;
    }
    if (this.y + this.radius >= canvas.height) {
      this.y = canvas.height - this.radius;
    } else if (this.y - this.radius <= 0) {
      this.y = this.radius;
    }
    this.draw();
  }
}
function init() {
  ball = new Ball(canvas.width / 2, canvas.height / 2, ballSize, "red");
  for (let i = 0; i < holesNumber; i++) {
    const hole = new Hole(holeSize, "purple");
    holes.push(hole);
  }
}
function animate() {
  animation = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.update();
  holes.forEach((hole) => {
    if (hole.distance <= 0) {
      count++;
      document.querySelector("#score").innerHTML = "SCORE: " + count;
    }
    hole.update();
  });
}
function moveByPhone(e) {
  if (e.beta > 90) e.beta = 90;
  if (e.beta < -90) e.beta = -90;
  if (e.gamma > 90) e.gamma = 90;
  if (e.gamma < -90) e.gamma = -90;
  ball.y = canvas.height / 2 + (maxY * e.beta) / 45;
  ball.x = canvas.width / 2 + (maxX * e.gamma) / 45;
}
function resetVariables() {
  count = 0;
  holes = [];
  started = true;
}
function start() {
  if (!started) {
    startBtn.style.display = "none";
    clearTimeout(timeout);
    resetVariables();
    init();
    animate();
    window.addEventListener("deviceorientation", moveByPhone);
    createTimerAndScore();
    removeScoresDiv();
    timeout = new Timer(endGame, 60000);
  }
}
function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === "granted") {
          start();
        }
      })
      .catch(console.error);
    return;
  } else {
    start();
  }
}

function endGame() {
  started = false;
  cancelAnimationFrame(animation);
  window.removeEventListener("deviceorientation", moveByPhone);
  startBtn.style.display = "block";
  startBtn.innerHTML = "RESTART";
  removeTimerAndScore();
  addScoreToLocalStorage();
  createScoresDiv();
  alert("Your score is: " + count);
}
function addScoreToLocalStorage() {
  if (count === null || count === 0) return;
  scores.push(count);
  scores = scores.sort((a, b) => b - a);
  if (scores.length > 5) {
    scores.pop();
  }
  localStorage.setItem("score", scores);
}
function getScoreFromLocalStorage() {
  try {
    if (localStorage.getItem("score")) {
      scores = localStorage.getItem("score").split(",");
    }
  } catch (e) {
    console.log(e);
  }
}
getScoreFromLocalStorage();
function createTimerAndScore() {
  const timer = document.createElement("div");
  timer.id = "timer";
  timer.innerHTML = "60";
  document.body.appendChild(timer);
  const score = document.createElement("div");
  score.id = "score";
  score.innerHTML = "SCORE: 0";
  document.body.appendChild(score);
}
function removeTimerAndScore() {
  const timer = document.querySelector("#timer");
  document.body.removeChild(timer);
  const score = document.querySelector("#score");
  document.body.removeChild(score);
}
startBtn.addEventListener("click", () => {
  requestOrientationPermission();
});
startBtn.addEventListener("touchend", () => {
  requestOrientationPermission();
});
window.addEventListener("resize", () => {
  canvas.width = canvasHandler.getBoundingClientRect().width;
  canvas.height = canvasHandler.getBoundingClientRect().height;
  maxX = canvas.width - ballSize;
  maxY = canvas.height - ballSize;
});
function createScoresDiv() {
  const scoresDiv = document.createElement("div");
  scoresDiv.id = "scores";
  document.body.appendChild(scoresDiv);
  const scoresTitle = document.createElement("h2");
  scoresTitle.innerHTML = "TOP 5 SCORES";
  scoresDiv.appendChild(scoresTitle);
  const scoresList = document.createElement("ul");
  scoresList.id = "scoresList";
  scoresDiv.appendChild(scoresList);
  scores.forEach((score) => {
    const scoreItem = document.createElement("li");
    scoreItem.innerHTML = score;
    scoresList.appendChild(scoreItem);
  });
}
function removeScoresDiv() {
  const scoresDiv = document.querySelector("#scores");
  document.body.removeChild(scoresDiv);
}
createScoresDiv();
window.addEventListener("visibilitychange", () => {
  if (started) {
    if (document.visibilityState === "hidden") {
      timeout.pause();
    } else {
      timeout.resume();
    }
  }
});
const images = ["image1.jpg", "image2.jpg", "image3.jpg"];
let currentIndex = 0;

const slideshowContainer = document.querySelector(".slideshow-container");
const slideshowImage = document.querySelector(".slideshow-image");
const dotsContainer = document.querySelector(".dots-container");

// Create dots
for (let i = 0; i < images.length; i++) {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  dot.addEventListener("click", () => {
    currentIndex = i;
    changeImage();
  });
  dotsContainer.appendChild(dot);
}
const dots = document.querySelectorAll(".dot");

function changeImage() {
  slideshowImage.src = images[currentIndex];
  slideshowImage.classList.add("slide-out");
  setTimeout(() => {
    slideshowImage.classList.remove("slide-out");
  }, 500);
  updateDots();
}

function updateDots() {
  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentIndex].classList.add("active");
}

// automatic slideshow
setInterval(() => {
  currentIndex++;
  if (currentIndex === images.length) {
    currentIndex = 0;
  }
  changeImage();
}, 3000);

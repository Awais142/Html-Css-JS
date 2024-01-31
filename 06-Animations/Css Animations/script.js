// script.js

// Theme toggle
const themeSwitcher = document.getElementById("themeSwitcher");
themeSwitcher.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

// Play/Pause animations
const playPauseButton = document.getElementById("playPause");
let animationsPaused = false;

playPauseButton.addEventListener("click", () => {
  animationsPaused = !animationsPaused;
  const animationElements = document.querySelectorAll(
    ".bounce-ball, .hover-box, .scale-box"
  );

  animationElements.forEach((el) => {
    el.style.animationPlayState = animationsPaused ? "paused" : "running";
    el.style.transition = animationsPaused ? "none" : "transform 0.3s";
  });

  playPauseButton.textContent = animationsPaused
    ? "Play Animations"
    : "Pause Animations";
});

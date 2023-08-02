const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    display.textContent += button.textContent;
  });
});
let currentInput = "";
let currentOperator = null;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (isNaN(value) && value !== ".") {
      currentOperator = value;
    } else {
      currentInput += value;
      display.textContent = currentInput;
    }
  });
});
document.querySelector(".clear").addEventListener("click", () => {
  currentInput = "";
  display.textContent = "0";
});

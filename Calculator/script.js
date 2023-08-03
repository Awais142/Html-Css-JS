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
document
  .querySelector(".btn[content='decimal']")
  .addEventListener("click", () => {
    if (!currentInput.includes(".")) {
      currentInput += ".";
      display.textContent = currentInput;
    }
  });
window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (!isNaN(key) || key === ".") {
    currentInput += key;
  } else if (["+", "-", "*", "/"].includes(key)) {
    currentOperator = key;
  } else if (key === "Enter") {
    display.textContent = eval(currentInput);
    currentInput = display.textContent;
  } else if (key === "Escape") {
    currentInput = "";
    display.textContent = "0";
  }
});
function formatResult(value) {
  return parseFloat(value).toFixed(2);
}
if (currentOperator === "/" && parseFloat(currentInput) === 0) {
  display.textContent = "Error";
}
document.querySelector(".delete").addEventListener("click", () => {
  currentInput = currentInput.slice(0, -1);
  display.textContent = currentInput || "0";
});

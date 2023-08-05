// script.js
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let currentInput = "";
let currentOperator = null;
let previousInput = "";
let resultDisplayed = false;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    // Handle clear button
    if (button.classList.contains("clear")) {
      currentInput = "";
      previousInput = "";
      currentOperator = null;
      display.textContent = "0";
      resultDisplayed = false;
      return;
    }

    // Handle delete button
    if (button.classList.contains("delete")) {
      if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
      }
      display.textContent = currentInput || "0";
      return;
    }

    // Handle operator buttons
    if (button.classList.contains("operator") && value !== "=") {
      if (currentInput) {
        if (previousInput && currentOperator) {
          previousInput = calculate(
            previousInput,
            currentInput,
            currentOperator
          );
          display.textContent = previousInput;
        } else {
          previousInput = currentInput;
        }
        currentInput = "";
      }
      currentOperator = value;
      resultDisplayed = false;
      return;
    }

    // Handle equals button
    if (button.classList.contains("equals")) {
      if (currentOperator && previousInput && currentInput) {
        display.textContent = calculate(
          previousInput,
          currentInput,
          currentOperator
        );
        previousInput = display.textContent;
        currentInput = "";
        currentOperator = null;
        resultDisplayed = true;
      }
      return;
    }

    // Handle decimal input
    if (value === ".") {
      if (!currentInput.includes(".")) {
        currentInput += value;
      }
    } else if (!isNaN(value)) {
      // Handle number input
      if (resultDisplayed) {
        currentInput = value; // Start fresh after result
        resultDisplayed = false;
      } else {
        currentInput += value;
      }
    }

    display.textContent = currentInput || previousInput || "0";
  });
});

// Helper function for calculations
function calculate(prev, curr, operator) {
  let result;
  const prevNum = parseFloat(prev);
  const currNum = parseFloat(curr);

  if (isNaN(prevNum) || isNaN(currNum)) return "Error";

  switch (operator) {
    case "+":
      result = prevNum + currNum;
      break;
    case "-":
      result = prevNum - currNum;
      break;
    case "*":
      result = prevNum * currNum;
      break;
    case "/":
      result = currNum !== 0 ? prevNum / currNum : "Error";
      break;
    default:
      return "Error";
  }

  return parseFloat(result.toFixed(10)).toString(); // Limit decimals to avoid floating point errors
}

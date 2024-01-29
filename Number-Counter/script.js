// Get DOM elements
const numberDisplay = document.getElementById('number');
const message = document.getElementById('message');
const buttons = document.querySelectorAll('.btn');

// Initialize counter
let count = 0;

// Update display with animation
function updateDisplay(animate = true) {
    numberDisplay.textContent = count;
    
    // Remove existing animation classes
    numberDisplay.classList.remove('pulse', 'shake');
    
    if (animate) {
        // Add animation based on count
        if (count === 0) {
            numberDisplay.classList.add('shake');
        } else {
            numberDisplay.classList.add('pulse');
        }
    }

    // Update message and color based on count
    if (count > 0) {
        message.textContent = "Going up! 🚀";
        numberDisplay.style.color = "#51cf66";
    } else if (count < 0) {
        message.textContent = "Going down! 📉";
        numberDisplay.style.color = "#ff6b6b";
    } else {
        message.textContent = "Back to zero! 🎯";
        numberDisplay.style.color = "#4158D0";
    }
}

// Add click event listeners to buttons
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (button.classList.contains('increase')) {
            count++;
        } else if (button.classList.contains('decrease')) {
            count--;
        } else if (button.classList.contains('reset')) {
            count = 0;
        }
        
        updateDisplay();
    });
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === '+') {
        count++;
        updateDisplay();
    } else if (e.key === 'ArrowDown' || e.key === '-') {
        count--;
        updateDisplay();
    } else if (e.key === 'r' || e.key === 'R') {
        count = 0;
        updateDisplay();
    }
});

// Initialize display
updateDisplay(false);

// Get DOM elements
const textInput = document.getElementById('text-input');
const characterCount = document.getElementById('character-count');
const wordCount = document.getElementById('word-count');
const sentenceCount = document.getElementById('sentence-count');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const message = document.getElementById('message');

// Function to count words
function countWords(text) {
    // Remove extra spaces and split by spaces
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Function to count sentences
function countSentences(text) {
    // Split by period, exclamation mark, or question mark
    return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
}

// Function to update counts with animation
function updateCounts() {
    const text = textInput.value;
    
    // Update counts with animation
    updateCountWithAnimation(characterCount, text.length);
    updateCountWithAnimation(wordCount, countWords(text));
    updateCountWithAnimation(sentenceCount, countSentences(text));
}

// Function to update count with animation
function updateCountWithAnimation(element, newValue) {
    const oldValue = parseInt(element.textContent);
    if (oldValue !== newValue) {
        element.classList.remove('pulse');
        void element.offsetWidth; // Trigger reflow
        element.classList.add('pulse');
        element.textContent = newValue;
    }
}

// Function to show message
function showMessage(text, duration = 2000) {
    message.textContent = text;
    message.style.color = '#667eea';
    
    setTimeout(() => {
        message.textContent = '';
    }, duration);
}

// Event Listeners
textInput.addEventListener('input', updateCounts);

// Clear button functionality
clearBtn.addEventListener('click', () => {
    textInput.value = '';
    updateCounts();
    showMessage('Text cleared! ✨');
});

// Copy button functionality
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(textInput.value);
        showMessage('Text copied to clipboard! 📋');
    } catch (err) {
        showMessage('Failed to copy text 😕');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        clearBtn.click();
    }
    // Ctrl/Cmd + C to copy
    else if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !window.getSelection().toString()) {
        e.preventDefault();
        copyBtn.click();
    }
});

// Initialize counts
updateCounts();

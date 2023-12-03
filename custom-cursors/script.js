// Get cursor elements
const cursor = document.querySelector('.custom-cursor');
const cursorOuter = document.querySelector('.custom-cursor-outer');

// Initialize cursor position off screen
let cursorX = -100;
let cursorY = -100;

let cursorOuterX = -100;
let cursorOuterY = -100;

// Update cursor position
document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

// Animate cursor movement
function animateCursor() {
    // Smooth movement for outer cursor
    const deltaOuterX = cursorX - cursorOuterX;
    const deltaOuterY = cursorY - cursorOuterY;
    
    cursorOuterX += deltaOuterX * 0.2;
    cursorOuterY += deltaOuterY * 0.2;
    
    // Update cursor positions
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    cursorOuter.style.transform = `translate(${cursorOuterX}px, ${cursorOuterY}px)`;
    
    requestAnimationFrame(animateCursor);
}

// Start cursor animation
animateCursor();

// Handle cursor visibility
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = 1;
    cursorOuter.style.opacity = 1;
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = 0;
    cursorOuter.style.opacity = 0;
});

// Magnetic button effect
document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1.5)`;
        cursorOuter.style.transform = `translate(${cursorOuterX}px, ${cursorOuterY}px) scale(1.5)`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        cursorOuter.style.transform = `translate(${cursorOuterX}px, ${cursorOuterY}px)`;
    });
});

// Text follow effect
document.querySelectorAll('.text-follow').forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const text = element.querySelector('p');
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        text.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    element.addEventListener('mouseleave', () => {
        const text = element.querySelector('p');
        text.style.transform = '';
    });
});

// Cursor Elements
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const cursorButtons = document.querySelectorAll('.cursor-btn');
const currentCursorText = document.getElementById('current-cursor');

// Initial cursor type
document.body.setAttribute('data-cursor', 'default');

// Mouse movement handler
function onMouseMove(e) {
    const posX = e.clientX;
    const posY = e.clientY;

    // Animate cursor dot
    cursorDot.style.transform = `translate(${posX}px, ${posY}px)`;
    
    // Add slight delay to cursor outline for smooth effect
    requestAnimationFrame(() => {
        cursorOutline.style.transform = `translate(${posX}px, ${posY}px)`;
    });
}

// Mouse click animation
function onMouseDown() {
    cursorDot.style.transform += ' scale(0.5)';
    cursorOutline.style.transform += ' scale(0.75)';
}

function onMouseUp() {
    cursorDot.style.transform = cursorDot.style.transform.replace(' scale(0.5)', '');
    cursorOutline.style.transform = cursorOutline.style.transform.replace(' scale(0.75)', '');
}

// Cursor type switching
function switchCursorType(type) {
    document.body.setAttribute('data-cursor', type);
    currentCursorText.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    
    // Update active button
    cursorButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cursor === type);
    });
}

// Event listeners for cursor buttons
cursorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const cursorType = btn.dataset.cursor;
        switchCursorType(cursorType);
    });
});

// Add event listeners
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);

// Handle cursor entering/leaving elements
const handleElementHover = (element) => {
    element.addEventListener('mouseenter', () => {
        cursorDot.style.transform += ' scale(1.5)';
        cursorOutline.style.transform += ' scale(1.5)';
    });

    element.addEventListener('mouseleave', () => {
        cursorDot.style.transform = cursorDot.style.transform.replace(' scale(1.5)', '');
        cursorOutline.style.transform = cursorOutline.style.transform.replace(' scale(1.5)', '');
    });
};

// Apply hover effects to interactive elements
document.querySelectorAll('.test-btn, .test-link, .test-box').forEach(handleElementHover);

// Hide default cursor when leaving the window
document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorOutline.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';
});

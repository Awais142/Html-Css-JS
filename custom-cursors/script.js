// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Create cursor elements
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    
    // Add classes to cursor elements
    cursorDot.classList.add('cursor-dot');
    cursorOutline.classList.add('cursor-outline');
    
    // Add cursors to body
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    // Initialize cursor positions
    let mouseX = -100;
    let mouseY = -100;
    let outlineX = -100;
    let outlineY = -100;

    // Mouse movement handler
    function onMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    // Animation loop for smooth cursor movement
    function animate() {
        // Smooth movement for outline
        outlineX += (mouseX - outlineX) * 0.2;
        outlineY += (mouseY - outlineY) * 0.2;

        // Update cursor positions with transform for better performance
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;

        requestAnimationFrame(animate);
    }

    // Mouse click animation
    function onMouseDown() {
        cursorDot.classList.add('cursor-click');
        cursorOutline.classList.add('cursor-click');
    }

    function onMouseUp() {
        cursorDot.classList.remove('cursor-click');
        cursorOutline.classList.remove('cursor-click');
    }

    // Cursor type switching
    function switchCursorType(type) {
        document.body.setAttribute('data-cursor', type);
        const currentCursorText = document.getElementById('current-cursor');
        if (currentCursorText) {
            currentCursorText.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        }

        // Update active button
        document.querySelectorAll('.cursor-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.cursor === type);
        });
    }

    // Handle cursor entering/leaving elements
    function handleElementHover(element) {
        element.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-hover');
            cursorOutline.classList.add('cursor-hover');
        });

        element.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-hover');
            cursorOutline.classList.remove('cursor-hover');
        });
    }

    // Initialize event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    // Handle window events
    document.addEventListener('mouseleave', () => {
        cursorDot.classList.add('cursor-hidden');
        cursorOutline.classList.add('cursor-hidden');
    });

    document.addEventListener('mouseenter', (event) => {
        cursorDot.classList.remove('cursor-hidden');
        cursorOutline.classList.remove('cursor-hidden');
        mouseX = outlineX = event.clientX;
        mouseY = outlineY = event.clientY;
    });

    // Add click handlers to cursor buttons
    document.querySelectorAll('.cursor-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cursorType = btn.dataset.cursor;
            switchCursorType(cursorType);
        });
        handleElementHover(btn);
    });

    // Add hover effects to interactive elements
    document.querySelectorAll('.test-btn, .test-link, .test-box').forEach(handleElementHover);

    // Start animation loop
    animate();

    // Set initial cursor type
    switchCursorType('default');
});

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

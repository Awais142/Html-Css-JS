// Create cursor elements
const cursorDot = document.createElement('div');
const cursorOutline = document.createElement('div');
cursorDot.className = 'cursor-dot';
cursorOutline.className = 'cursor-outline';
document.body.appendChild(cursorDot);
document.body.appendChild(cursorOutline);

// Track mouse movement
let cursorVisible = true;
let cursorEnlarged = false;

const endX = window.innerWidth / 2;
const endY = window.innerHeight / 2;

let mouseX = endX;
let mouseY = endY;

function updateCursor(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorVisible) {
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        cursorOutline.style.transform = `translate(${mouseX - 16}px, ${mouseY - 16}px)`;
    }
}

// Handle cursor visibility
function toggleCursorVisibility() {
    if (cursorVisible === true) {
        cursorDot.style.opacity = 1;
        cursorOutline.style.opacity = 1;
    } else {
        cursorDot.style.opacity = 0;
        cursorOutline.style.opacity = 0;
    }
}

function mouseMoveEvent(e) {
    cursorVisible = true;
    toggleCursorVisibility();
    updateCursor(e);
}

function mouseLeaveEvent() {
    cursorVisible = false;
    toggleCursorVisibility();
}

function mouseEnterEvent() {
    cursorVisible = true;
    toggleCursorVisibility();
}

// Magnetic button effect
const magneticButtons = document.querySelectorAll('.magnetic-button');

magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0px, 0px)';
    });
});

// Drawing functionality
const drawingAreas = document.querySelectorAll('.drawing-area');

drawingAreas.forEach(area => {
    let isDrawing = false;
    const context = area.getContext('2d');
    
    area.addEventListener('mousedown', startDrawing);
    area.addEventListener('mousemove', draw);
    area.addEventListener('mouseup', stopDrawing);
    area.addEventListener('mouseleave', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = area.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
    }

    function stopDrawing() {
        isDrawing = false;
        context.beginPath();
    }
});

// Draggable elements
const draggableElements = document.querySelectorAll('.draggable-element');

draggableElements.forEach(element => {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('mousemove', drag);
    element.addEventListener('mouseup', dragEnd);
    element.addEventListener('mouseleave', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === element) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;

            element.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
});

// Icon cursors
const iconCursors = document.querySelectorAll('.icon-cursor');

iconCursors.forEach(element => {
    element.addEventListener('mouseenter', () => {
        const icon = element.getAttribute('data-icon');
        cursorDot.setAttribute('data-icon', icon);
    });

    element.addEventListener('mouseleave', () => {
        cursorDot.removeAttribute('data-icon');
    });
});

// Event listeners
document.addEventListener('mousemove', mouseMoveEvent);
document.addEventListener('mouseleave', mouseLeaveEvent);
document.addEventListener('mouseenter', mouseEnterEvent);

// Handle window blur
document.addEventListener('blur', () => {
    cursorVisible = false;
    toggleCursorVisibility();
});

document.addEventListener('focus', () => {
    cursorVisible = true;
    toggleCursorVisibility();
});

// Initialize canvas contexts after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    drawingAreas.forEach(area => {
        const context = area.getContext('2d');
        context.strokeStyle = '#2196f3';
        context.lineWidth = 2;
        context.lineCap = 'round';
    });
});

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Get cursor elements
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Initialize cursor positions
    let mouseX = -100;
    let mouseY = -100;
    let outlineX = -100;
    let outlineY = -100;

    // Mouse movement handler
    function onMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update dot position immediately
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }

    // Animation loop for smooth cursor movement
    function animate() {
        // Smooth movement for outline
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        // Update outline position
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

    // Set initial cursor type
    switchCursorType('default');

    // Start animation loop
    animate();
});

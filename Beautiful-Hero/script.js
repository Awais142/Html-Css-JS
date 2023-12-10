document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    shapes.forEach(shape => {
        // Create a subtle parallax effect
        const speed = 20;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        
        shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

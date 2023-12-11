document.addEventListener('DOMContentLoaded', () => {
    const bubbles = document.querySelectorAll('.bubbles span');
    
    // Randomize initial positions and delays
    bubbles.forEach(bubble => {
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDelay = `${Math.random() * 15}s`;
        bubble.style.animationDuration = `${25 + Math.random() * 15}s`;
    });

    // Add mouse parallax effect to glass card
    const glassCard = document.querySelector('.glass-card');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const xOffset = (x - 0.5) * 30;
        const yOffset = (y - 0.5) * 30;
        
        glassCard.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

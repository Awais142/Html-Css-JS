document.addEventListener('DOMContentLoaded', () => {
    // Add parallax effect to cosmic card
    const cosmicCard = document.querySelector('.cosmic-card');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const xOffset = (x - 0.5) * 20;
        const yOffset = (y - 0.5) * 20;
        
        cosmicCard.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });

    // Add shooting star effect occasionally
    setInterval(() => {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        document.querySelector('.stars').appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 1000);
    }, 3000);
});

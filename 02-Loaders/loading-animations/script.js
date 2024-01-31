document.addEventListener('DOMContentLoaded', () => {
    // Initialize cube sides with proper transforms
    const cube = document.querySelector('.creative-2 .cube');
    if (cube) {
        const sides = cube.querySelectorAll('.side');
        const transforms = [
            'rotateX(0deg) translateZ(25px)',
            'rotateX(180deg) translateZ(25px)',
            'rotateY(90deg) translateZ(25px)',
            'rotateY(-90deg) translateZ(25px)',
            'rotateX(90deg) translateZ(25px)',
            'rotateX(-90deg) translateZ(25px)'
        ];
        
        sides.forEach((side, index) => {
            side.style.transform = transforms[index];
        });
    }

    // Initialize galaxy stars with random positions
    const galaxy = document.querySelector('.creative-4 .galaxy');
    if (galaxy) {
        const stars = galaxy.querySelectorAll('.star');
        stars.forEach(star => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 5 + Math.random() * 20;
            star.style.left = `${50 + Math.cos(angle) * distance}%`;
            star.style.top = `${50 + Math.sin(angle) * distance}%`;
        });
    }

    // Add hover effect to loader cards
    const cards = document.querySelectorAll('.loader-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Initialize Newton's Cradle with proper delays
    const newtonBalls = document.querySelectorAll('.creative-3 .circle');
    newtonBalls.forEach((ball, index) => {
        ball.style.animationDelay = `${index * 0.1}s`;
    });
});

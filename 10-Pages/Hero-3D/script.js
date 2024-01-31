document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const content = document.querySelector('.content-wrapper');
    const cube = document.querySelector('.cube-container');
    
    // 3D effect on mouse move
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Calculate rotation based on mouse position
        const xRotation = (clientY - innerHeight / 2) / 50;
        const yRotation = (clientX - innerWidth / 2) / 50;
        
        // Apply rotation to content
        content.style.transform = `
            rotateX(${-xRotation}deg)
            rotateY(${yRotation}deg)
            translateZ(50px)
        `;
        
        // Parallax effect for cube
        cube.style.transform = `
            translateX(${yRotation * 2}px)
            translateY(${xRotation * 2}px)
        `;
    });
    
    // Reset transforms on mouse leave
    hero.addEventListener('mouseleave', () => {
        content.style.transform = 'translateZ(50px)';
        cube.style.transform = 'none';
    });
    
    // Add floating shapes dynamically
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDelay = Math.random() * 5;
        const randomDuration = 5 + Math.random() * 5;
        
        shape.style.left = `${randomX}%`;
        shape.style.top = `${randomY}%`;
        shape.style.animationDelay = `-${randomDelay}s`;
        shape.style.animationDuration = `${randomDuration}s`;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.card-gallery');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // View toggle functionality
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update gallery view
            gallery.className = `card-gallery ${view}-view`;
        });
    });
    
    // Add hover effect to cards
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (!gallery.classList.contains('list-view')) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.querySelector('.card-inner').style.transform = `
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale(1.05)
                `;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!gallery.classList.contains('list-view')) {
                card.querySelector('.card-inner').style.transform = '';
            }
        });
        
        // Add click event for mobile devices
        card.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                const cardInner = card.querySelector('.card-inner');
                const isFlipped = cardInner.style.transform.includes('180deg');
                
                cardInner.style.transform = isFlipped ? '' : 'rotateY(180deg)';
            }
        });
    });
    
    // Add button click effects
    const buttons = document.querySelectorAll('.card-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card flip
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

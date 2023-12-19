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
        const cardInner = card.querySelector('.card-inner');
        let isFlipped = false;

        // Mouse enter event for hover effect
        card.addEventListener('mouseenter', (e) => {
            if (!gallery.classList.contains('list-view')) {
                isFlipped = true;
                cardInner.style.transform = 'rotateY(180deg)';
            }
        });
        
        // Mouse leave event to reset
        card.addEventListener('mouseleave', () => {
            if (!gallery.classList.contains('list-view')) {
                isFlipped = false;
                cardInner.style.transform = '';
            }
        });
        
        // Touch event for mobile devices
        card.addEventListener('touchstart', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                isFlipped = !isFlipped;
                cardInner.style.transform = isFlipped ? 'rotateY(180deg)' : '';
            }
        });
    });
    
    // Add button click effects
    const buttons = document.querySelectorAll('.card-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
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

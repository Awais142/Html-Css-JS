document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('notification-container');
    const buttons = document.querySelectorAll('.trigger-btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            const template = button.nextElementSibling.cloneNode(true);
            showNotification(type, template);
        });
    });

    function showNotification(type, template) {
        const notification = template;
        notification.style.display = 'flex';
        container.appendChild(notification);

        // Initialize progress ring for alerts
        if (type.startsWith('alert')) {
            const circle = notification.querySelector('.progress-ring-circle');
            if (circle) {
                const radius = circle.r.baseVal.value;
                const circumference = radius * 2 * Math.PI;
                circle.style.strokeDasharray = `${circumference} ${circumference}`;
                circle.style.strokeDashoffset = circumference;

                // Animate progress ring
                setTimeout(() => {
                    circle.style.strokeDashoffset = 0;
                }, 10);
            }
        }

        // Add close button functionality for toasts
        const closeBtn = notification.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                removeNotification(notification);
            });
        }

        // Add action button functionality
        const actionBtns = notification.querySelectorAll('.action-btn, .accept, .decline');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Handle action button click
                console.log('Action button clicked:', btn.textContent);
                if (!type.includes('snackbar')) {
                    removeNotification(notification);
                }
            });
        });

        // Auto-remove notification after delay
        const delay = type.includes('push') ? 5000 : 3000;
        setTimeout(() => {
            removeNotification(notification);
        }, delay);
    }

    function removeNotification(notification) {
        // Add exit animation class
        notification.style.opacity = '0';
        notification.style.transform = notification.classList.contains('snackbar') 
            ? 'translateY(100%)' 
            : 'translateX(100%)';
        
        // Remove notification after animation
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    // Initialize circular progress for alerts
    const circles = document.querySelectorAll('.progress-ring-circle');
    circles.forEach(circle => {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
    });

    // Add hover effects for notification cards
    const cards = document.querySelectorAll('.notification-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Initialize random positions for push notification avatars
    const avatars = document.querySelectorAll('.push .avatar img');
    avatars.forEach(avatar => {
        const randomId = Math.floor(Math.random() * 70);
        avatar.src = `https://i.pravatar.cc/40?img=${randomId}`;
    });
});

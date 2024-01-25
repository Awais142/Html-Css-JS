// Handle custom HTML tooltips
document.querySelectorAll('.tooltip-trigger.custom, .tooltip-trigger.interactive').forEach(trigger => {
    trigger.addEventListener('mouseenter', (e) => {
        // Remove existing custom tooltips
        document.querySelectorAll('.custom-tooltip-container').forEach(el => el.remove());

        // Create tooltip container
        const tooltipContainer = document.createElement('div');
        tooltipContainer.className = 'custom-tooltip-container';
        tooltipContainer.style.cssText = `
            position: absolute;
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: ${trigger.classList.contains('interactive') ? 'auto' : 'none'};
        `;

        // Insert HTML content
        tooltipContainer.innerHTML = trigger.getAttribute('data-tooltip');

        // Position the tooltip
        document.body.appendChild(tooltipContainer);
        const triggerRect = trigger.getBoundingClientRect();
        const tooltipRect = tooltipContainer.getBoundingClientRect();

        tooltipContainer.style.top = `${triggerRect.top - tooltipRect.height - 10}px`;
        tooltipContainer.style.left = `${triggerRect.left + (triggerRect.width - tooltipRect.width) / 2}px`;

        // Show tooltip
        requestAnimationFrame(() => {
            tooltipContainer.style.opacity = '1';
        });

        // Remove tooltip on mouseleave
        const removeTooltip = () => {
            tooltipContainer.style.opacity = '0';
            setTimeout(() => tooltipContainer.remove(), 300);
            trigger.removeEventListener('mouseleave', removeTooltip);
        };

        trigger.addEventListener('mouseleave', removeTooltip);
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.tooltip-trigger').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
        `;

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add dynamic positioning for tooltips
document.querySelectorAll('.tooltip-trigger').forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
        const tooltip = trigger.querySelector('.tooltip');
        if (tooltip) {
            const triggerRect = trigger.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Check if tooltip goes beyond viewport boundaries and adjust position
            if (tooltipRect.right > viewportWidth) {
                tooltip.style.left = 'auto';
                tooltip.style.right = '0';
            }
            if (tooltipRect.bottom > viewportHeight) {
                tooltip.style.top = 'auto';
                tooltip.style.bottom = '100%';
            }
        }
    });
});

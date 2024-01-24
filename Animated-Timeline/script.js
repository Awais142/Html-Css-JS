// Select all timeline items
const timelineItems = document.querySelectorAll('.timeline-item');

// Create an Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Add show-timeline class when element is in viewport
        if (entry.isIntersecting) {
            entry.target.classList.add('show-timeline');
            
            // Optional: Trigger dot animation after content appears
            setTimeout(() => {
                const dot = entry.target.querySelector('.timeline-dot');
                dot.style.animation = 'pulse 1.5s infinite';
            }, 600);
        }
    });
}, {
    threshold: 0.2, // Trigger when 20% of item is visible
    rootMargin: '-50px' // Adds margin to viewport
});

// Observe all timeline items
timelineItems.forEach(item => {
    observer.observe(item);
});

// Optional: Smooth scroll for better experience
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add hover effect to timeline dots
const timelineDots = document.querySelectorAll('.timeline-dot');

timelineDots.forEach(dot => {
    dot.addEventListener('mouseenter', () => {
        dot.style.transform = 'translateX(-50%) scale(1.2)';
    });
    
    dot.addEventListener('mouseleave', () => {
        dot.style.transform = 'translateX(-50%) scale(1)';
    });
});

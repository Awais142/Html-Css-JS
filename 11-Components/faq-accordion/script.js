document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close all other accordion items
            const currentlyActiveItem = document.querySelector('.accordion-item.active');
            if (currentlyActiveItem && currentlyActiveItem !== item) {
                currentlyActiveItem.classList.remove('active');
            }

            // Toggle current item
            item.classList.toggle('active');
        });

        // Add keyboard accessibility
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });

    // Add keyboard navigation between items
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach((header, index) => {
        header.addEventListener('keydown', (e) => {
            let targetHeader;

            switch(e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    targetHeader = headers[index + 1] || headers[0];
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    targetHeader = headers[index - 1] || headers[headers.length - 1];
                    break;
                case 'Home':
                    e.preventDefault();
                    targetHeader = headers[0];
                    break;
                case 'End':
                    e.preventDefault();
                    targetHeader = headers[headers.length - 1];
                    break;
            }

            if (targetHeader) {
                targetHeader.focus();
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const contentPanels = document.querySelectorAll('.content');

    function switchTab(e) {
        // Remove active classes from all buttons and content panels
        tabButtons.forEach(button => button.classList.remove('active'));
        contentPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to clicked button
        const button = e.target;
        button.classList.add('active');

        // Show corresponding content panel
        const tabNumber = button.dataset.tab;
        const contentToShow = document.querySelector(`[data-content="${tabNumber}"]`);
        contentToShow.classList.add('active');
    }

    // Add click event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', switchTab);
    });

    // Keyboard navigation
    tabButtons.forEach((button, index) => {
        button.addEventListener('keydown', (e) => {
            let targetButton;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                targetButton = tabButtons[index + 1] || tabButtons[0];
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                targetButton = tabButtons[index - 1] || tabButtons[tabButtons.length - 1];
            }

            if (targetButton) {
                targetButton.focus();
                targetButton.click();
            }
        });
    });
});

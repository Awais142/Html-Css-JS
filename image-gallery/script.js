document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const gallery = document.querySelector('.gallery');
    const imageBoxes = document.querySelectorAll('.image-box');

    // Add loading animation
    gallery.classList.add('loading');
    
    // Wait for all images to load
    Promise.all(
        Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
                img.onload = img.onerror = resolve;
            }))
    ).then(() => {
        gallery.classList.remove('loading');
        initializeGallery();
    });

    function initializeGallery() {
        // Initialize Intersection Observer for fade-in animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Apply initial styles for fade-in animation
        imageBoxes.forEach(box => {
            box.style.opacity = '0';
            box.style.transform = 'translateY(20px)';
            box.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(box);
        });

        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');
                filterImages(filterValue);
            });
        });

        // Keyboard navigation for filter buttons
        filterButtons.forEach((button, index) => {
            button.addEventListener('keydown', (e) => {
                let targetButton;

                switch(e.key) {
                    case 'ArrowRight':
                        e.preventDefault();
                        targetButton = filterButtons[index + 1] || filterButtons[0];
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        targetButton = filterButtons[index - 1] || filterButtons[filterButtons.length - 1];
                        break;
                }

                if (targetButton) {
                    targetButton.focus();
                    targetButton.click();
                }
            });
        });

        // Image click handler for fullscreen preview
        imageBoxes.forEach(box => {
            box.addEventListener('click', () => {
                createFullscreenPreview(box.querySelector('img').src);
            });
        });
    }

    function filterImages(category) {
        gallery.classList.add('fade');
        
        setTimeout(() => {
            imageBoxes.forEach(box => {
                const boxCategory = box.getAttribute('data-category');
                if (category === 'all' || category === boxCategory) {
                    box.classList.remove('hide');
                } else {
                    box.classList.add('hide');
                }
            });
            
            gallery.classList.remove('fade');
        }, 300);
    }

    function createFullscreenPreview(imgSrc) {
        const preview = document.createElement('div');
        preview.className = 'fullscreen-preview';
        preview.innerHTML = `
            <div class="preview-content">
                <img src="${imgSrc}" alt="Preview">
                <button class="close-preview">&times;</button>
            </div>
        `;

        // Add styles for fullscreen preview
        const styles = document.createElement('style');
        styles.textContent = `
            .fullscreen-preview {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .fullscreen-preview.active {
                opacity: 1;
            }
            .preview-content {
                position: relative;
                max-width: 90%;
                max-height: 90vh;
            }
            .preview-content img {
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
            }
            .close-preview {
                position: absolute;
                top: -40px;
                right: -40px;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 10px;
            }
        `;
        document.head.appendChild(styles);
        document.body.appendChild(preview);

        // Animate preview
        requestAnimationFrame(() => {
            preview.classList.add('active');
        });

        // Close preview handlers
        const closePreview = () => {
            preview.classList.remove('active');
            setTimeout(() => {
                preview.remove();
            }, 300);
        };

        preview.querySelector('.close-preview').addEventListener('click', closePreview);
        preview.addEventListener('click', (e) => {
            if (e.target === preview) {
                closePreview();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closePreview();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements
    const typingText = document.querySelector('.typing-text');
    const controlBtns = document.querySelectorAll('.control-btn');
    const textContainers = document.querySelectorAll('.text-container');
    const customText = document.getElementById('custom-text');
    const animateBtn = document.getElementById('animate-btn');
    const themeBtn = document.getElementById('theme-btn');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const fontSelector = document.getElementById('font-selector');
    const colorPicker = document.getElementById('color-picker');
    const presetBtns = document.querySelectorAll('.preset-btn');

    // Theme toggle
    themeBtn.addEventListener('click', () => {
        document.body.setAttribute('data-theme',
            document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
        );
        themeBtn.querySelector('i').classList.toggle('fa-moon');
        themeBtn.querySelector('i').classList.toggle('fa-sun');
    });

    // Animation speed control
    speedSlider.addEventListener('input', (e) => {
        const speed = e.target.value;
        speedValue.textContent = `${speed}x`;
        document.documentElement.style.setProperty('--animation-speed', `${1/speed}s`);
    });

    // Function to split text into spans with delay indices
    function splitText(element) {
        const text = element.textContent.trim();
        element.textContent = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.setProperty('--i', i);
            element.appendChild(span);
        });
    }

    // Function to apply animation
    function applyAnimation(element, animationType) {
        // Remove all animation classes
        element.classList.remove('typing', 'wave', 'bounce', 'fade', 'glitch', 'rainbow', 'shake', 'neon');
        
        // Reset the text if it was split
        const originalText = element.getAttribute('data-original-text') || element.textContent;
        element.textContent = originalText;

        // Apply new animation
        switch (animationType) {
            case 'typing':
                element.classList.add('typing');
                break;
            case 'wave':
            case 'bounce':
            case 'fade':
            case 'rainbow':
                splitText(element);
                element.classList.add(animationType);
                break;
            case 'glitch':
                element.setAttribute('data-text', originalText);
                element.classList.add('glitch');
                break;
            case 'shake':
                element.classList.add('shake');
                break;
            case 'neon':
                element.classList.add('neon');
                break;
        }
    }

    // Initialize typing animation
    typingText.setAttribute('data-original-text', typingText.textContent);
    applyAnimation(typingText, 'typing');

    // Control button click handlers
    controlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            controlBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Apply animation
            const animationType = btn.getAttribute('data-animation');
            applyAnimation(typingText, animationType);
        });
    });

    // Interactive text hover effects
    textContainers.forEach(container => {
        container.setAttribute('data-original-text', container.textContent);
        
        container.addEventListener('mouseenter', () => {
            applyAnimation(container, 'wave');
        });

        container.addEventListener('mouseleave', () => {
            container.textContent = container.getAttribute('data-original-text');
        });

        container.addEventListener('click', () => {
            applyAnimation(container, 'glitch');
        });
    });

    // Function to create animated text element
    function createAnimatedText(text) {
        const newText = document.createElement('div');
        newText.className = 'text-container';
        newText.textContent = text;
        newText.setAttribute('data-original-text', text);
        
        // Apply custom styles
        newText.style.fontFamily = fontSelector.value;
        newText.style.color = colorPicker.value;
        
        // Add to interactive text section
        document.querySelector('.interactive-text').appendChild(newText);
        
        // Apply random animation
        const animations = ['wave', 'bounce', 'fade', 'glitch', 'rainbow', 'shake', 'neon'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        applyAnimation(newText, randomAnimation);

        // Add interaction handlers
        newText.addEventListener('mouseenter', () => {
            applyAnimation(newText, 'wave');
        });

        newText.addEventListener('mouseleave', () => {
            newText.textContent = text;
            newText.style.fontFamily = fontSelector.value;
            newText.style.color = colorPicker.value;
        });

        newText.addEventListener('click', () => {
            applyAnimation(newText, 'glitch');
        });
    }

    // Custom text animation
    animateBtn.addEventListener('click', () => {
        const text = customText.value.trim();
        if (text) {
            createAnimatedText(text);
            customText.value = '';
        }
    });

    // Preset text buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const presetText = btn.getAttribute('data-text');
            createAnimatedText(presetText);
        });
    });

    // Allow Enter key to trigger animation
    customText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            animateBtn.click();
        }
    });

    // Initialize animation speed
    document.documentElement.style.setProperty('--animation-speed', '1s');
});

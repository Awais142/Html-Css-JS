document.addEventListener('DOMContentLoaded', () => {
    // Chart Configuration
    Chart.defaults.color = '#fff';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue',
                data: [65000, 59000, 80000, 81000, 76000, 95000],
                borderColor: '#6c5ce7',
                backgroundColor: 'rgba(108, 92, 231, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });

    // User Activity Chart
    const userActivityCtx = document.getElementById('userActivityChart').getContext('2d');
    const userActivityChart = new Chart(userActivityCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Active Users',
                data: [1200, 1900, 1500, 2100, 1800, 1400, 1300],
                backgroundColor: '#a55eea',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Chart Period Toggles
    const revenueButtons = document.querySelectorAll('.chart-container:first-child .chart-actions button');
    revenueButtons.forEach(button => {
        button.addEventListener('click', () => {
            revenueButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            updateRevenueChart(button.textContent.toLowerCase());
        });
    });

    const userActivityButtons = document.querySelectorAll('.chart-container:last-child .chart-actions button');
    userActivityButtons.forEach(button => {
        button.addEventListener('click', () => {
            userActivityButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            updateUserActivityChart(button.textContent.toLowerCase());
        });
    });

    // Sample data for different periods
    function updateRevenueChart(period) {
        updateChartWithLoading(revenueChart, () => {
            const data = {
                weekly: [15000, 18000, 21000, 19000, 22000, 25000],
                monthly: [65000, 59000, 80000, 81000, 76000, 95000],
                yearly: [800000, 900000, 1100000, 1050000, 1200000, 1300000]
            };

            const labels = {
                weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                yearly: ['2018', '2019', '2020', '2021', '2022', '2023']
            };

            revenueChart.data.labels = labels[period];
            revenueChart.data.datasets[0].data = data[period];
            revenueChart.update('active');
        });
    }

    function updateUserActivityChart(period) {
        updateChartWithLoading(userActivityChart, () => {
            const data = {
                daily: [1200, 1900, 1500, 2100, 1800, 1400, 1300],
                weekly: [8500, 9200, 9800, 8900, 9500, 9100, 8800]
            };

            const labels = {
                daily: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                weekly: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
            };

            userActivityChart.data.labels = labels[period];
            userActivityChart.data.datasets[0].data = data[period];
            userActivityChart.update('active');
        });
    }

    // Animation Utilities
    function animateNumber(element, start, end, duration) {
        let current = start;
        const range = end - start;
        const increment = range / (duration / 16);
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = formatNumber(Math.round(current));
        }, 16);
    }

    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Animate statistics on load
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const endValue = parseInt(stat.textContent.replace(/[^0-9.-]+/g, ""));
        stat.textContent = '0';
        animateNumber(stat, 0, endValue, 1500);
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '20px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.stat-card, .chart-container').forEach(el => {
        observer.observe(el);
    });

    // Add loading animation
    function showLoading(element) {
        element.classList.add('loading');
    }

    function hideLoading(element) {
        element.classList.remove('loading');
    }

    // Add loading state during chart updates
    function updateChartWithLoading(chart, updateFn) {
        const container = chart.canvas.parentElement;
        showLoading(container);
        
        setTimeout(() => {
            updateFn();
            hideLoading(container);
        }, 600);
    }

    // Add hover effect to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Initialize tooltips for notifications
    const notifications = document.querySelector('.notifications');
    notifications.addEventListener('click', () => {
        // Add notification functionality here
        console.log('Notifications clicked');
    });

    // Theme toggle functionality
    const themeBtn = document.getElementById('theme-btn');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeBtn.querySelector('i').classList.toggle('fa-sun');
        themeBtn.querySelector('i').classList.toggle('fa-moon');
    });

    // Add smooth scrolling for navigation
    document.querySelectorAll('nav li').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(item.getAttribute('data-target'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Notification System
    const notificationPanel = document.querySelector('.notification-panel');
    const notificationBtn = document.querySelector('.notifications');
    const notificationList = document.querySelector('.notification-list');
    const clearAllBtn = document.querySelector('.clear-all');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Profile Dropdown
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileBtn = document.querySelector('.profile');

    // Toggle Notification Panel
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (profileDropdown.classList.contains('show')) {
            profileDropdown.classList.remove('show');
        }
        notificationPanel.classList.toggle('show');
        overlay.classList.toggle('show');
        updateNotificationBadge();
    });

    // Toggle Profile Dropdown
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (notificationPanel.classList.contains('show')) {
            notificationPanel.classList.remove('show');
        }
        profileDropdown.classList.toggle('show');
        overlay.classList.toggle('show');
    });

    // Close panels when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
            notificationPanel.classList.remove('show');
        }
        if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
        if (!notificationPanel.classList.contains('show') && !profileDropdown.classList.contains('show')) {
            overlay.classList.remove('show');
        }
    });

    // Mark notification as read
    document.querySelectorAll('.mark-read').forEach(button => {
        button.addEventListener('click', (e) => {
            const notification = e.target.closest('.notification-item');
            notification.classList.remove('unread');
            button.style.display = 'none';
            updateNotificationBadge();
        });
    });

    // Clear all notifications
    clearAllBtn.addEventListener('click', () => {
        const notifications = document.querySelectorAll('.notification-item');
        notifications.forEach(notification => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        });
        updateNotificationBadge();
    });

    // Update notification badge
    function updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notifications .badge');
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    // Add new notification
    function addNotification(icon, text, type = '') {
        const notification = document.createElement('div');
        notification.className = 'notification-item unread animate-fade-in';
        notification.innerHTML = `
            <div class="notification-icon ${type}">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <p class="notification-text">${text}</p>
                <span class="notification-time">Just now</span>
            </div>
            <button class="mark-read"><i class="fas fa-check"></i></button>
        `;
        
        notificationList.insertBefore(notification, notificationList.firstChild);
        updateNotificationBadge();
    }

    // Sample notification triggers
    setInterval(() => {
        const notifications = [
            { icon: 'chart-line', text: 'New sales milestone reached!', type: 'success' },
            { icon: 'exclamation-triangle', text: 'System update required', type: 'warning' },
            { icon: 'user-plus', text: 'New user registration', type: '' }
        ];
        
        if (Math.random() < 0.3) { // 30% chance every 30 seconds
            const notification = notifications[Math.floor(Math.random() * notifications.length)];
            addNotification(notification.icon, notification.text, notification.type);
        }
    }, 30000);

    // Profile menu interactions
    document.querySelectorAll('.profile-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const action = item.textContent.trim();
            console.log(`Profile action clicked: ${action}`);
            profileDropdown.classList.remove('show');
            overlay.classList.remove('show');
        });
    });

    // Initialize notification badge
    updateNotificationBadge();
});

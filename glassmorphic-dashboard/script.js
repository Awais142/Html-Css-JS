document.addEventListener('DOMContentLoaded', () => {
    // Chart Configuration
    Chart.defaults.color = '#fff';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

    // Tab Switching
    const tabs = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('[data-tab]');

    function switchTab(tabId) {
        // Hide all content sections
        contentSections.forEach(section => {
            section.style.display = 'none';
        });

        // Remove active class from all tabs
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected content and activate tab
        document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(section => {
            section.style.display = 'block';
        });
        const activeTab = document.querySelector(`[data-tab-id="${tabId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab-id');
            switchTab(tabId);
        });
    });

    // Initialize Charts
    const revenueChartEl = document.getElementById('revenueChart');
    const userActivityChartEl = document.getElementById('userActivityChart');
    const trafficChartEl = document.getElementById('trafficChart');
    const demographicsChartEl = document.getElementById('demographicsChart');

    let revenueChart, userActivityChart, trafficChart, demographicsChart;

    // Revenue Chart
    if (revenueChartEl) {
        const revenueCtx = revenueChartEl.getContext('2d');
        revenueChart = new Chart(revenueCtx, {
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
    }

    // User Activity Chart
    if (userActivityChartEl) {
        const userActivityCtx = userActivityChartEl.getContext('2d');
        userActivityChart = new Chart(userActivityCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Active Users',
                    data: [120, 190, 300, 250, 200, 180, 230],
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
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
    }

    // Traffic Sources Chart (Pie)
    if (trafficChartEl) {
        const trafficCtx = trafficChartEl.getContext('2d');
        trafficChart = new Chart(trafficCtx, {
            type: 'pie',
            data: {
                labels: ['Direct', 'Social', 'Referral', 'Organic'],
                datasets: [{
                    data: [30, 25, 20, 25],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Demographics Chart (Doughnut)
    if (demographicsChartEl) {
        const demographicsCtx = demographicsChartEl.getContext('2d');
        demographicsChart = new Chart(demographicsCtx, {
            type: 'doughnut',
            data: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                datasets: [{
                    data: [15, 30, 25, 20, 10],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Chart Period Toggles
    const chartActions = document.querySelectorAll('.chart-actions button');
    chartActions.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from siblings
            const siblings = button.parentElement.children;
            Array.from(siblings).forEach(sibling => {
                sibling.classList.remove('active');
            });
            button.classList.add('active');

            // Get the period from the button text
            const period = button.textContent.toLowerCase();
            updateChartData(period);
        });
    });

    function updateChartData(period) {
        // Revenue Chart Data
        const revenueData = {
            weekly: [15000, 17000, 19000, 16000, 18000, 21000, 20000],
            monthly: [65000, 59000, 80000, 81000, 76000, 95000],
            yearly: [800000, 950000, 1100000, 980000]
        };

        // User Activity Data
        const userActivityData = {
            daily: [120, 190, 300, 250, 200, 180, 230],
            weekly: [800, 1200, 1500, 1300, 900]
        };

        if (revenueChart && period in revenueData) {
            revenueChart.data.datasets[0].data = revenueData[period];
            revenueChart.data.labels = generateLabels(period, revenueData[period].length);
            revenueChart.update();
        }

        if (userActivityChart && period in userActivityData) {
            userActivityChart.data.datasets[0].data = userActivityData[period];
            userActivityChart.data.labels = generateLabels(period, userActivityData[period].length);
            userActivityChart.update();
        }
    }

    function generateLabels(period, count) {
        const labels = {
            daily: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            weekly: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            yearly: ['2020', '2021', '2022', '2023']
        };
        return labels[period] || Array.from({length: count}, (_, i) => `Item ${i + 1}`);
    }

    // Notification System
    const notificationBell = document.querySelector('.notifications i');
    const notificationBadge = document.querySelector('.notifications .badge');
    let notificationCount = 3;

    function updateNotificationBadge() {
        if (notificationBadge) {
            notificationBadge.textContent = notificationCount;
            notificationBadge.style.display = notificationCount > 0 ? 'block' : 'none';
        }
    }

    // Random notification generation
    function generateRandomNotification() {
        const notifications = [
            'New user registered',
            'Sales target achieved',
            'System update available',
            'New message received',
            'Backup completed'
        ];
        return notifications[Math.floor(Math.random() * notifications.length)];
    }

    // Add notification click handler
    if (notificationBell) {
        notificationBell.addEventListener('click', () => {
            // Reset notification count
            notificationCount = 0;
            updateNotificationBadge();

            // Show notification panel (you can implement a custom panel)
            alert('Notifications cleared!');
        });

        // Add random notification every 30 seconds
        setInterval(() => {
            if (notificationCount < 9) {  // Cap at 9 notifications
                notificationCount++;
                updateNotificationBadge();
                console.log('New notification:', generateRandomNotification());
            }
        }, 30000);
    }

    // Initialize with dashboard tab
    switchTab('dashboard');

    // Initialize notification badge if it exists
    const notificationBadgeInit = document.querySelector('.notifications .badge');
    if (notificationBadgeInit) {
        updateNotificationBadge();
    }
});

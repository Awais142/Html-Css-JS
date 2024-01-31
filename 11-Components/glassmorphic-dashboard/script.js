document.addEventListener('DOMContentLoaded', () => {
    // Initialize Chart.js global settings
    Chart.defaults.color = '#fff';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;

    // Tab Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all nav items
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Show selected tab content and activate nav item
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Reinitialize charts if switching to dashboard
        if (tabId === 'dashboard') {
            initializeCharts();
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Chart Data
    const chartData = {
        revenue: {
            weekly: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [3200, 4100, 3800, 5200, 4800, 4300, 5800]
            },
            monthly: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                data: [33000, 38000, 35000, 42000, 39000, 48000]
            },
            yearly: {
                labels: ['2019', '2020', '2021', '2022', '2023'],
                data: [380000, 420000, 390000, 450000, 480000]
            }
        },
        userActivity: {
            daily: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [120, 150, 180, 140, 160, 190, 170]
            },
            weekly: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [850, 920, 880, 950]
            }
        },
        traffic: {
            labels: ['Direct', 'Social', 'Referral', 'Organic'],
            data: [30, 25, 20, 25]
        },
        demographics: {
            labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
            data: [15, 30, 25, 20, 10]
        }
    };

    // Initialize Charts
    function initializeCharts() {
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
        if (revenueCtx) {
            if (window.revenueChart) window.revenueChart.destroy();
            window.revenueChart = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: chartData.revenue.weekly.labels,
                    datasets: [{
                        label: 'Revenue',
                        data: chartData.revenue.weekly.data,
                        borderColor: '#6c5ce7',
                        backgroundColor: 'rgba(108, 92, 231, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
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
        const userActivityCtx = document.getElementById('userActivityChart')?.getContext('2d');
        if (userActivityCtx) {
            if (window.userActivityChart) window.userActivityChart.destroy();
            window.userActivityChart = new Chart(userActivityCtx, {
                type: 'bar',
                data: {
                    labels: chartData.userActivity.daily.labels,
                    datasets: [{
                        label: 'Active Users',
                        data: chartData.userActivity.daily.data,
                        backgroundColor: 'rgba(153, 102, 255, 0.5)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
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

        // Traffic Sources Chart
        const trafficCtx = document.getElementById('trafficChart')?.getContext('2d');
        if (trafficCtx) {
            if (window.trafficChart) window.trafficChart.destroy();
            window.trafficChart = new Chart(trafficCtx, {
                type: 'pie',
                data: {
                    labels: chartData.traffic.labels,
                    datasets: [{
                        data: chartData.traffic.data,
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
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                color: '#fff'
                            }
                        }
                    }
                }
            });
        }

        // Demographics Chart
        const demographicsCtx = document.getElementById('demographicsChart')?.getContext('2d');
        if (demographicsCtx) {
            if (window.demographicsChart) window.demographicsChart.destroy();
            window.demographicsChart = new Chart(demographicsCtx, {
                type: 'doughnut',
                data: {
                    labels: chartData.demographics.labels,
                    datasets: [{
                        data: chartData.demographics.data,
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
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                color: '#fff'
                            }
                        }
                    }
                }
            });
        }
    }

    // Chart Period Toggles
    const chartActions = document.querySelectorAll('.chart-actions button');
    chartActions.forEach(button => {
        button.addEventListener('click', (e) => {
            const chartCard = e.target.closest('.chart-card');
            const buttons = chartCard.querySelectorAll('button');
            const period = e.target.dataset.period;
            const chartId = chartCard.querySelector('canvas').id;

            // Update active button
            buttons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            // Update chart data
            updateChartData(chartId, period);
        });
    });

    function updateChartData(chartId, period) {
        if (chartId === 'revenueChart' && window.revenueChart) {
            const data = chartData.revenue[period];
            window.revenueChart.data.labels = data.labels;
            window.revenueChart.data.datasets[0].data = data.data;
            window.revenueChart.update();
        } else if (chartId === 'userActivityChart' && window.userActivityChart) {
            const data = chartData.userActivity[period];
            window.userActivityChart.data.labels = data.labels;
            window.userActivityChart.data.datasets[0].data = data.data;
            window.userActivityChart.update();
        }
    }

    // Notification System
    let notificationCount = 3;
    const notificationBadge = document.querySelector('.badge');
    const notificationBell = document.querySelector('.notifications i');

    function updateNotificationBadge() {
        if (notificationBadge) {
            notificationBadge.textContent = notificationCount;
            notificationBadge.style.display = notificationCount > 0 ? 'flex' : 'none';
        }
    }

    if (notificationBell) {
        notificationBell.addEventListener('click', () => {
            notificationCount = 0;
            updateNotificationBadge();
        });
    }

    // Generate random notifications periodically
    function generateRandomNotification() {
        const messages = [
            'New user registered',
            'Sales target achieved',
            'System update available',
            'New message received'
        ];
        notificationCount++;
        updateNotificationBadge();
    }

    setInterval(generateRandomNotification, 30000);

    // Initialize dashboard
    initializeCharts();
});

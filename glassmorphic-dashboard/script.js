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
        revenueChart.update();
    }

    function updateUserActivityChart(period) {
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
        userActivityChart.update();
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
});

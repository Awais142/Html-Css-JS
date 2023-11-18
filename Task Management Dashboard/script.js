// Task Management Dashboard - Core Functionality

// Default Categories
const defaultCategories = [
    { id: 'Work', name: 'Work', color: '#4a90e2' },
    { id: 'Personal', name: 'Personal', color: '#27ae60' },
    { id: 'Shopping', name: 'Shopping', color: '#f39c12' },
    { id: 'Health', name: 'Health', color: '#e74c3c' },
    { id: 'Education', name: 'Education', color: '#9b59b6' },
    { id: 'Meetings', name: 'Meetings', color: '#34495e' },
    { id: 'Documentation', name: 'Documentation', color: '#95a5a6' }
];

// Global variables
let tasks = [];
let currentFilter = 'all';
let currentView = 'dashboard';

// DOM Elements
const addTaskBtn = document.getElementById('addTaskBtn');
const addTaskModal = document.getElementById('addTaskModal');
const editTaskModal = document.getElementById('editTaskModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const cancelModalBtns = document.querySelectorAll('.cancel-modal');
const addTaskForm = document.getElementById('addTaskForm');
const editTaskForm = document.getElementById('editTaskForm');
const taskList = document.querySelector('.task-list');
const searchInput = document.querySelector('.search-bar input');
const taskFilters = document.querySelectorAll('.task-filters button');
const closeEditModalBtn = document.querySelector('#editTaskModal .close-modal');
const cancelEditModalBtn = document.querySelector('#editTaskModal .cancel-modal');

// Initialize application
function initializeApp() {
    loadTasksFromStorage();
    initializeEventListeners();
    updateTaskList();
    updateStats();
    showView('dashboard');
}

// Initialize all event listeners
function initializeEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.currentTarget.getAttribute('data-view');
            showView(view);
            
            // Update active state
            document.querySelectorAll('.sidebar-nav li').forEach(item => item.classList.remove('active'));
            e.currentTarget.parentElement.classList.add('active');
        });
    });

    // Task Filters
    document.querySelectorAll('.task-filters button').forEach(button => {
        button.addEventListener('click', (e) => {
            currentFilter = e.target.getAttribute('data-filter') || 'all';
            // Update active state
            document.querySelectorAll('.task-filters button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            updateTaskList();
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            updateTaskList(e.target.value.trim());
        });
    }

    // Add Task Button
    const addTaskBtn = document.getElementById('addTaskBtn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => showModal('addTaskModal'));
    }

    // Modal Close Buttons
    document.querySelectorAll('.close-modal, .cancel-modal').forEach(btn => {
        btn.addEventListener('click', () => hideModal());
    });

    // Form Submissions
    const addTaskForm = document.getElementById('addTaskForm');
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = validateForm(addTaskForm);
            if (formData) {
                createTask(formData);
                hideModal();
                showNotification('Task created successfully!');
                addTaskForm.reset();
            }
        });
    }

    // Task List Event Delegation
    const taskList = document.querySelector('.task-list');
    if (taskList) {
        taskList.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;

            const taskId = parseInt(taskItem.getAttribute('data-id'));
            
            if (e.target.classList.contains('delete-task')) {
                deleteTaskWithConfirmation(taskId);
            } else if (e.target.classList.contains('edit-task')) {
                editTask(taskId);
            } else if (e.target.classList.contains('toggle-status')) {
                toggleTaskStatus(taskId);
            }
        });
    }
}

// View Management
function showView(view) {
    currentView = view;
    const views = {
        'dashboard': showDashboardView,
        'tasks': showTasksView,
        'calendar': showCalendarView,
        'reports': showReportsView,
        'settings': showSettingsView
    };

    if (views[view]) {
        views[view]();
    }
}

function showDashboardView() {
    const mainContent = document.querySelector('.dashboard-content');
    mainContent.innerHTML = `
        <section class="quick-stats"></section>
        <section class="task-section">
            <h2>My Tasks</h2>
            <div class="task-filters">
                <button data-filter="all" class="active">All</button>
                <button data-filter="pending">In Progress</button>
                <button data-filter="completed">Completed</button>
            </div>
            <div class="task-list"></div>
        </section>
    `;
    updateStats();
    updateTaskList();
}

function showTasksView() {
    const mainContent = document.querySelector('.dashboard-content');
    mainContent.innerHTML = `
        <section class="task-section">
            <h2>Task Management</h2>
            <div class="task-filters">
                <button data-filter="all" class="active">All Tasks</button>
                <button data-filter="pending">In Progress</button>
                <button data-filter="completed">Completed</button>
            </div>
            <div class="task-list"></div>
        </section>
    `;
    updateTaskList();
}

function showCalendarView() {
    const mainContent = document.querySelector('.dashboard-content');
    mainContent.innerHTML = `
        <section class="calendar-section">
            <h2>Calendar View</h2>
            <p>Calendar view is coming soon!</p>
        </section>
    `;
}

function showReportsView() {
    const mainContent = document.querySelector('.dashboard-content');
    mainContent.innerHTML = `
        <section class="reports-section">
            <h2>Reports & Analytics</h2>
            <p>Reports feature is coming soon!</p>
        </section>
    `;
}

function showSettingsView() {
    const mainContent = document.querySelector('.dashboard-content');
    mainContent.innerHTML = `
        <section class="settings-section">
            <h2>Settings</h2>
            <p>Settings configuration will be available soon!</p>
        </section>
    `;
}

// Modal Functions
function showModal(modal) {
    const modalElement = document.getElementById(modal);
    modalElement.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (modal === 'addTaskModal') {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('taskDueDate').min = today;
        setTimeout(() => document.getElementById('taskTitle').focus(), 300);
    }
}

function hideModal() {
    addTaskModal.classList.remove('active');
    editTaskModal.classList.remove('active');
    document.body.style.overflow = '';
    addTaskForm.reset();
    editTaskForm.reset();
    clearValidation();
}

// Task Management Functions
function createTask(formData) {
    const task = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate,
        status: formData.status,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasksToStorage();
    updateTaskList();
    updateStats();
    return task;
}

function updateTask(taskId, formData) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: formData.get('editTaskTitle').trim(),
            description: formData.get('editTaskDescription').trim(),
            priority: formData.get('editTaskPriority'),
            category: formData.get('editTaskCategory'),
            dueDate: formData.get('editTaskDueDate')
        };
        saveTasksToStorage();
        updateTaskList();
        updateStats();
    }
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description;
        document.getElementById('editTaskPriority').value = task.priority;
        document.getElementById('editTaskCategory').value = task.category;
        document.getElementById('editTaskDueDate').value = task.dueDate;
        showModal('editTaskModal');
    }
}

function deleteTaskWithConfirmation(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        deleteTask(taskId);
        showNotification('Task deleted successfully!');
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToStorage();
    updateTaskList();
    updateStats();
}

function toggleTaskStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        saveTasksToStorage();
        updateTaskList();
        updateStats();
    }
}

// Storage Functions
function saveTasksToStorage() {
    withStorageErrorHandling(() => localStorage.setItem('tasks', JSON.stringify(tasks)));
}

function loadTasksFromStorage() {
    try {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        } else {
            // Initialize with sample tasks if no tasks exist
            tasks = [
                {
                    id: Date.now() - 500000,
                    title: "Complete Project Presentation",
                    description: "Prepare and finalize the quarterly project presentation",
                    priority: "high",
                    category: "Work",
                    dueDate: "2024-01-20",
                    status: "completed",
                    createdAt: new Date(Date.now() - 500000).toISOString()
                },
                {
                    id: Date.now() - 400000,
                    title: "Weekly Team Meeting",
                    description: "Review project progress and discuss upcoming milestones",
                    priority: "medium",
                    category: "Meetings",
                    dueDate: "2024-01-25",
                    status: "pending",
                    createdAt: new Date(Date.now() - 400000).toISOString()
                },
                {
                    id: Date.now() - 300000,
                    title: "Grocery Shopping",
                    description: "Buy weekly groceries and household items",
                    priority: "low",
                    category: "Shopping",
                    dueDate: "2024-01-15",
                    status: "completed",
                    createdAt: new Date(Date.now() - 300000).toISOString()
                },
                {
                    id: Date.now() - 200000,
                    title: "Gym Session",
                    description: "Complete weekly workout routine",
                    priority: "medium",
                    category: "Health",
                    dueDate: "2024-01-18",
                    status: "pending",
                    createdAt: new Date(Date.now() - 200000).toISOString()
                },
                {
                    id: Date.now() - 100000,
                    title: "Learn React Framework",
                    description: "Complete online course modules for React",
                    priority: "high",
                    category: "Education",
                    dueDate: "2024-01-30",
                    status: "pending",
                    createdAt: new Date(Date.now() - 100000).toISOString()
                }
            ];
            saveTasksToStorage();
        }
        updateTaskList();
        updateStats();
    } catch (error) {
        console.error('Error loading tasks:', error);
        showNotification('Error loading tasks. Please try again.', 'error');
    }
}

// UI Update Functions
function updateTaskList(searchTerm = '') {
    let filteredTasks = tasks;

    // Apply search filter
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
    }

    // Apply status filter
    if (currentFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task =>
            currentFilter === 'completed' ? task.status === 'completed' : task.status === 'pending'
        );
    }

    renderTaskList(filteredTasks);
}

function renderTaskList(filteredTasks) {
    const taskListElement = document.querySelector('.task-list');
    
    if (!filteredTasks.length) {
        taskListElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>No tasks found</p>
            </div>
        `;
        return;
    }

    taskListElement.innerHTML = filteredTasks.map(task => `
        <div class="task-card ${task.status}" data-id="${task.id}">
            <div class="priority-indicator ${task.priority}"></div>
            <div class="task-content">
                <h3 class="task-title">${task.title}</h3>
                <p class="task-description">${task.description}</p>
                <div class="task-meta">
                    <span><i class="fas fa-tag"></i> ${task.category}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDueDate(task.dueDate)}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="toggle-status" onclick="toggleTaskStatus(${task.id})" title="${task.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}">
                    <i class="fas fa-${task.status === 'completed' ? 'undo' : 'check'}"></i>
                </button>
                <button class="edit-task" onclick="editTask(${task.id})" title="Edit Task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-task" onclick="deleteTaskWithConfirmation(${task.id})" title="Delete Task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = totalTasks - completedTasks;

    document.querySelector('.quick-stats').innerHTML = `
        <div class="stat-card total">
            <div class="stat-icon">
                <i class="fas fa-tasks"></i>
            </div>
            <div class="stat-details">
                <h3>Total Tasks</h3>
                <p class="stat-value">${totalTasks}</p>
            </div>
        </div>
        <div class="stat-card pending">
            <div class="stat-icon">
                <i class="fas fa-clock"></i>
            </div>
            <div class="stat-details">
                <h3>Pending</h3>
                <p class="stat-value">${pendingTasks}</p>
            </div>
        </div>
        <div class="stat-card completed">
            <div class="stat-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-details">
                <h3>Completed</h3>
                <p class="stat-value">${completedTasks}</p>
            </div>
        </div>
    `;
}

// Utility Functions
function validateForm(form) {
    const fields = {
        title: form.querySelector('#taskTitle'),
        description: form.querySelector('#taskDescription'),
        dueDate: form.querySelector('#taskDueDate'),
        priority: form.querySelector('#taskPriority'),
        category: form.querySelector('#taskCategory')
    };

    // Check if all fields exist
    for (const [fieldName, element] of Object.entries(fields)) {
        if (!element) {
            console.error(`Field ${fieldName} not found in form`);
            showNotification(`Error: Form field ${fieldName} is missing`, 'error');
            return false;
        }
    }

    clearValidation();
    
    // Required field validation
    if (!fields.title.value.trim()) {
        showError('taskTitle', 'Title is required');
        return false;
    }
    
    if (!fields.dueDate.value) {
        showError('taskDueDate', 'Due date is required');
        return false;
    }

    return {
        title: fields.title.value.trim(),
        description: fields.description.value.trim(),
        dueDate: fields.dueDate.value,
        priority: fields.priority.value,
        category: fields.category.value,
        status: 'pending'
    };
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearValidation() {
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
}

function formatDueDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

function withStorageErrorHandling(operation) {
    try {
        return operation();
    } catch (error) {
        console.error('Storage operation failed:', error);
        if (error.name === 'QuotaExceededError') {
            showNotification('Storage quota exceeded. Please clear some tasks.', 'error');
        } else {
            showNotification('An error occurred while saving tasks.', 'error');
        }
        return null;
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});
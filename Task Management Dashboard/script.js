// Task Management Dashboard - Core Functionality

// DOM Elements
const addTaskBtn = document.getElementById('addTaskBtn');
const addTaskModal = document.getElementById('addTaskModal');
const closeModalBtn = document.querySelector('.close-modal');
const cancelModalBtn = document.querySelector('.cancel-modal');
const addTaskForm = document.getElementById('addTaskForm');
const taskList = document.querySelector('.task-list');
const searchInput = document.querySelector('.search-bar input');
const taskFilters = document.querySelectorAll('.task-filters button');

// State Management
let tasks = [];
let currentFilter = 'all';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the dashboard
    loadTasksFromStorage();
    updateTaskList();
    updateStats();
});

// Modal Event Listeners
addTaskBtn.addEventListener('click', () => {
    addTaskModal.classList.add('active');
});

closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === addTaskModal) {
        closeModal();
    }
});

// Form Submission
addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(addTaskForm);
    
    const task = {
        id: Date.now(),
        title: formData.get('taskTitle'),
        description: formData.get('taskDescription'),
        priority: formData.get('taskPriority'),
        dueDate: formData.get('taskDueDate'),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasksToStorage();
    updateTaskList();
    updateStats();
    closeModal();
    addTaskForm.reset();
});

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    updateTaskList(searchTerm);
});

// Filter Event Listeners
taskFilters.forEach(button => {
    button.addEventListener('click', () => {
        taskFilters.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.textContent.toLowerCase();
        updateTaskList();
    });
});

// Utility Functions
function closeModal() {
    addTaskModal.classList.remove('active');
    addTaskForm.reset();
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Local Storage Functions
function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// Task Management Functions
function addTask(taskData) {
    const task = {
        id: Date.now(),
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasksToStorage();
    updateTaskList();
    updateStats();
    return task;
}

function deleteTask(taskId) {
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
        tasks.splice(index, 1);
        saveTasksToStorage();
        updateTaskList();
        updateStats();
    }
}

function toggleTaskStatus(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        saveTasksToStorage();
        updateTaskList();
        updateStats();
    }
}

function updateTaskList(searchTerm = '') {
    let filteredTasks = [...tasks];

    // Apply search filter
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
    }

    // Apply status filter
    if (currentFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => {
            if (currentFilter === 'in progress') return task.status === 'pending';
            return task.status === currentFilter;
        });
    }

    // Sort tasks by due date
    filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    // Update DOM
    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-card" data-id="${task.id}">
            <div class="task-priority ${task.priority}"></div>
            <div class="task-content">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <div class="task-meta">
                    <span class="due-date">
                        <i class="fas fa-calendar-alt"></i>
                        Due: ${formatDate(task.dueDate)}
                    </span>
                    <span class="status ${task.status}">
                        ${task.status}
                    </span>
                </div>
            </div>
            <div class="task-actions">
                <button onclick="toggleTaskStatus(${task.id})" class="btn-icon">
                    <i class="fas ${task.status === 'completed' ? 'fa-undo' : 'fa-check'}"></i>
                </button>
                <button onclick="deleteTask(${task.id})" class="btn-icon delete-task">
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
                <p>${totalTasks}</p>
            </div>
        </div>
        <div class="stat-card pending">
            <div class="stat-icon">
                <i class="fas fa-spinner"></i>
            </div>
            <div class="stat-details">
                <h3>In Progress</h3>
                <p>${pendingTasks}</p>
            </div>
        </div>
        <div class="stat-card completed">
            <div class="stat-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-details">
                <h3>Completed</h3>
                <p>${completedTasks}</p>
            </div>
        </div>
    `;
}
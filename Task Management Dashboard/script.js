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

// UI Update Functions will be added in subsequent commits
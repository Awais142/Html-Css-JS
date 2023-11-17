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

// State Management
let tasks = [];
let currentFilter = 'all';

// Event Listeners
function initializeApp() {
    loadTasksFromStorage();
    updateTaskList();
    updateStats();
    initializeKeyboardShortcuts();
    initializeServiceWorker();
}

function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        const swPath = window.location.pathname.includes('index.html') 
            ? 'sw.js' 
            : window.location.pathname + 'sw.js';
            
        navigator.serviceWorker.register(swPath)
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.error('ServiceWorker registration failed:', error);
            });
    }
}

function withStorageErrorHandling(operation) {
    try {
        return operation();
    } catch (error) {
        console.error('Storage operation failed:', error);
        if (error.name === 'QuotaExceededError') {
            showNotification('Storage quota exceeded. Please clear some tasks.', 'error');
        } else {
            showNotification('Failed to save changes. Please try again.', 'error');
        }
        return null;
    }
}

function initializeDragAndDrop() {
    const taskCards = document.querySelectorAll('.task-card');

    taskCards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragenter', handleDragEnter);
        card.addEventListener('dragleave', handleDragLeave);
        
        // Touch event support
        card.addEventListener('touchstart', handleTouchStart);
        card.addEventListener('touchmove', handleTouchMove);
        card.addEventListener('touchend', handleTouchEnd);
    });
}

function handleTouchStart(e) {
    if (e.cancelable) e.preventDefault();
    this.classList.add('dragging');
    draggedTask = this;
}

function handleTouchMove(e) {
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const taskCard = target?.closest('.task-card');
    
    if (taskCard && taskCard !== draggedTask) {
        const rect = taskCard.getBoundingClientRect();
        const midPoint = rect.top + rect.height / 2;
        
        if (touch.clientY < midPoint) {
            taskCard.classList.add('drop-before');
            taskCard.classList.remove('drop-after');
        } else {
            taskCard.classList.add('drop-after');
            taskCard.classList.remove('drop-before');
        }
    }
}

function handleTouchEnd(e) {
    if (e.cancelable) e.preventDefault();
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const taskCard = target?.closest('.task-card');
    
    if (taskCard && taskCard !== draggedTask) {
        handleDrop.call(taskCard, e);
    }
    
    draggedTask.classList.remove('dragging');
    clearDropTargets();
}

document.addEventListener('DOMContentLoaded', initializeApp);

// Modal Event Listeners
addTaskBtn.addEventListener('click', showModal);
closeModalBtns.forEach(button => button.addEventListener('click', hideModal));
cancelModalBtns.forEach(button => button.addEventListener('click', hideModal));

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === addTaskModal || e.target === editTaskModal) {
        hideModal();
    }
});

// Form Submission
addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const formData = new FormData(addTaskForm);
    const taskData = {
        title: formData.get('taskTitle').trim(),
        description: formData.get('taskDescription').trim(),
        priority: formData.get('taskPriority'),
        category: formData.get('taskCategory'),
        dueDate: formData.get('taskDueDate')
    };

    withStorageErrorHandling(() => createTask(formData));
    hideModal();
    showNotification('Task added successfully!');
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
function showModal() {
    addTaskModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Set minimum date to today for the due date input
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('taskDueDate').min = today;
    
    // Focus on the title input
    setTimeout(() => {
        document.getElementById('taskTitle').focus();
    }, 300);
}

function hideModal() {
    addTaskModal.classList.remove('active');
    editTaskModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    addTaskForm.reset();
    editTaskForm.reset();
    clearValidation();
}

function validateForm() {
    const title = document.getElementById('taskTitle').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;
    const category = document.getElementById('taskCategory').value;
    
    let isValid = true;
    clearValidation();

    if (title.length < 3) {
        showError('taskTitle', 'Title must be at least 3 characters long');
        isValid = false;
    }

    if (!dueDate) {
        showError('taskDueDate', 'Please select a due date');
        isValid = false;
    }

    if (!priority) {
        showError('taskPriority', 'Please select a priority level');
        isValid = false;
    }

    if (!category) {
        showError('taskCategory', 'Please select a category');
        isValid = false;
    }

    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.classList.add('error');
    field.parentNode.appendChild(errorDiv);
}

function clearValidation() {
    // Remove all error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// Local Storage Functions
function saveTasksToStorage() {
    withStorageErrorHandling(() => localStorage.setItem('tasks', JSON.stringify(tasks)));
}

function loadTasksFromStorage() {
    const storedTasks = withStorageErrorHandling(() => localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        // Initialize with sample tasks if no tasks exist
        tasks = [
            {
                id: Date.now(),
                title: "Complete Project Proposal",
                description: "Draft and finalize the project proposal for the client meeting",
                priority: "high",
                category: "Work",
                dueDate: "2024-02-15",
                status: "pending",
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 1,
                title: "Schedule Team Meeting",
                description: "Set up weekly team sync meeting",
                priority: "medium",
                category: "Meetings",
                dueDate: "2024-02-10",
                status: "completed",
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                title: "Update Documentation",
                description: "Review and update project documentation",
                priority: "low",
                category: "Documentation",
                dueDate: "2024-02-20",
                status: "pending",
                createdAt: new Date().toISOString()
            }
        ];
        saveTasksToStorage();
    }
    updateTaskList();
    updateStats();
}

// Task Management Functions
function createTask(formData) {
    const task = {
        id: Date.now(),
        title: formData.get('taskTitle').trim(),
        description: formData.get('taskDescription').trim(),
        priority: formData.get('taskPriority'),
        category: formData.get('taskCategory'),
        dueDate: formData.get('taskDueDate'),
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
        const searchTermLower = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchTermLower) ||
            task.description.toLowerCase().includes(searchTermLower)
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
                <button onclick="toggleTaskStatus(${task.id})" title="${task.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}">
                    <i class="fas fa-${task.status === 'completed' ? 'undo' : 'check'}"></i>
                </button>
                <button onclick="editTask(${task.id})" title="Edit Task">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteTaskWithConfirmation(${task.id})" title="Delete Task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Initialize drag and drop after rendering
    initializeDragAndDrop();
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

// Modal Animation and Validation Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications and form validation
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: -300px;
        background: var(--white);
        padding: 15px 20px;
        border-radius: var(--border-radius-md);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        transition: right 0.3s ease;
        z-index: 1100;
    }

    .notification.show {
        right: 20px;
    }

    .notification.success {
        border-left: 4px solid var(--success-color);
    }

    .notification.success i {
        color: var(--success-color);
    }

    .error-message {
        color: var(--danger-color);
        font-size: 0.85rem;
        margin-top: 4px;
    }

    .error {
        border-color: var(--danger-color) !important;
    }

    .form-group {
        position: relative;
    }
`;

document.head.appendChild(style);

// Task Filtering and Sorting Enhancement
let sortCriteria = 'dueDate'; // Default sort
let sortDirection = 'asc'; // Default direction

// Add sort controls HTML
const sortControlsHTML = `
<div class="task-controls">
    <div class="task-filters">
        <button class="active" data-filter="all">All</button>
        <button data-filter="in progress">In Progress</button>
        <button data-filter="completed">Completed</button>
    </div>
    <div class="sort-controls">
        <select id="sortCriteria">
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
        </select>
        <button id="sortDirection" class="btn-icon">
            <i class="fas fa-sort-amount-down"></i>
        </button>
    </div>
</div>`;

// Insert sort controls before task list
const taskSection = document.querySelector('.task-section');
taskSection.insertBefore(
    document.createRange().createContextualFragment(sortControlsHTML),
    taskList
);

// Get sort control elements
const sortCriteriaSelect = document.getElementById('sortCriteria');
const sortDirectionBtn = document.getElementById('sortDirection');
const taskFilters = document.querySelectorAll('.task-filters button');

// Sort and Filter Event Listeners
sortCriteriaSelect.addEventListener('change', (e) => {
    sortCriteria = e.target.value;
    updateTaskList();
});

sortDirectionBtn.addEventListener('click', () => {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    sortDirectionBtn.querySelector('i').className = 
        `fas fa-sort-amount-${sortDirection === 'asc' ? 'down' : 'up'}`;
    updateTaskList();
});

// Enhanced updateTaskList function
function updateTaskList(searchTerm = '') {
    let filteredTasks = [...tasks];

    // Apply search filter
    if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchTermLower) ||
            task.description.toLowerCase().includes(searchTermLower)
        );
    }

    // Apply status filter
    if (currentFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => {
            if (currentFilter === 'in progress') return task.status === 'pending';
            return task.status === currentFilter;
        });
    }

    // Enhanced sorting
    filteredTasks.sort((a, b) => {
        let compareResult = 0;
        
        switch (sortCriteria) {
            case 'dueDate':
                compareResult = new Date(a.dueDate) - new Date(b.dueDate);
                break;
            case 'priority': {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                compareResult = priorityOrder[a.priority] - priorityOrder[b.priority];
                break;
            }
            case 'title':
                compareResult = a.title.localeCompare(b.title);
                break;
            case 'status': {
                const statusOrder = { pending: 0, completed: 1 };
                compareResult = statusOrder[a.status] - statusOrder[b.status];
                break;
            }
        }
        
        return sortDirection === 'asc' ? compareResult : -compareResult;
    });

    // Update task counter with filter info
    const taskCounter = document.querySelector('.task-counter') || 
        document.createElement('div');
    taskCounter.className = 'task-counter';
    taskCounter.textContent = getTaskCounterText(filteredTasks.length, currentFilter);
    if (!taskCounter.parentElement) {
        taskSection.insertBefore(taskCounter, taskSection.firstChild);
    }

    // Render tasks
    renderTaskList(filteredTasks);
}

function getTaskCounterText(count, filter) {
    const filterText = filter === 'all' ? '' : ` ${filter}`;
    return `${count} ${count === 1 ? 'task' : 'tasks'}${filterText}`;
}

// Add styles for sort controls
const sortControlStyles = document.createElement('style');
sortControlStyles.textContent = `
    .task-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
        flex-wrap: wrap;
        gap: var(--spacing-md);
    }

    .sort-controls {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    #sortCriteria {
        padding: 8px;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-sm);
        background-color: var(--white);
        color: var(--text-color);
    }

    .task-counter {
        font-size: 0.9rem;
        color: var(--text-light);
        margin-bottom: var(--spacing-sm);
    }

    @media (max-width: 768px) {
        .task-controls {
            flex-direction: column;
            align-items: stretch;
        }

        .sort-controls {
            justify-content: flex-end;
        }
    }
`;

document.head.appendChild(sortControlStyles);

// Initialize sorting
sortCriteriaSelect.value = sortCriteria;
updateTaskList();

// Task Statistics and Visualization
function getTaskStatistics() {
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        pending: tasks.filter(t => t.status === 'pending').length,
        overdue: tasks.filter(t => t.status === 'pending' && isOverdue(t.dueDate)).length,
        priorities: {
            high: tasks.filter(t => t.priority === 'high').length,
            medium: tasks.filter(t => t.priority === 'medium').length,
            low: tasks.filter(t => t.priority === 'low').length
        },
        dueToday: tasks.filter(t => formatDueDate(t.dueDate) === 'Due Today').length,
        dueTomorrow: tasks.filter(t => formatDueDate(t.dueDate) === 'Due Tomorrow').length
    };

    stats.completion = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
    return stats;
}

// Enhanced updateStats function with visualizations
function updateStats() {
    const stats = getTaskStatistics();
    
    const quickStats = document.querySelector('.quick-stats');
    quickStats.innerHTML = `
        <div class="stat-card total">
            <div class="stat-icon">
                <i class="fas fa-tasks"></i>
            </div>
            <div class="stat-details">
                <h3>Total Tasks</h3>
                <div class="stat-value">
                    <p>${stats.total}</p>
                    <div class="completion-ring" data-percentage="${stats.completion}">
                        <svg viewBox="0 0 36 36">
                            <path d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="var(--border-color)"
                                stroke-width="2"
                            />
                            <path d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="var(--primary-color)"
                                stroke-width="2"
                                stroke-dasharray="${stats.completion}, 100"
                            />
                        </svg>
                        <span>${stats.completion}%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="stat-card pending">
            <div class="stat-icon">
                <i class="fas fa-spinner"></i>
            </div>
            <div class="stat-details">
                <h3>In Progress</h3>
                <div class="stat-value">
                    <p>${stats.pending}</p>
                    <div class="priority-bars">
                        <div class="priority-bar high" style="width: ${(stats.priorities.high / stats.total) * 100}%"></div>
                        <div class="priority-bar medium" style="width: ${(stats.priorities.medium / stats.total) * 100}%"></div>
                        <div class="priority-bar low" style="width: ${(stats.priorities.low / stats.total) * 100}%"></div>
                    </div>
                </div>
                <div class="priority-legend">
                    <span class="high">H</span>
                    <span class="medium">M</span>
                    <span class="low">L</span>
                </div>
            </div>
        </div>
        <div class="stat-card upcoming">
            <div class="stat-icon">
                <i class="fas fa-calendar-day"></i>
            </div>
            <div class="stat-details">
                <h3>Upcoming</h3>
                <div class="stat-value">
                    <div class="upcoming-tasks">
                        <div class="upcoming-item">
                            <span>Today</span>
                            <strong>${stats.dueToday}</strong>
                        </div>
                        <div class="upcoming-item">
                            <span>Tomorrow</span>
                            <strong>${stats.dueTomorrow}</strong>
                        </div>
                        <div class="upcoming-item overdue">
                            <span>Overdue</span>
                            <strong>${stats.overdue}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize completion rings animation
    initializeCompletionRings();
}

// Completion ring animation
function initializeCompletionRings() {
    document.querySelectorAll('.completion-ring').forEach(ring => {
        const percentage = ring.dataset.percentage;
        const path = ring.querySelector('path:last-child');
        path.style.strokeDasharray = '0, 100';
        
        setTimeout(() => {
            path.style.strokeDasharray = `${percentage}, 100`;
            path.style.transition = 'stroke-dasharray 1s ease';
        }, 100);
    });
}

// Add styles for statistics and visualizations
const statsStyles = document.createElement('style');
statsStyles.textContent = `
    .stat-value {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .completion-ring {
        width: 40px;
        height: 40px;
        position: relative;
    }

    .completion-ring svg {
        transform: rotate(-90deg);
    }

    .completion-ring span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.75rem;
        font-weight: 600;
    }

    .priority-bars {
        height: 4px;
        display: flex;
        margin-top: 8px;
        border-radius: var(--border-radius-sm);
        overflow: hidden;
    }

    .priority-bar {
        height: 100%;
        transition: width 0.3s ease;
    }

    .priority-bar.high { background-color: var(--danger-color); }
    .priority-bar.medium { background-color: var(--warning-color); }
    .priority-bar.low { background-color: var(--success-color); }

    .priority-legend {
        display: flex;
        gap: 8px;
        margin-top: 4px;
        font-size: 0.75rem;
    }

    .priority-legend span {
        padding: 2px 4px;
        border-radius: var(--border-radius-sm);
        color: var(--white);
    }

    .priority-legend .high { background-color: var(--danger-color); }
    .priority-legend .medium { background-color: var(--warning-color); }
    .priority-legend .low { background-color: var(--success-color); }

    .upcoming-tasks {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
    }

    .upcoming-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
    }

    .upcoming-item.overdue {
        color: var(--danger-color);
    }

    .upcoming-item span {
        font-size: 0.85rem;
    }

    .upcoming-item strong {
        font-size: 1rem;
    }
`;

document.head.appendChild(statsStyles);

// Update stats on initial load and after task changes
updateStats();

// Task Categories and Grouping
const defaultCategories = [
    { id: 'work', name: 'Work', color: '#4a90e2', icon: 'fa-briefcase' },
    { id: 'personal', name: 'Personal', color: '#50c878', icon: 'fa-user' },
    { id: 'shopping', name: 'Shopping', color: '#f4a261', icon: 'fa-shopping-cart' },
    { id: 'health', name: 'Health', color: '#e63946', icon: 'fa-heart' },
    { id: 'education', name: 'Education', color: '#9b5de5', icon: 'fa-graduation-cap' }
];

// Add category field to task form
const categoryFormGroup = document.createElement('div');
categoryFormGroup.className = 'form-group';
categoryFormGroup.innerHTML = `
    <label for="taskCategory">Category</label>
    <div class="category-select">
        <select id="taskCategory" name="taskCategory" required>
            <option value="">Select a category</option>
            ${defaultCategories.map(category => `
                <option value="${category.id}" data-color="${category.color}" data-icon="${category.icon}">
                    ${category.name}
                </option>
            `).join('')}
        </select>
        <button type="button" class="btn-icon add-category" title="Add new category">
            <i class="fas fa-plus"></i>
        </button>
    </div>
`;

// Insert category field into form
const taskPriorityGroup = document.querySelector('#taskPriority').closest('.form-group');
taskPriorityGroup.parentNode.insertBefore(categoryFormGroup, taskPriorityGroup);

// Add category field to edit form
const editCategoryFormGroup = categoryFormGroup.cloneNode(true);
editCategoryFormGroup.querySelector('select').id = 'editTaskCategory';
const editTaskPriorityGroup = document.querySelector('#editTaskPriority').closest('.form-group');
editTaskPriorityGroup.parentNode.insertBefore(editCategoryFormGroup, editTaskPriorityGroup);

// Update task creation and editing
function createTask(formData) {
    const task = {
        id: Date.now(),
        title: formData.get('taskTitle').trim(),
        description: formData.get('taskDescription').trim(),
        priority: formData.get('taskPriority'),
        category: formData.get('taskCategory'),
        dueDate: formData.get('taskDueDate'),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasksToStorage();
    updateTaskList();
    updateStats();
    return task;
}

// Group tasks by category
function groupTasksByCategory(tasks) {
    const grouped = {};
    defaultCategories.forEach(category => {
        grouped[category.id] = {
            ...category,
            tasks: []
        };
    });

    tasks.forEach(task => {
        if (grouped[task.category]) {
            grouped[task.category].tasks.push(task);
        }
    });

    return grouped;
}

// Enhanced task list rendering with categories
function renderTaskList(filteredTasks) {
    const groupedTasks = groupTasksByCategory(filteredTasks);
    
    taskList.innerHTML = Object.values(groupedTasks)
        .filter(group => group.tasks.length > 0)
        .map(group => `
            <div class="category-group" style="--category-color: ${group.color}">
                <div class="category-header">
                    <i class="fas ${group.icon}"></i>
                    <h3>${group.name}</h3>
                    <span class="task-count">${group.tasks.length}</span>
                </div>
                <div class="category-tasks">
                    ${group.tasks.map((task, index) => `
                        <div class="task-card ${task.status}" 
                            data-id="${task.id}"
                            draggable="true"
                            data-position="${index}"
                            data-category="${task.category}">
                            <div class="drag-handle">
                                <i class="fas fa-grip-vertical"></i>
                            </div>
                            <div class="task-priority ${task.priority}">
                                <span class="priority-indicator"></span>
                                ${task.priority}
                            </div>
                            <div class="task-content">
                                <h3>${task.title}</h3>
                                <p>${task.description || 'No description provided'}</p>
                                <div class="task-meta">
                                    <span class="due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}">
                                        <i class="fas fa-calendar-alt"></i>
                                        ${formatDueDate(task.dueDate)}
                                    </span>
                                    <span class="status ${task.status}">
                                        <i class="fas ${task.status === 'completed' ? 'fa-check-circle' : 'fa-clock'}"></i>
                                        ${task.status}
                                    </span>
                                </div>
                            </div>
                            <div class="task-actions">
                                <button onclick="toggleTaskStatus(${task.id})" class="btn-icon">
                                    <i class="fas ${task.status === 'completed' ? 'fa-undo' : 'fa-check'}"></i>
                                </button>
                                <button onclick="editTask(${task.id})" class="btn-icon edit-task">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteTaskWithConfirmation(${task.id})" class="btn-icon delete-task">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('') || `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <h3>No tasks found</h3>
                <p>Add your first task to get started!</p>
            </div>
        `;

    initializeDragAndDrop();
}

// Add styles for categories
const categoryStyles = document.createElement('style');
categoryStyles.textContent = `
    .category-select {
        display: flex;
        gap: var(--spacing-sm);
    }

    .category-group {
        margin-bottom: var(--spacing-lg);
        border-radius: var(--border-radius-lg);
        background: var(--white);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .category-header {
        display: flex;
        align-items: center;
        padding: var(--spacing-md);
        background: var(--category-color);
        color: white;
        border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
        gap: var(--spacing-sm);
    }

    .category-header i {
        font-size: 1.2rem;
    }

    .category-header h3 {
        margin: 0;
        flex: 1;
    }

    .task-count {
        background: rgba(255,255,255,0.2);
        padding: 2px 8px;
        border-radius: var(--border-radius-sm);
        font-size: 0.85rem;
    }

    .category-tasks {
        padding: var(--spacing-md);
    }

    .task-card {
        border-left: 4px solid var(--category-color);
    }

    @media (max-width: 768px) {
        .category-group {
            margin-bottom: var(--spacing-md);
        }
    }
`;

document.head.appendChild(categoryStyles);

// Update stats to include category information
function getTaskStatistics() {
    const stats = {
        // ... existing stats ...
        categories: Object.values(groupTasksByCategory(tasks))
            .map(group => ({
                name: group.name,
                count: group.tasks.length,
                completed: group.tasks.filter(t => t.status === 'completed').length
            }))
            .filter(cat => cat.count > 0)
    };

    return stats;
}

// Task Editing
let editingTaskId = null;

// Add Edit Modal HTML
const editModalHTML = `
<div id="editTaskModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2><i class="fas fa-edit"></i> Edit Task</h2>
            <button class="close-modal">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <form id="editTaskForm" class="modal-body">
            <div class="form-group">
                <label for="editTaskTitle">Task Title</label>
                <input type="text" id="editTaskTitle" name="taskTitle" required
                    placeholder="Enter task title">
            </div>

            <div class="form-group">
                <label for="editTaskDescription">Description</label>
                <textarea id="editTaskDescription" name="taskDescription" rows="3"
                    placeholder="Enter task description"></textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="editTaskPriority">Priority</label>
                    <select id="editTaskPriority" name="taskPriority" required>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="editTaskCategory">Category</label>
                    <select id="editTaskCategory" name="taskCategory" required>
                        <option value="">Select a category</option>
                        ${defaultCategories.map(category => `
                            <option value="${category.id}" data-color="${category.color}" data-icon="${category.icon}">
                                ${category.name}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label for="editTaskDueDate">Due Date</label>
                    <input type="date" id="editTaskDueDate" name="taskDueDate" required>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn-secondary cancel-modal">
                    Cancel
                </button>
                <button type="submit" class="btn-primary">
                    <i class="fas fa-save"></i> Save Changes
                </button>
            </div>
        </form>
    </div>
</div>`;

// Add edit modal to DOM
document.body.insertAdjacentHTML('beforeend', editModalHTML);

// Get edit modal elements
const editTaskModal = document.getElementById('editTaskModal');
const editTaskForm = document.getElementById('editTaskForm');
const closeEditModalBtn = editTaskModal.querySelector('.close-modal');
const cancelEditModalBtn = editTaskModal.querySelector('.cancel-modal');

// Edit Task Functions
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    editingTaskId = taskId;
    
    // Populate form fields
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskDescription').value = task.description || '';
    document.getElementById('editTaskPriority').value = task.priority;
    document.getElementById('editTaskCategory').value = task.category;
    document.getElementById('editTaskDueDate').value = task.dueDate;

    // Show modal
    editTaskModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on title
    setTimeout(() => {
        document.getElementById('editTaskTitle').focus();
    }, 300);
}

function hideEditModal() {
    editTaskModal.classList.remove('active');
    document.body.style.overflow = '';
    editTaskForm.reset();
    editingTaskId = null;
    clearValidation();
}

// Edit Modal Event Listeners
closeEditModalBtn.addEventListener('click', hideEditModal);
cancelEditModalBtn.addEventListener('click', hideEditModal);

// Close edit modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === editTaskModal) {
        hideEditModal();
    }
});

// Handle edit form submission
editTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateEditForm()) {
        return;
    }

    const formData = new FormData(editTaskForm);
    const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
    
    if (taskIndex !== -1) {
        // Update task
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: formData.get('taskTitle').trim(),
            description: formData.get('taskDescription').trim(),
            priority: formData.get('taskPriority'),
            category: formData.get('taskCategory'),
            dueDate: formData.get('taskDueDate'),
            updatedAt: new Date().toISOString()
        };

        saveTasksToStorage();
        updateTaskList();
        hideEditModal();
        showNotification('Task updated successfully!');
    }
});

function validateEditForm() {
    const title = document.getElementById('editTaskTitle').value.trim();
    const dueDate = document.getElementById('editTaskDueDate').value;
    const priority = document.getElementById('editTaskPriority').value;
    const category = document.getElementById('editTaskCategory').value;
    
    let isValid = true;
    clearValidation();

    if (title.length < 3) {
        showError('editTaskTitle', 'Title must be at least 3 characters long');
        isValid = false;
    }

    if (!dueDate) {
        showError('editTaskDueDate', 'Please select a due date');
        isValid = false;
    }

    if (!priority) {
        showError('editTaskPriority', 'Please select a priority level');
        isValid = false;
    }

    if (!category) {
        showError('editTaskCategory', 'Please select a category');
        isValid = false;
    }

    return isValid;
}

// Add styles for edit modal
const editModalStyles = document.createElement('style');
editModalStyles.textContent = `
    #editTaskModal .modal-header i {
        color: var(--warning-color);
    }

    .task-card.editing {
        border: 2px solid var(--primary-color);
        box-shadow: 0 0 10px rgba(74, 144, 226, 0.2);
    }
`;

document.head.appendChild(editModalStyles);

// Task Sorting and Filtering Enhancement
let sortOptions = {
    criteria: 'dueDate',
    direction: 'asc'
};

// Enhanced updateTaskList function with sorting
function updateTaskList(searchTerm = '') {
    let filteredTasks = [...tasks];

    // Apply search filter
    if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchTermLower) ||
            task.description.toLowerCase().includes(searchTermLower)
        );
    }

    // Apply status filter
    if (currentFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => {
            if (currentFilter === 'in progress') return task.status === 'pending';
            return task.status === currentFilter;
        });
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
        let compareResult = 0;
        
        switch (sortOptions.criteria) {
            case 'dueDate':
                compareResult = new Date(a.dueDate) - new Date(b.dueDate);
                break;
            case 'priority': {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                compareResult = priorityOrder[a.priority] - priorityOrder[b.priority];
                break;
            }
            case 'title':
                compareResult = a.title.localeCompare(b.title);
                break;
            case 'status':
                compareResult = a.status.localeCompare(b.status);
                break;
        }
        
        return sortOptions.direction === 'asc' ? compareResult : -compareResult;
    });

    // Update task counter
    const taskCounter = document.querySelector('.task-counter');
    if (taskCounter) {
        taskCounter.textContent = `${filteredTasks.length} ${filteredTasks.length === 1 ? 'task' : 'tasks'}`;
    }

    // Update DOM with enhanced task cards
    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-card ${task.status}" data-id="${task.id}">
            <div class="task-priority ${task.priority}">
                <span class="priority-indicator"></span>
                ${task.priority}
            </div>
            <div class="task-content">
                <h3>${task.title}</h3>
                <p>${task.description || 'No description provided'}</p>
                <div class="task-meta">
                    <span class="due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}">
                        <i class="fas fa-calendar-alt"></i>
                        ${formatDueDate(task.dueDate)}
                    </span>
                    <span class="status ${task.status}">
                        <i class="fas ${task.status === 'completed' ? 'fa-check-circle' : 'fa-clock'}"></i>
                        ${task.status}
                    </span>
                </div>
            </div>
            <div class="task-actions">
                <button onclick="toggleTaskStatus(${task.id})" class="btn-icon" title="${task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}">
                    <i class="fas ${task.status === 'completed' ? 'fa-undo' : 'fa-check'}"></i>
                </button>
                <button onclick="editTask(${task.id})" class="btn-icon edit-task" title="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteTaskWithConfirmation(${task.id})" class="btn-icon delete-task" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Update empty state
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <h3>No tasks found</h3>
                <p>${searchTerm ? 'Try a different search term' : 'Add your first task to get started!'}</p>
            </div>
        `;
    }
}

// Helper functions for enhanced task display
function isOverdue(dueDate) {
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0);
}

function formatDueDate(dueDate) {
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Due Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Due Tomorrow';
    } else if (isOverdue(dueDate)) {
        return `Overdue: ${formatDate(dueDate)}`;
    }
    return `Due: ${formatDate(dueDate)}`;
}

// Delete task with confirmation
function deleteTaskWithConfirmation(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const notification = document.createElement('div');
    notification.className = 'notification warning';
    notification.innerHTML = `
        <div class="notification-content">
            <p>Delete "${task.title}"?</p>
            <div class="notification-actions">
                <button onclick="confirmDeleteTask(${taskId})" class="btn-danger">Delete</button>
                <button onclick="this.closest('.notification').remove()" class="btn-secondary">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
}

function confirmDeleteTask(taskId) {
    deleteTask(taskId);
    showNotification('Task deleted successfully', 'success');
    document.querySelector('.notification.warning')?.remove();
}

// Add these styles for new components
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .empty-state {
        text-align: center;
        padding: 2rem;
        color: var(--text-light);
    }

    .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: var(--border-color);
    }

    .notification.warning {
        border-left-color: var(--warning-color);
    }

    .notification-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .notification-actions {
        display: flex;
        gap: 10px;
    }

    .btn-danger {
        background-color: var(--danger-color);
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: var(--border-radius-sm);
        cursor: pointer;
    }

    .overdue {
        color: var(--danger-color);
    }

    .priority-indicator {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 5px;
    }

    .priority.high .priority-indicator {
        background-color: var(--danger-color);
    }

    .priority.medium .priority-indicator {
        background-color: var(--warning-color);
    }

    .priority.low .priority-indicator {
        background-color: var(--success-color);
    }
`;

document.head.appendChild(additionalStyles);
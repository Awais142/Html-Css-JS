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
// Modal Animation and Validation Functions
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
    document.body.style.overflow = ''; // Restore scrolling
    addTaskForm.reset();
    clearValidation();
}

function validateForm() {
    const title = document.getElementById('taskTitle').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;
    
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

// Update existing event listeners
addTaskBtn.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', hideModal);
cancelModalBtn.addEventListener('click', hideModal);

// Update form submission
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
        dueDate: formData.get('taskDueDate')
    };

    addTask(taskData);
    hideModal();

    // Show success notification
    showNotification('Task added successfully!');
});

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
// Task Filtering and Sorting
let sortCriteria = 'dueDate'; // Default sort
let sortDirection = 'asc'; // Default direction

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
        
        switch (sortCriteria) {
            case 'dueDate':
                compareResult = new Date(a.dueDate) - new Date(b.dueDate);
                break;
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                compareResult = priorityOrder[a.priority] - priorityOrder[b.priority];
                break;
            case 'title':
                compareResult = a.title.localeCompare(b.title);
                break;
            case 'status':
                compareResult = a.status.localeCompare(b.status);
                break;
        }
        
        return sortDirection === 'asc' ? compareResult : -compareResult;
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
// DOM Elements
const addTaskBtn = document.getElementById('addTaskBtn');
const addTaskModal = document.getElementById('addTaskModal');
const closeModalBtn = document.querySelector('.close-modal');
const cancelModalBtn = document.querySelector('.cancel-modal');
const addTaskForm = document.getElementById('addTaskForm');
const taskList = document.querySelector('.task-list');

// Task Data
let tasks = [];

// Event Listeners
addTaskBtn.addEventListener('click', () => {
    addTaskModal.classList.add('active');
});

closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewTask();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === addTaskModal) {
        closeModal();
    }
});

// Functions
function closeModal() {
    addTaskModal.classList.remove('active');
    addTaskForm.reset();
}

function addNewTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;

    const task = {
        id: Date.now(),
        title,
        description,
        priority,
        dueDate,
        status: 'pending'
    };

    tasks.push(task);
    updateTaskList();
    updateStats();
    closeModal();
}

function updateTaskList() {
    taskList.innerHTML = tasks.map(task => `
        <div class="task-card" data-id="${task.id}">
            <div class="task-priority ${task.priority}"></div>
            <div class="task-content">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <div class="task-meta">
                    <span class="due-date">Due: ${formatDate(task.dueDate)}</span>
                    <span class="status ${task.status}">${task.status}</span>
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
        <div class="stat-card">
            <div class="stat-icon">
                <i class="fas fa-tasks"></i>
            </div>
            <div class="stat-details">
                <h3>Total Tasks</h3>
                <p>${totalTasks}</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">
                <i class="fas fa-spinner"></i>
            </div>
            <div class="stat-details">
                <h3>In Progress</h3>
                <p>${pendingTasks}</p>
            </div>
        </div>
        <div class="stat-card">
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

function toggleTaskStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        updateTaskList();
        updateStats();
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        updateTaskList();
        updateStats();
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize the dashboard
updateStats();

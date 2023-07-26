const addBtn = document.getElementById("add-btn");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const clearBtn = document.getElementById("clear-btn");

// Load tasks from localStorage on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Add a new task
addBtn.addEventListener("click", () => {
  addTask();
  saveTasks();
});

function addTask() {
  const task = todoInput.value.trim();
  if (task === "") {
    alert("Please enter a task!");
    return;
  }

  const li = document.createElement("li");
  li.textContent = task;
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  li.appendChild(deleteBtn);
  todoList.appendChild(li);
  todoInput.value = "";
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  todoList.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.firstChild.textContent.trim(),
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => {
      li.remove();
      saveTasks();
    };

    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// Clear all tasks
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    todoList.innerHTML = "";
    saveTasks();
  }
});

const addBtn = document.getElementById("add-btn");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

addBtn.addEventListener("click", addTask);

function addTask() {
  const task = todoInput.value;
  if (task) {
    const li = document.createElement("li");
    li.textContent = task;
    todoList.appendChild(li);
    todoInput.value = "";
  }
}
function addTask() {
  const task = todoInput.value;
  if (task) {
    const li = document.createElement("li");
    li.textContent = task;
    li.addEventListener("click", () => {
      li.classList.toggle("completed");
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => li.remove();

    li.appendChild(deleteBtn);
    todoList.appendChild(li);
    todoInput.value = "";
  }
}
const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", () => {
  todoList.innerHTML = "";
});
function addTask() {
  const task = todoInput.value.trim();
  if (task === "") {
    alert("Please enter a task!");
    return;
  }
  // Rest of the code remains unchanged
}
function saveTasks() {
  const tasks = [];
  todoList.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.textContent.replace("Delete", "").trim(),
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => li.remove();

    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", loadTasks);
addBtn.addEventListener("click", () => {
  addTask();
  saveTasks();
});

clearBtn.addEventListener("click", () => {
  todoList.innerHTML = "";
  saveTasks();
});
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    todoList.innerHTML = "";
    saveTasks();
  }
});

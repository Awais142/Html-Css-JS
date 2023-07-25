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

const todoInput = document.getElementById("todo_input");
const todoTasksContainer = document.getElementById("todo_tasks_container");
const modalContainer = document.getElementById("modals_container");
const editModal = document.getElementById("edit_modal");
const deleteModal = document.getElementById("delete_modal");
const editInput = document.getElementById("edit_input");
const themeTogglerButton = document.getElementById("theme_toggler");

// App Theme
let theme = localStorage.getItem("theme");
if (theme == null) {
  theme = "dark";
  localStorage.setItem("theme", theme);
  document.body.classList.add(theme);
} else {
  document.body.classList.add(theme);
}

themeTogglerButton.addEventListener("click", () => {
  document.body.classList.remove(theme);
  theme = localStorage.getItem("theme");
  if (theme == "light") {
    theme = "dark";
  } else if (theme == "dark") {
    theme = "light";
  }
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
});

let todoTasksArray = JSON.parse(localStorage.getItem("todo-tasks"));

todoTasksArray == null ? (todoTasksArray = []) : todoTasksArray;

let queueIndex = null;

function addTodo(e) {
  e.preventDefault();
  const todoValue = todoInput.value;
  if (todoValue != "") {
    todoTasksArray.push(todoValue);
    todoInput.value = "";
    printTasks();
  }
}

function printTasks() {
  updateLocalStorage();
  todoTasksContainer.innerHTML = "";
  todoTasksArray.forEach((todoTask) => {
    const todoTaskDiv = document.createElement("div");
    todoTaskDiv.classList.add("todo_task");
    todoTaskDiv.innerHTML = `
        <div class="move_buttons">
            <button onclick="moveUp(${todoTasksArray.indexOf(todoTask)})">
                <span class="material-symbols-outlined"> arrow_drop_up </span>
            </button>
            <button onclick="moveDown(${todoTasksArray.indexOf(todoTask)})">
                <span class="material-symbols-outlined"> arrow_drop_down </span>
            </button>
        </div>
        <div class="todo_text">${todoTask}</div>
        <button class="edit_button" onclick="editTask(${todoTasksArray.indexOf(
          todoTask
        )})">
            <span class="material-symbols-outlined"> edit </span>
        </button>
        <button class="delete_button" onclick="attemptDelete(${todoTasksArray.indexOf(
          todoTask
        )})">
            <span class="material-symbols-outlined"> delete </span>
        </button>
        `;
    todoTasksContainer.appendChild(todoTaskDiv);
  });

  if (todoTasksArray.length >= todoTasksContainer.clientHeight / (43 + 20)) {
    todoTasksContainer.style.overflowY = "scroll";
  }
}

function moveUp(index) {
  if (index > 0) {
    let prevTask = todoTasksArray[index - 1];
    let currTask = todoTasksArray[index];
    todoTasksArray[index - 1] = currTask;
    todoTasksArray[index] = prevTask;
    printTasks();
  }
}

function moveDown(index) {
  if (index < todoTasksArray.length - 1) {
    let nextTask = todoTasksArray[index + 1];
    let currTask = todoTasksArray[index];
    todoTasksArray[index + 1] = currTask;
    todoTasksArray[index] = nextTask;
    printTasks();
  }
}

function editTask(index) {
  queueIndex = index;
  editInput.value = todoTasksArray[index];
  modalContainer.classList.add("active");
  editModal.classList.add("active");
}

function updateTask(e) {
  e.preventDefault();
  todoTasksArray[queueIndex] = editInput.value;
  modalContainer.classList.remove("active");
  editModal.classList.remove("active");
  printTasks();
  queueIndex = null;
}

function attemptDelete(index) {
  queueIndex = index;
  modalContainer.classList.add("active");
  deleteModal.classList.add("active");
}

function deleteTask() {
  todoTasksArray.splice(queueIndex, 1);
  modalContainer.classList.remove("active");
  deleteModal.classList.remove("active");
  queueIndex = null;
  printTasks();
}

function cancelOperation(e) {
  e.preventDefault();
  modalContainer.classList.remove("active");
  deleteModal.classList.remove("active");
  editModal.classList.remove("active");
  queueIndex = null;
}

function updateLocalStorage() {
  const stringifiedTasksArray = JSON.stringify(todoTasksArray);
  localStorage.setItem("todo-tasks", stringifiedTasksArray);
}

printTasks();

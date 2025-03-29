const todoForm = document.querySelector('form');
const todoInput = document.querySelector('.todo-input');
const todoList = document.querySelector('.todo-list');
const errorMessage = document.querySelector('.error-message');
const countAll = document.querySelector('.count-all');
const countActive = document.querySelector('.count-active');
const countCompleted = document.querySelector('.count-completed');
const filterButtons = document.querySelectorAll('.todo-filters button');

let allTodos = [];
let currentTodoFilter = 'all';
let editingIndex = null;


document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.todo-filters button');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(button => button.classList.remove('active'));

      this.classList.add('active');

      currentTodoFilter = this.dataset.filter;
      updateTodoList();
    });
  })
});

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
});

function addTodo() {
    const todoText = todoInput.value.trim();

  const isValid = validation(todoText);
  if (!isValid.valid) {
    showErrorMessage(isValid.message);
    return;
  }
  if (editingIndex !== null) {
    allTodos[editingIndex].text = todoText;
    editingIndex = null;
  } else {
    allTodos.push({text: todoText, isDone: false});
  }
  

        updateTodoList();
        todoInput.value = '';
        hideErrorMessage();
    
}

function updateTodoList() {
    todoList.innerHTML = '';
    
    const filterTodo = allTodos.filter(todo => {
      if (currentTodoFilter === 'active') return !todo.isDone;
      if (currentTodoFilter === 'completed') return todo.isDone;
      return true;
    });

    filterTodo.forEach((todo, index) => {
      let todoItem = createTodoItem(todo, index);
      todoList.appendChild(todoItem);
  });

    updateFilterCounters();
}

function updateFilterCounters() {
    countAll.textContent = allTodos.length;
    countActive.textContent = allTodos.filter(todo => !todo.isDone).length;
    countCompleted.textContent = allTodos.filter(todo => todo.isDone).length;
};



function createTodoItem(todo, todoIndex) {
    const todoId = "todo-"+todoIndex;
    const todoLi = document.createElement('li');
    todoLi.className = 'todo-item';
    todoLi.innerHTML = `
    <input type="checkbox" id="${todoId}" class="todo-checkbox">
          <label class="custom-checkbox" for="${todoId}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="transparent"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
          </label>
          <label for="${todoId}" class="todo-text">${todo.text}</label>
          <div class="todo-buttons">
            <button class="edit-button">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
            </button>
            <button class="delete-button">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
          </div>
    `

    const checkbox = todoLi.querySelector('.todo-checkbox');
    checkbox.checked = todo.isDone;
    if (todo.isDone) {
        todoLi.querySelector('.todo-text').style.textDecoration = 'line-through';
    }
    checkbox.addEventListener('change', () => {
      allTodos[todoIndex].isDone = checkbox.checked;
      updateTodoList();
    });

    const deleteButton = todoLi.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
        allTodos.splice(todoIndex, 1);
        updateTodoList();
    });

    const editButton = todoLi.querySelector('.edit-button');
    editButton.addEventListener('click', () => {
        const todoText = todoLi.querySelector('.todo-text').textContent;
        todoInput.value = todoText;
        todoInput.focus();
        editingIndex = todoIndex;
    });

    return todoLi;
}


function showErrorMessage (message) {
errorMessage.textContent = message;
errorMessage.style.display = 'block'
}

function hideErrorMessage() {
  errorMessage.style.display = 'none';
}

function validation(text) {
  if (text.length < 2 || text.length > 64) {
    return {
      valid: false,
      message: 'Название задачи должно быть от 2 до 64 символов',
    }
  }
    return {
      valid: true,
  }
}
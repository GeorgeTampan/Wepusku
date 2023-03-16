document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
  
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function addTodo() {
  const judul = document.getElementById('inputjudul').value;
  const penulis = document.getElementById('inputjudul').value;
  const timestamp = document.getElementById('date').value;
  const statusCheckBox = document.getElementById('inputBookIsComplete').checked;
 
  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, judul, penulis, timestamp, statusCheckBox);
  todos.push(todoObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}
 
function generateTodoObject(id, judul, penulis, timestamp, isCompleted) {
  return {
    id,
    judul,
    penulis,
    timestamp,
    isCompleted
  }
}

  const todos = [];
  const RENDER_EVENT = 'render-todo';

  document.addEventListener(RENDER_EVENT, function () {
      console.log(todos);
    });

function makeTodo(todoObject) {
const textTitle = document.createElement('h2');
textTitle.innerText = todoObject.judul;

const textPenulis = document.createElement('p');
textPenulis.innerText = todoObject.penulis;

const textTimestamp = document.createElement('p');
textTimestamp.innerText = todoObject.timestamp;

const textContainer = document.createElement('div');
textContainer.classList.add('inner');
textContainer.append(textTitle, textPenulis, textTimestamp);

const container = document.createElement('div');
container.classList.add('item', 'shadow');
container.append(textContainer);
container.setAttribute('id', `todo-${todoObject.id}`);

if (todoObject.isCompleted) {
  const undoButton = document.createElement('button');
  undoButton.classList.add('undo-button');

  undoButton.addEventListener('click', function () {
    undoTaskFromCompleted(todoObject.id);
  });

  const trashButton = document.createElement('button');
  trashButton.classList.add('trash-button');

  trashButton.addEventListener('click', function () {
    removeTaskFromCompleted(todoObject.id);
  });

  container.append(undoButton, trashButton);
} else {
  const checkButton = document.createElement('button');
  checkButton.classList.add('check-button');
  
  checkButton.addEventListener('click', function () {
    addTaskToCompleted(todoObject.id);
  });
  const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(todoObject.id);
    });
    
    
    container.append(checkButton,trashButton);
}

return container;
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('todos');
  uncompletedTODOList.innerHTML = '';
 
  const completedTODOList = document.getElementById('completed-todos');
  completedTODOList.innerHTML = '';
 
  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted)
      uncompletedTODOList.append(todoElement);
    else
      completedTODOList.append(todoElement);
  }
});

function addTaskToCompleted (todoId) {
const todoTarget = findTodo(todoId);

if (todoTarget == null) return;

todoTarget.isCompleted = true;
document.dispatchEvent(new Event(RENDER_EVENT));
saveData();
}

function findTodo(todoId) {
for (const todoItem of todos) {
  if (todoItem.id === todoId) {
    return todoItem;
  }
}
return null;
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);
 
  if (todoTarget === -1) return;
 
  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
 
function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);
 
  if (todoTarget == null) return;
 
  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
 
  return -1;
}

const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function isStorageExist() /* boolean */ {
if (typeof (Storage) === undefined) {
  alert('Browser kamu tidak mendukung local storage');
  return false;
}
return true;
}

document.addEventListener(SAVED_EVENT, function () {
console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
const serializedData = localStorage.getItem(STORAGE_KEY);
let data = JSON.parse(serializedData);

if (data !== null) {
  for (const todo of data) {
    todos.push(todo);
  }
}

document.dispatchEvent(new Event(RENDER_EVENT));
}

const checkbox = document.getElementById('inputBookIsComplete');
let check = false;

checkbox.addEventListener('change', function() {
  if (checkbox.checked) {
    check = true;
    
    document.querySelector('span').innerText = 'Selesai dibaca';
  }else {
    check = false;

    document.querySelector('span').innerText = 'Belum selesai dibaca';
  }
});

document.getElementById('searchBook').addEventListener('submit', function (event) {
  event.preventDefault();
  const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
  const bookList = document.querySelectorAll('.item > .inner h2');

  for (const book of bookList) {
    if (searchBook !== book.innerText.toLowerCase()) {
      book.parentElement.style.display = '';
    } else {
      book.parentElement.style.display = 'none';
    }
  }
});

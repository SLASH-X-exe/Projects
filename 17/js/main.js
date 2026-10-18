const todoInput = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');

const todoTask = document.querySelector('#todoTask');

addBtn.addEventListener("click", () => {
    addTask();
});

// Add Task Function
function addTask() {
    const taskValue = todoInput.value.trim(); 
    if (taskValue !== '') {
        let li = document.createElement("li");
        li.innerHTML = taskValue; 
        todoTask.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        todoInput.value = "";
        saveTasks();
    } else {
        Swal.fire("Cannot add empty task!");
    }
}

// Finish or Delete Task
todoTask.addEventListener("click", (e) => {
    if(e.target.tagName === 'LI') {
        e.target.classList.toggle("checked");
        saveTasks();
    } else if (e.target.tagName === 'SPAN') {
        e.target.parentElement.remove();
        saveTasks();
    }
}, false);

// Save Data in Local Storage
function saveTasks() {
    localStorage.setItem("tasks",todoTask.innerHTML);
}
// Show Data 
function showTask() {
    todoTask.innerHTML = localStorage.getItem("tasks");
}
showTask();

// Enter To Add Task
document.addEventListener('keyup', (e) => {
    if(e.key == "Enter") {
        addTask();
    }
})
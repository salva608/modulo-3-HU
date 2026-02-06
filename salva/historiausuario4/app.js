// VARIABLES GLOBALES
const taskForm = document.getElementById("taskForm")
const taskInput = document.getElementById("taskInput")
const taskList = document.getElementById("taskList")
const message = document.getElementById("message")
const syncBtn = document.getElementById("syncBtn")

let tasks = []


// AGREGAR TAREA
taskForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const text = taskInput.value.trim()

    if (text === "") {
        showMessage("La tarea no puede estar vacía", "red")
        return
    }

    const task = {
        id: Date.now(),
        title: text
    }

    tasks.push(task)
    renderTasks()
    saveLocalStorage()

    showMessage("Tarea agregada correctamente", "green")
    taskInput.value = ""
})

function renderTasks() {
    taskList.innerHTML = ""

    tasks.forEach(task => {
        const li = document.createElement("li")
        li.textContent = task.title

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Eliminar"

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id)
        })

        li.appendChild(deleteBtn)
        taskList.appendChild(li)
    })
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id)
    renderTasks()
    saveLocalStorage()
}


// LOCAL STORAGE
function saveLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function loadLocalStorage() {
    const data = localStorage.getItem("tasks")
    if (data) {
        tasks = JSON.parse(data)
        renderTasks()
    }
}

loadLocalStorage()

const API_URL = "http://localhost:3000/tasks"


async function getTasksFromAPI() {
    try {
        const response = await fetch(API_URL)
        const data = await response.json()
        console.log("GET:", data)
    } catch (error) {
        console.error("Error GET", error)
    }
}

async function postTask(task) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        })
        const data = await response.json()
        console.log("POST:", data)
    } catch (error) {
        console.error("Error POST", error)
    }
}

async function updateTask(task) {
    try {
        await fetch(`${API_URL}/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        })
        console.log("PUT exitoso")
    } catch (error) {
        console.error("Error PUT", error)
    }
}


async function deleteTaskAPI(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
        console.log("DELETE exitoso")
    } catch (error) {
        console.error("Error DELETE", error)
    }
}

syncBtn.addEventListener("click", () => {
    getTasksFromAPI()
    showMessage("Datos sincronizados con la API", "blue")
})


function showMessage(text, color) {
    message.textContent = text
    message.style.color = color

    setTimeout(() => {
        message.textContent = ""
    }, 3000)
}

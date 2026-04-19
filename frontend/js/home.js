import { apiCreateTask, apiGetTasks, apiDeleteTask, apiToggleTask } from './api.js'

if (!localStorage.getItem('token')) {
  window.location.href = './login.html'
}

let tasks       = JSON.parse(localStorage.getItem('unitasks')) || []
let currentDate = new Date()
let selectedDate = new Date().toDateString()

const monthNames = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
]


const calendarGrid        = document.getElementById('calendarGrid')
const monthTitle          = document.getElementById('monthTitle')
const taskInput           = document.getElementById('taskInput')
const taskList            = document.getElementById('taskList')
const counter             = document.getElementById('counter')
const selectedDateDisplay = document.getElementById('selectedDateDisplay')


document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1))
document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1))
document.getElementById('btnAddTask').addEventListener('click', addTask)
document.getElementById('btnLogout').addEventListener('click', logout)
document.getElementById('btnConta').addEventListener('click', () => {
  window.location.href = './account.html'
})

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask()
})


function renderCalendar() {
  calendarGrid.innerHTML = ''

  const year  = currentDate.getFullYear()
  const month = currentDate.getMonth()
  monthTitle.innerText = `${monthNames[month]} ${year}`


  const daysOfWeek = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  daysOfWeek.forEach(day => {
    const el = document.createElement('div')
    el.className = 'day-name'
    el.innerText = day
    calendarGrid.appendChild(el)
  })


  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let i = 0; i < firstDay; i++) {
    calendarGrid.appendChild(document.createElement('div'))
  }


  for (let i = 1; i <= daysInMonth; i++) {
    const dateString = new Date(year, month, i).toDateString()
    const dayEl = document.createElement('div')
    dayEl.className = 'day'
    dayEl.innerText = i

    if (dateString === new Date().toDateString()) dayEl.classList.add('today')
    if (dateString === selectedDate)              dayEl.classList.add('selected')
    if (tasks.some(t => t.date === dateString))   dayEl.classList.add('has-task')

    dayEl.addEventListener('click', () => selectDate(dateString))
    calendarGrid.appendChild(dayEl)
  }
}

function selectDate(dateStr) {
  selectedDate = dateStr
  const dateObj = new Date(dateStr)
  selectedDateDisplay.innerText = `Tarefas de ${dateObj.getDate()}/${dateObj.getMonth() + 1}`
  renderCalendar()
  renderTasks()
}

function changeMonth(diff) {
  currentDate.setMonth(currentDate.getMonth() + diff)
  renderCalendar()
}


function addTask() {
  const text = taskInput.value.trim()
  if (!text) return

  tasks.push({ id: Date.now(), text, completed: false, date: selectedDate })
  taskInput.value = ''
  saveAndRender()
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  saveAndRender()
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id)
  saveAndRender()
}

function renderTasks() {
  taskList.innerHTML = ''
  const filtered = tasks.filter(t => t.date === selectedDate)

  filtered.forEach(task => {
    const li = document.createElement('li')
    li.className = `task-item ${task.completed ? 'completed' : ''}`

    const span = document.createElement('span')
    span.textContent = task.text

    const btns = document.createElement('div')
    btns.className = 'task-btns'

    const completeBtn = document.createElement('button')
    completeBtn.className = 'btn-complete'
    completeBtn.textContent = task.completed ? 'Desfazer' : 'OK'
    completeBtn.addEventListener('click', () => toggleTask(task.id))

    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'btn-delete'
    deleteBtn.textContent = 'Excluir'
    deleteBtn.addEventListener('click', () => deleteTask(task.id))

    btns.appendChild(completeBtn)
    btns.appendChild(deleteBtn)
    li.appendChild(span)
    li.appendChild(btns)
    taskList.appendChild(li)
  })

  const completedCount = filtered.filter(t => t.completed).length
  counter.innerHTML = `Total no dia: <strong>${filtered.length}</strong> | Concluídas: <strong>${completedCount}</strong>`
}

function saveAndRender() {
  localStorage.setItem('unitasks', JSON.stringify(tasks))
  renderCalendar()
  renderTasks()
}


function logout() {
  localStorage.removeItem('token')
  window.location.href = './login.html'
}

selectDate(new Date().toDateString())
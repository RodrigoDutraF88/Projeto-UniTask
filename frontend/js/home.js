import { apiCreateTask, apiGetTasks, apiDeleteTask, apiToggleTask } from './api.js'

if (!localStorage.getItem('token')) {
  window.location.href = './login.html'
}

let tasks        = []
let currentDate  = new Date()
let selectedDate = toISODate(new Date())

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

function toISODate(date) {
  const year  = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day   = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

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
  const todayISO    = toISODate(new Date())

  for (let i = 0; i < firstDay; i++) {
    calendarGrid.appendChild(document.createElement('div'))
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateISO = toISODate(new Date(year, month, i))
    const dayEl   = document.createElement('div')
    dayEl.className = 'day'
    dayEl.innerText = i

    if (dateISO === todayISO)    dayEl.classList.add('today')
    if (dateISO === selectedDate) dayEl.classList.add('selected')
    if (tasks.some(t => t.date === dateISO)) dayEl.classList.add('has-task')

    dayEl.addEventListener('click', () => selectDate(dateISO))
    calendarGrid.appendChild(dayEl)
  }
}

async function selectDate(dateStr) {
  selectedDate = dateStr

  const [year, month, day] = dateStr.split('-')
  selectedDateDisplay.innerText = `Tarefas de ${Number(day)}/${Number(month)}`

  await fetchAndRender()
}

function changeMonth(diff) {
  currentDate.setMonth(currentDate.getMonth() + diff)
  renderCalendar()
}

async function addTask() {
  const text = taskInput.value.trim()
  if (!text) return

  taskInput.value = ''

  try {
    await apiCreateTask(text, selectedDate)
    await fetchAndRender()
  } catch {
    taskInput.value = text
    showError('Não foi possível adicionar a tarefa.')
  }
}

async function toggleTask(id, currentState) {
  try {
    await apiToggleTask(id, !currentState)
    await fetchAndRender()
  } catch {
    showError('Não foi possível atualizar a tarefa.')
  }
}

async function deleteTask(id) {
  try {
    await apiDeleteTask(id)
    await fetchAndRender()
  } catch {
    showError('Não foi possível excluir a tarefa.')
  }
}

function renderTasks() {
  taskList.innerHTML = ''

  tasks.forEach(task => {
    const li = document.createElement('li')
    li.className = `task-item ${task.completed ? 'completed' : ''}`

    const span = document.createElement('span')
    span.textContent = task.titulo

    const btns = document.createElement('div')
    btns.className = 'task-btns'

    const completeBtn = document.createElement('button')
    completeBtn.className = 'btn-complete'
    completeBtn.textContent = task.completed ? 'Desfazer' : 'OK'
    completeBtn.addEventListener('click', () => toggleTask(task.id, task.completed))

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

  const completedCount = tasks.filter(t => t.completed).length
  counter.innerHTML = `Total no dia: <strong>${tasks.length}</strong> | Concluídas: <strong>${completedCount}</strong>`
}

async function fetchAndRender() {
  try {
    tasks = await apiGetTasks(selectedDate)
  } catch {
    tasks = []
    showError('Erro ao carregar tarefas.')
  }

  renderCalendar()
  renderTasks()
}

function showError(msg) {
  const existing = document.getElementById('homeError')
  if (existing) existing.remove()

  const el = document.createElement('p')
  el.id = 'homeError'
  el.textContent = msg
  el.style.cssText = 'color:#ff4d4d;font-size:0.8rem;margin-bottom:0.75rem;'
  taskList.before(el)

  setTimeout(() => el.remove(), 3500)
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  window.location.href = './login.html'
}

selectDate(toISODate(new Date()))
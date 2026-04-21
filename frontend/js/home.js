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
const weekChart           = document.getElementById('weekChart')
const chartHeadline       = document.getElementById('chartHeadline')

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

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return toISODate(d)
  })
}

async function renderChart() {
  const allTasks = await apiGetTasks()
  const days     = getLast7Days()

  const data = days.map(date => {
    const dayTasks = allTasks.filter(t => t.date === date)
    return {
      date,
      total:     dayTasks.length,
      completed: dayTasks.filter(t => t.completed).length
    }
  })

  const totalWeek     = data.reduce((s, d) => s + d.total, 0)
  const completedWeek = data.reduce((s, d) => s + d.completed, 0)
  chartHeadline.textContent = `${completedWeek} de ${totalWeek} concluídas`

  drawChart(data)
}

function drawChart(data) {
  const canvas = weekChart
  const ctx    = canvas.getContext('2d')
  const dpr    = window.devicePixelRatio || 1
  const width  = canvas.offsetWidth
  const height = canvas.offsetHeight

  canvas.width  = width * dpr
  canvas.height = height * dpr
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, width, height)

  const maxVal   = Math.max(...data.map(d => d.total), 1)
  const groupW   = width / data.length
  const barW     = Math.floor(groupW * 0.28)
  const gap      = 3
  const paddingB = 22
  const chartH   = height - paddingB

  const green  = '#00e676'
  const dimBar = 'rgba(255,255,255,0.07)'
  const dimTxt = 'rgba(255,255,255,0.28)'

  data.forEach((d, i) => {
    const x      = i * groupW + groupW / 2
    const totalH = (d.total / maxVal) * chartH
    const doneH  = (d.completed / maxVal) * chartH

    const x1 = x - barW - gap / 2
    const x2 = x + gap / 2

    ctx.fillStyle = dimBar
    ctx.beginPath()
    ctx.roundRect(x1, chartH - totalH, barW, totalH, [3, 3, 0, 0])
    ctx.fill()

    if (d.completed > 0) {
      ctx.fillStyle = green
      ctx.beginPath()
      ctx.roundRect(x2, chartH - doneH, barW, doneH, [3, 3, 0, 0])
      ctx.fill()
    } else {
      ctx.fillStyle = dimBar
      ctx.beginPath()
      ctx.roundRect(x2, chartH - 2, barW, 2, [1, 1, 0, 0])
      ctx.fill()
    }

    ctx.fillStyle = dimTxt
    ctx.font      = '11px DM Sans, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(d.date.slice(8), x, height - 4)
  })
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

    if (dateISO === todayISO)     dayEl.classList.add('today')
    if (dateISO === selectedDate) dayEl.classList.add('selected')
    if (tasks.some(t => t.date === dateISO)) dayEl.classList.add('has-task')

    dayEl.addEventListener('click', () => selectDate(dateISO))
    calendarGrid.appendChild(dayEl)
  }
}

async function selectDate(dateStr) {
  selectedDate = dateStr
  const [, month, day] = dateStr.split('-')
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
    renderChart()
  } catch {
    taskInput.value = text
    showError('Não foi possível adicionar a tarefa.')
  }
}

async function toggleTask(id, currentState) {
  try {
    await apiToggleTask(id, !currentState)
    await fetchAndRender()
    renderChart()
  } catch {
    showError('Não foi possível atualizar a tarefa.')
  }
}

async function deleteTask(id) {
  try {
    await apiDeleteTask(id)
    await fetchAndRender()
    renderChart()
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
  el.style.cssText = 'color:#ff5252;font-size:0.8rem;margin-bottom:0.75rem;'
  taskList.before(el)

  setTimeout(() => el.remove(), 3500)
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  window.location.href = './login.html'
}

window.addEventListener('resize', renderChart)

selectDate(toISODate(new Date()))
renderChart()
import { apiCreateTask, apiGetTasks, apiGetTasksRange, apiDeleteTask, apiToggleTask } from './api.js'

if (!localStorage.getItem('token')) {
  window.location.href = './login.html'
}

let tasks       = []
let monthTasks  = []
let chartOffset = 0
let currentDate = new Date()
let selectedDate = toISODate(new Date())

const monthNames = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
]

const $ = id => document.getElementById(id)

$('prevMonth').addEventListener('click',  () => changeMonth(-1))
$('nextMonth').addEventListener('click',  () => changeMonth(1))
$('btnAddTask').addEventListener('click', addTask)
$('btnLogout').addEventListener('click',  logout)
$('btnConta').addEventListener('click',   () => { window.location.href = './account.html' })
$('chartPrev').addEventListener('click',  () => shiftChart(-7))
$('chartNext').addEventListener('click',  () => shiftChart(7))
$('taskInput').addEventListener('keydown', e => { if (e.key === 'Enter') addTask() })

function toISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function chartDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + chartOffset - 6 + i)
    return toISODate(d)
  })
}

function shiftChart(delta) {
  if (chartOffset + delta > 0) return
  chartOffset += delta
  renderChart()
}

async function changeMonth(diff) {
  currentDate.setMonth(currentDate.getMonth() + diff)
  await loadMonthTasks()
  renderCalendar()
}

async function loadMonthTasks() {
  const y = currentDate.getFullYear()
  const m = currentDate.getMonth()
  try {
    monthTasks = await apiGetTasksRange(
      toISODate(new Date(y, m, 1)),
      toISODate(new Date(y, m + 1, 0))
    )
  } catch {
    monthTasks = []
  }
}

function renderCalendar() {
  const grid = $('calendarGrid')
  grid.innerHTML = ''

  const y = currentDate.getFullYear()
  const m = currentDate.getMonth()
  $('monthTitle').innerText = `${monthNames[m]} ${y}`

  ;['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].forEach(d => {
    const el = document.createElement('div')
    el.className = 'day-name'
    el.innerText = d
    grid.appendChild(el)
  })

  const firstDay    = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const todayISO    = toISODate(new Date())

  for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'))

  for (let i = 1; i <= daysInMonth; i++) {
    const iso = toISODate(new Date(y, m, i))
    const el  = document.createElement('div')
    el.className = 'day'
    el.innerText = i
    if (iso === todayISO)    el.classList.add('today')
    if (iso === selectedDate) el.classList.add('selected')
    if (monthTasks.some(t => t.date === iso)) el.classList.add('has-task')
    el.addEventListener('click', () => selectDate(iso))
    grid.appendChild(el)
  }
}

async function selectDate(iso) {
  selectedDate = iso
  const [, m, d] = iso.split('-')
  $('selectedDateDisplay').innerText = `Tarefas de ${+d}/${+m}`
  try {
    tasks = await apiGetTasks(iso)
  } catch {
    tasks = []
  }
  renderCalendar()
  renderTasks()
}

async function addTask() {
  const text = $('taskInput').value.trim()
  if (!text) return
  $('taskInput').value = ''
  try {
    await apiCreateTask(text, selectedDate)
    tasks = await apiGetTasks(selectedDate)
    await loadMonthTasks()
    renderCalendar()
    renderTasks()
    renderChart()
  } catch {
    $('taskInput').value = text
    showError('Não foi possível adicionar a tarefa.')
  }
}

async function toggleTask(id, current) {
  try {
    await apiToggleTask(id, !current)
    tasks = await apiGetTasks(selectedDate)
    renderTasks()
    renderChart()
  } catch {
    showError('Não foi possível atualizar a tarefa.')
  }
}

async function deleteTask(id) {
  try {
    await apiDeleteTask(id)
    tasks = await apiGetTasks(selectedDate)
    await loadMonthTasks()
    renderCalendar()
    renderTasks()
    renderChart()
  } catch {
    showError('Não foi possível excluir a tarefa.')
  }
}

function renderTasks() {
  const list = $('taskList')
  list.innerHTML = ''

  tasks.forEach(task => {
    const li   = document.createElement('li')
    li.className = `task-item${task.completed ? ' completed' : ''}`

    const span = document.createElement('span')
    span.textContent = task.titulo

    const btns = document.createElement('div')
    btns.className = 'task-btns'

    const ok = document.createElement('button')
    ok.className = 'btn-complete'
    ok.textContent = task.completed ? 'Desfazer' : 'OK'
    ok.onclick = () => toggleTask(task.id, task.completed)

    const del = document.createElement('button')
    del.className = 'btn-delete'
    del.textContent = 'Excluir'
    del.onclick = () => deleteTask(task.id)

    btns.append(ok, del)
    li.append(span, btns)
    list.appendChild(li)
  })

  const done = tasks.filter(t => t.completed).length
  $('counter').innerHTML = tasks.length
    ? `${tasks.length} tarefa${tasks.length > 1 ? 's' : ''} &mdash; <strong>${done}</strong> concluída${done !== 1 ? 's' : ''}`
    : 'Nenhuma tarefa neste dia.'
}

async function renderChart() {
  const canvas = $('weekChart')
  if (!canvas) return

  const days = chartDays()
  const from = days[0]
  const to   = days[days.length - 1]

  const [, fm, fd] = from.split('-')
  const [, tm, td] = to.split('-')
  $('chartRangeLabel').textContent = `${+fd}/${+fm} – ${+td}/${+tm}`

  const nextBtn = $('chartNext')
  nextBtn.style.opacity      = chartOffset === 0 ? '0.2' : '1'
  nextBtn.style.pointerEvents = chartOffset === 0 ? 'none' : 'auto'

  let raw = []
  try {
    raw = await apiGetTasksRange(from, to)
  } catch {
    return
  }

  const data = days.map(iso => ({
    label:   (+iso.split('-')[2]).toString(),
    total:   raw.filter(t => t.date === iso).length,
    done:    raw.filter(t => t.date === iso && t.completed).length,
    isToday: iso === toISODate(new Date())
  }))

  drawChart(canvas, data)
}

function drawChart(canvas, data) {
  const wrap = canvas.parentElement
  const dpr  = window.devicePixelRatio || 1
  const w    = wrap.clientWidth
  const h    = 120

  canvas.width        = w * dpr
  canvas.height       = h * dpr
  canvas.style.width  = w + 'px'
  canvas.style.height = h + 'px'

  const ctx  = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, w, h)

  const pL = 6, pR = 6, pT = 10, pB = 22
  const cw = w - pL - pR
  const ch = h - pT - pB
  const n  = data.length
  const maxV = Math.max(...data.map(d => d.total), 1)
  const xs   = data.map((_, i) => pL + (n === 1 ? cw / 2 : (i / (n - 1)) * cw))
  const yOf  = v => pT + ch - (v / maxV) * ch

  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 1
  ;[0, 0.5, 1].forEach(t => {
    const y = pT + ch * t
    ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(pL + cw, y); ctx.stroke()
  })

  function area(vals, color) {
    if (n < 2) return
    ctx.beginPath()
    vals.forEach((v, i) => i === 0 ? ctx.moveTo(xs[i], yOf(v)) : ctx.lineTo(xs[i], yOf(v)))
    ctx.lineTo(xs[n - 1], pT + ch)
    ctx.lineTo(xs[0], pT + ch)
    ctx.closePath()
    const g = ctx.createLinearGradient(0, pT, 0, pT + ch)
    g.addColorStop(0, color.replace('rgb', 'rgba').replace(')', ',0.15)'))
    g.addColorStop(1, color.replace('rgb', 'rgba').replace(')', ',0)'))
    ctx.fillStyle = g
    ctx.fill()
  }

  function line(vals, color, alpha) {
    if (n < 2) return
    ctx.beginPath()
    vals.forEach((v, i) => i === 0 ? ctx.moveTo(xs[i], yOf(v)) : ctx.lineTo(xs[i], yOf(v)))
    ctx.strokeStyle = color
    ctx.globalAlpha = alpha
    ctx.lineWidth   = 1.5
    ctx.lineJoin    = 'round'
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  area(data.map(d => d.total), 'rgb(255,255,255)')
  area(data.map(d => d.done),  'rgb(0,230,118)')
  line(data.map(d => d.total), 'rgba(255,255,255,0.2)', 1)
  line(data.map(d => d.done),  '#00e676', 1)

  data.forEach((d, i) => {
    if (d.total > 0) {
      ctx.beginPath()
      ctx.arc(xs[i], yOf(d.total), 2.5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fill()
    }
    if (d.done > 0) {
      ctx.beginPath()
      ctx.arc(xs[i], yOf(d.done), 2.5, 0, Math.PI * 2)
      ctx.fillStyle = '#00e676'
      ctx.fill()
    }

    ctx.fillStyle = d.isToday ? 'rgba(0,230,118,0.85)' : 'rgba(255,255,255,0.22)'
    ctx.font      = `${d.isToday ? '600 ' : ''}10px system-ui`
    ctx.textAlign = 'center'
    ctx.fillText(d.label, xs[i], h - 5)
  })
}

function showError(msg) {
  const old = $('homeError')
  if (old) old.remove()
  const el = document.createElement('p')
  el.id = 'homeError'
  el.textContent = msg
  el.style.cssText = 'color:#ff5252;font-size:0.8rem;margin-bottom:.75rem;'
  $('taskList').before(el)
  setTimeout(() => el.remove(), 3000)
}

function logout() {
  localStorage.clear()
  window.location.href = './login.html'
}

let resizeTimer
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(renderChart, 120)
})

async function init() {
  await loadMonthTasks()
  await selectDate(toISODate(new Date()))
  renderChart()
}

init()
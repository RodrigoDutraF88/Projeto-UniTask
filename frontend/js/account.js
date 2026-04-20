
import { apiGetTasks } from './api.js'


if (!localStorage.getItem('token')) {
  window.location.href = './login.html'
}

const avatarEl      = document.getElementById('avatarInitial')
const userNameEl    = document.getElementById('userName')
const userEmailEl   = document.getElementById('userEmail')
const statTotal     = document.getElementById('statTotal')
const statCompleted = document.getElementById('statCompleted')
const statPending   = document.getElementById('statPending')
const progressFill  = document.getElementById('progressFill')
const progressLabel = document.getElementById('progressLabel')

document.getElementById('btnHome').addEventListener('click', () => {
  window.location.href = './home.html'
})

document.getElementById('btnLogout').addEventListener('click', logout)
document.getElementById('btnLogoutFull').addEventListener('click', logout)


function loadUserInfo() {
  const name  = localStorage.getItem('userName')  || 'Usuário'
  const email = localStorage.getItem('userEmail') || '--'

  userNameEl.textContent  = name
  userEmailEl.textContent = email


  avatarEl.textContent = name.charAt(0).toUpperCase()
}


async function loadStats() {
  try {
    const tasks = await apiGetTasks()

    const total     = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending   = total - completed
    const percent   = total > 0 ? Math.round((completed / total) * 100) : 0

    statTotal.textContent     = total
    statCompleted.textContent = completed
    statPending.textContent   = pending
    progressFill.style.width  = `${percent}%`
    progressLabel.textContent = `${percent}% concluído`

  } catch (err) {
    statTotal.textContent     = '0'
    statCompleted.textContent = '0'
    statPending.textContent   = '0'
  }
}


function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  window.location.href = './login.html'
}

loadUserInfo()
loadStats()
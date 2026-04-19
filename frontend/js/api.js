const API_URL = 'http://localhost:3000'


function getToken() {
  return localStorage.getItem('token')
}
function buildHeaders(requiresAuth = false) {
  const headers = { 'Content-Type': 'application/json' }
  if (requiresAuth) {
    headers['Authorization'] = `Bearer ${getToken()}`
  }
  return headers
}

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options)
    const data = await response.json()

    if (!response.ok) {

      throw new Error(data.message || 'Erro desconhecido')
    }

    return data
  } catch (err) {

    throw err
  }
}


export async function apiLogin(email, senha) {
  return request('/auth/login', {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ email, senha })
  })
}

export async function apiRegister(nome, email, senha) {
  return request('/auth/register', {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ nome, email, senha })
  })
}

export async function apiGetTasks(date) {
  return request(`/tasks?date=${date}`, {
    method: 'GET',
    headers: buildHeaders(true)
  })
}

export async function apiCreateTask(titulo, date) {
  return request('/tasks', {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify({ titulo, date })
  })
}

export async function apiDeleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(true)
  })
}

export async function apiToggleTask(id, completed) {
  return request(`/tasks/${id}`, {
    method: 'PATCH',
    headers: buildHeaders(true),
    body: JSON.stringify({ completed })
  })
}
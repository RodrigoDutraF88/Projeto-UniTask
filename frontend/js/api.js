const API_URL = 'http://localhost:3000'

function getToken() {
  return localStorage.getItem('token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
}

function jsonHeaders() {
  return { 'Content-Type': 'application/json' }
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, options)
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Erro desconhecido')
  return data
}

export function apiLogin(email, senha) {
  return request('/auth/login', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, senha })
  })
}

export function apiRegister(nome, email, senha) {
  return request('/auth/register', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ nome, email, senha })
  })
}

export function apiGetTasks(date) {
  const q = date ? `?date=${encodeURIComponent(date)}` : ''
  return request(`/tasks${q}`, { method: 'GET', headers: authHeaders() })
}

export function apiGetTasksRange(from, to) {
  return request(`/tasks?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, {
    method: 'GET',
    headers: authHeaders()
  })
}

export function apiCreateTask(titulo, date) {
  return request('/tasks', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ titulo, date })
  })
}

export function apiToggleTask(id, completed) {
  return request(`/tasks/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ completed })
  })
}

export function apiDeleteTask(id) {
  return request(`/tasks/${id}`, { method: 'DELETE', headers: authHeaders() })
}
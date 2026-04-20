import { apiLogin, apiRegister } from './api.js'

let isCadastro = false

const form       = document.getElementById('authForm')
const emailInput = document.getElementById('email')
const senhaInput = document.getElementById('password')
const nomeGroup  = document.getElementById('nomeGroup')
const nomeInput  = document.getElementById('nome')
const submitBtn  = document.getElementById('submitBtn')
const toggleLink = document.getElementById('toggleLink')
const toggleText = document.getElementById('toggleText')
const errorMsg   = document.getElementById('errorMsg')

toggleLink.addEventListener('click', (e) => {
  e.preventDefault()
  isCadastro = !isCadastro

  if (isCadastro) {
    nomeGroup.style.display = 'block'
    submitBtn.textContent   = 'Cadastrar'
    toggleText.textContent  = 'Já tem conta? '
    toggleLink.textContent  = 'Entrar'
  } else {
    nomeGroup.style.display = 'none'
    submitBtn.textContent   = 'Entrar'
    toggleText.textContent  = 'Não tem conta? '
    toggleLink.textContent  = 'Cadastre-se'
  }

  hideError()
})

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  hideError()
  setLoading(true)

  const email = emailInput.value.trim()
  const senha = senhaInput.value.trim()

  try {
    if (isCadastro) {
      const nome = nomeInput.value.trim()
      if (!nome) return showError('Informe seu nome.')
      await apiRegister(nome, email, senha)
      isCadastro = false
      nomeGroup.style.display = 'none'
      submitBtn.textContent   = 'Entrar'
      toggleText.textContent  = 'Não tem conta? '
      toggleLink.textContent  = 'Cadastre-se'
      showSuccess('Cadastro realizado! Faça login.')

    } else {
      const data = await apiLogin(email, senha)
      localStorage.setItem('token', data.token)
 
      localStorage.setItem('userEmail', email)
      if (data.nome) localStorage.setItem('userName', data.nome)
      window.location.href = './home.html'
    }

  } catch (err) {
    showError(err.message)
  } finally {
    setLoading(false)
  }
})

function showError(msg) {
  errorMsg.textContent    = msg
  errorMsg.style.color    = '#ef4444'
  errorMsg.style.display  = 'block'
}

function showSuccess(msg) {
  errorMsg.textContent    = msg
  errorMsg.style.color    = '#22c55e'
  errorMsg.style.display  = 'block'
}

function hideError() {
  errorMsg.style.display = 'none'
}

function setLoading(loading) {
  submitBtn.disabled    = loading
  submitBtn.textContent = loading ? 'Aguarde...' : (isCadastro ? 'Cadastrar' : 'Entrar')
}
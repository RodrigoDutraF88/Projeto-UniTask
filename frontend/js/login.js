import { authAPI } from './api.js';

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('form');
  const registerLink = document.querySelector('.footer-text a');
  
  // Verifica se estamos na página de login ou de registro
  const isRegisterPage = window.location.pathname.includes('register');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Verifica se estamos lidando com login ou registro
      if (isRegisterPage) {
        // Registro
        const name = document.getElementById('name') ? document.getElementById('name').value : '';
        
        if (!name || !email || !password) {
          alert('Por favor, preencha todos os campos.');
          return;
        }
        
        try {
          // Chama a função de registro da API do backend
          const response = await authAPI.register({
            nome: name,
            email: email,
            senha: password
          });
          
          alert('Registro realizado com sucesso! Faça login para continuar.');
          window.location.href = 'login.html';
        } catch (error) {
          console.error('Erro de registro:', error);
          alert(error.message || 'Erro no registro');
        }
      } else {
        // Login
        if (!email || !password) {
          alert('Por favor, preencha todos os campos.');
          return;
        }
        
        try {
          // Chama a função de login da API do backend
          const response = await authAPI.login({
            email: email,
            senha: password
          });
          
          // Redireciona para a página inicial após login bem-sucedido
          window.location.href = 'home.html';
        } catch (error) {
          console.error('Erro de login:', error);
          alert(error.message || 'Credenciais inválidas');
        }
      }
    });
  }
  
  // Adiciona funcionalidade de navegação para o link de cadastro (se o link de cadastro existir)
  if (registerLink) {
    // Determina qual página deve ser carregada com base na página atual
    const isLoginPage = window.location.pathname.includes('login');
    
    registerLink.addEventListener('click', function(e) {
      e.preventDefault(); // Previne o comportamento padrão do link
      
      if (isLoginPage) {
        // Se estou na página de login, vou para a página de registro
        window.location.href = 'register.html';
      } else {
        // Se estou na página de registro, vou para a página de login
        window.location.href = 'login.html';
      }
    });
  }
});
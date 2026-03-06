// Configuração base para chamadas à API
const API_BASE_URL = 'http://localhost:3000';

// Função auxiliar para realizar requisições HTTP
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Adiciona o token de autenticação se disponível
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, config);
  
  // Se a resposta não for OK, lança um erro com a mensagem do backend
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: errorData.message || 'Erro na requisição',
      ...errorData
    };
  }

  // Retorna a resposta em JSON, exceto para DELETE
  if (response.status === 204 || endpoint.includes('/auth/logout')) {
    return {};
  }
  
  return await response.json();
}

// Funções de autenticação (usando Supabase/backend)
const authAPI = {
  // Registrar um novo usuário
  async register(userData) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Fazer login
  async login(credentials) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Armazena o token no localStorage para uso futuro
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  },

  // Obter informações do usuário autenticado
  async getMe() {
    return apiRequest('/auth/me');
  },

  // Logout - remove o token
  logout() {
    localStorage.removeItem('token');
  },

  // Verificar se o usuário está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

// Funções de tarefas (usando localStorage)
const tasksAPI = {
  // Obter todas as tarefas do usuário
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = localStorage.getItem('unitask-tasks');
        const tasksArray = tasks ? JSON.parse(tasks) : [];
        resolve({ tasks: tasksArray });
      }, 100);
    });
  },

  // Criar uma nova tarefa
  async create(taskData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = localStorage.getItem('unitask-tasks');
        const tasksArray = tasks ? JSON.parse(tasks) : [];
        const newTask = {
          id: Date.now(), // ID baseado no timestamp
          titulo: taskData.titulo,
          completed: false,
          created_at: new Date().toISOString()
        };
        
        tasksArray.push(newTask);
        localStorage.setItem('unitask-tasks', JSON.stringify(tasksArray));
        
        resolve({ task: newTask });
      }, 100);
    });
  },

  // Atualizar uma tarefa (marcar como concluída/incompleta)
  async update(taskId, taskData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const tasks = localStorage.getItem('unitask-tasks');
          const tasksArray = tasks ? JSON.parse(tasks) : [];
          const taskIndex = tasksArray.findIndex(t => t.id == taskId);
          
          if (taskIndex === -1) {
            reject({ message: 'Tarefa não encontrada' });
            return;
          }
          
          tasksArray[taskIndex] = {
            ...tasksArray[taskIndex],
            ...taskData
          };
          
          localStorage.setItem('unitask-tasks', JSON.stringify(tasksArray));
          resolve({ task: tasksArray[taskIndex] });
        } catch (error) {
          reject({ message: error.message });
        }
      }, 100);
    });
  },

  // Excluir uma tarefa
  async delete(taskId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const tasks = localStorage.getItem('unitask-tasks');
          const tasksArray = tasks ? JSON.parse(tasks) : [];
          const filteredTasks = tasksArray.filter(t => t.id != taskId);
          
          if (tasksArray.length === filteredTasks.length) {
            reject({ message: 'Tarefa não encontrada' });
            return;
          }
          
          localStorage.setItem('unitask-tasks', JSON.stringify(filteredTasks));
          resolve({ message: 'Tarefa excluída com sucesso' });
        } catch (error) {
          reject({ message: error.message });
        }
      }, 100);
    });
  }
};

// Exportar as funções para uso em outras partes do frontend
export { authAPI, tasksAPI, apiRequest };
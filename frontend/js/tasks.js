import { tasksAPI } from './api.js';

class TaskManager {
  constructor() {
    this.tasks = [];
    this.selectedDate = new Date().toDateString();
    this.init();
  }

  init() {
    // Carrega as tarefas quando a classe é iniciada
    this.loadTasks();
  }

  async loadTasks() {
    try {
      // Obtém as tarefas do localStorage via API simulada (backend real para autenticação, localStorage para tarefas)
      const response = await tasksAPI.getAll();
      
      // Atualiza as tarefas locais com os dados
      if(response.tasks && Array.isArray(response.tasks)) {
        // Mapeia as tarefas para o formato esperado pela interface
        this.tasks = response.tasks.map(task => ({
          id: task.id,
          text: task.titulo,
          completed: task.completed,
          date: task.created_at ? new Date(task.created_at).toDateString() : this.selectedDate
        }));
      } else {
        this.tasks = [];
      }
      
      // Atualiza a interface do usuário
      this.renderTasks();
      this.updateCounter();
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      alert('Erro ao carregar tarefas: ' + (error.message || 'Erro desconhecido'));
    }
  }

  async addTask(text) {
    if (!text.trim()) {
      alert("Digite uma tarefa!");
      return;
    }

    try {
      // Envia a nova tarefa para o localStorage via API simulada (backend real para autenticação, localStorage para tarefas)
      const response = await tasksAPI.create({
        titulo: text.trim()
      });

      // Adiciona a tarefa retornada
      if(response.task) {
        const newTask = {
          id: response.task.id,
          text: response.task.titulo,
          completed: response.task.completed,
          date: this.selectedDate
        };
        
        this.tasks.unshift(newTask); // Adiciona no início da lista
        this.renderTasks();
        this.updateCounter();
      } else {
        // Se não houver tarefa na resposta, recarrega a lista
        this.loadTasks();
      }
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      alert('Erro ao adicionar tarefa: ' + (error.message || 'Erro desconhecido'));
    }
  }

  async toggleTask(id) {
    const task = this.tasks.find(task => task.id === id);
    if (!task) return;

    try {
      // Atualiza a tarefa no localStorage via API simulada (backend real para autenticação, localStorage para tarefas)
      const response = await tasksAPI.update(id, {
        completed: !task.completed
      });

      // Atualiza a tarefa localmente com os dados
      if(response.task) {
        task.completed = response.task.completed;
        this.renderTasks();
        this.updateCounter();
      } else {
        // Se não houver tarefa na resposta, recarrega a lista
        this.loadTasks();
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      alert('Erro ao marcar tarefa como concluída: ' + (error.message || 'Erro desconhecido'));
    }
  }

  async deleteTask(id) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return;
    }

    try {
      // Exclui a tarefa do localStorage via API simulada (backend real para autenticação, localStorage para tarefas)
      await tasksAPI.delete(id);

      // Remove a tarefa localmente
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.renderTasks();
      this.updateCounter();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      alert('Erro ao excluir tarefa: ' + (error.message || 'Erro desconhecido'));
    }
  }

  renderTasks() {
    const taskList = document.getElementById("taskList");
    if (!taskList) return;

    taskList.innerHTML = "";

    // Filtra as tarefas pela data selecionada
    const filteredTasks = this.tasks.filter(task => task.date === this.selectedDate);

    filteredTasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "task-item";
      if (task.completed) li.classList.add("completed");

      li.innerHTML = `
        <span>${task.text}</span>
        <div class="task-btns">
          <button class="complete-btn" onclick="window.taskManager.toggleTask(${task.id})">
            ${task.completed ? "Desfazer" : "OK"}
          </button>
          <button class="delete-btn" onclick="window.taskManager.deleteTask(${task.id})">
            Excluir
          </button>
        </div>
      `;

      taskList.appendChild(li);
    });
  }

  updateCounter() {
    // Conta apenas as tarefas da data selecionada
    const filteredTasks = this.tasks.filter(task => task.date === this.selectedDate);
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.completed).length;

    const counterElement = document.getElementById("counter");
    if (counterElement) {
      counterElement.innerHTML = `Total no dia: <strong>${total}</strong> | Concluídas: <strong>${completed}</strong>`;
    }
  }

  // Atualiza a data selecionada e exibe as tarefas correspondentes
  updateSelectedDate(dateString) {
    this.selectedDate = dateString;
    this.renderTasks();
    this.updateCounter();
  }
}

// Inicializa o gerenciador de tarefas globalmente para ser usado no HTML
document.addEventListener('DOMContentLoaded', function() {
  window.taskManager = new TaskManager();
});
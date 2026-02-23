import { Router } from 'express';
import { CriarTarefa, ObterTarefas, AtualizarTarefa, ExcluirTarefa } from '../controllers/tasks.controller.js';
import { authMiddleware } from '../../middlewares/auth.middlewares.js';

const router = Router();

// Aplica o middleware de autenticação a todas as rotas abaixo
router.use(authMiddleware);

// Rota para criar uma nova tarefa
router.post('/tasks', CriarTarefa);

// Rota para obter todas as tarefas do usuário autenticado
router.get('/tasks', ObterTarefas);

// Rota para atualizar uma tarefa específica
router.put('/tasks/:id', AtualizarTarefa);

// Rota para excluir uma tarefa específica
router.delete('/tasks/:id', ExcluirTarefa);

export default router;
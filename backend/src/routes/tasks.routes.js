import { Router } from 'express'
import { criarTarefa, listarTarefas, completarTarefa, deletarTarefa } from '../controllers/tasks.controller.js'
import { authMiddleware } from '../../middlewares/auth.middlewares.js'

const router = Router()


router.post('/tasks', authMiddleware, criarTarefa)
router.get('/tasks', authMiddleware, listarTarefas)
router.patch('/tasks/:id', authMiddleware, completarTarefa)
router.delete('/tasks/:id', authMiddleware, deletarTarefa)

export default router
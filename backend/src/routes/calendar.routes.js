import { Router } from 'express'
import { criarEvento, listarEventos, deletarEvento } from '../controllers/calendar.controller.js'
import { authMiddleware } from '../../middlewares/auth.middlewares.js'

const router = Router()

router.post('/calendar', authMiddleware, criarEvento)
router.get('/calendar', authMiddleware, listarEventos)
router.delete('/calendar/:id', authMiddleware, deletarEvento)

export default router








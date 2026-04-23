import { Router } from 'express'
import { register, login } from '../controllers/auth.controller.js'
import { authMiddleware } from '../../middlewares/auth.middlewares.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)

router.get('/me', authMiddleware, (req, res) => {
  return res.json({ message: 'Você está autenticado', userId: req.userId })
})

export default router
import {Router} from 'express' //: Importa a ferramenta do Express que permite criar roteadores modulares.
import { register, login } from '../controllers/auth.controller.js' //mporta as funções de lógica que estão no Controller. Note que aqui você separa a "rota" da "lógica"
import { authMiddleware } from '../../middlewares/auth.middlewares.js' // Importa um "segurança". Esse middleware verifica se o token do usuário é válido antes de deixá-lo passar.

const router = Router()

router.post('/register' , register)

router.post('/login' , login)

router.get('/me', authMiddleware, (req, res) => { //Aqui você usa o middleware. A rota só funciona se o authMiddleware autorizar.
    return res.json({
        menssage: 'Você está autenticado',
        userId: req.userId
    })
})

router.get('/debug', authMiddleware, (req, res) => {
  return res.json({
    userId: req.userId
  })
})


export default router
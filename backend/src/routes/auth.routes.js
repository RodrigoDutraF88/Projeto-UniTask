import {Router} from 'express'

const router = Router()

router.post('/register' , (req, res) => {
    res.status(201).json({
        message: 'Usuário criado com sucesso'
    })
})

router.post('/login' , (req, res) => {
    res.status(200).json({
        message: 'Usuário logado com sucesso'
    })
})

export default router
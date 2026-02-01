import {Router} from 'express'

const router = Router()

router.post('/register' , (req, res) => {
    res.status(201).json({
        message: 'Usuário criado com sucesso'
    })
})

export default router

import router from './auth.routes.js'
import { CriarTarefa } from '../controllers/tasks.controller.js'
import { authMiddleware } from '../../middlewares/auth.middlewares.js'

router.use(authMiddleware) //todas as rotas abaixo dela automaticamente exigirão que o usuário esteja autenticado.
router.post('/tasks', CriarTarefa) //Segue o padrão de usar uma função importada do controller (CriarTarefa)
    

router.get('/tasks' , (req,res) => {
    res.status(200).json({
        menssage: "Tarefa acessada com sucesso"
    })
})

router.delete('/tasks/:id', (req, res) => {
    const id = req.params.id
    
    res.status(200).json({
        menssage : `Tarefa ${id} excluída`
    })
})
export default router
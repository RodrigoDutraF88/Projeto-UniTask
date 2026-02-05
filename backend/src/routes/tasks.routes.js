
import router from './auth.routes.js'
import { CriarTarefa } from '../controllers/tasks.controller.js'

router.post('/tasks', CriarTarefa)
    

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
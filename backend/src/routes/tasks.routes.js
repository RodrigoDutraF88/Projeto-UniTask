
import router from './auth.routes.js'

router.post('/tasks', (req, res) => {
    res.status(201).json({
        menssage: "Tarefa criada com sucesso"
    })
}) 

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
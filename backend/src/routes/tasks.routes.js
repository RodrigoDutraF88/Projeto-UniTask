
import router from './auth.routes.js'

router.post('/tasks', (req, res) => {
    res.status(201).json({
        menssage: "Tarefa criada com sucesso"
    })
}) 

router.delete('/tasks/:id', (req, res) => {
    res.status(204).send()
})
export default router
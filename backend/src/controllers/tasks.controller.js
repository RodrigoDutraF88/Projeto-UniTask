export async function CriarTarefa(req,res) {
    const  { titulo } = req.body

    if (!titulo){
        return res.status(400).json({
            message: "Título é obrigatório"
        })
    }

    return res.status(201).json({
        message: "Tarefa criada(fake)"
    })
    
}
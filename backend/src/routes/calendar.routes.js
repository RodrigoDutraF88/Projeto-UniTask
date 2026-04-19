import router from './auth.routes.js'

router.post('/calendar' , (req,res) => { 
    res.status(201).json({
        menssage: "Evento criado"
    })
})

router.get('/calendar', (req,res) => { 
    res.status(200).json({
        menssage: "Eventos acessados com sucesso"
    })
})

router.delete('/calendar/:id' , (req ,res) => { 
    const id = req.params.id

    res.status(200).json({
        menssage: `Evento ${id} excluído`
    })
})



export default router










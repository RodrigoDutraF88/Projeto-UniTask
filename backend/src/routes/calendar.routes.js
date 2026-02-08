import router from './auth.routes.js'

router.post('/calendar' , (req,res) => { //Cria um evento. Retorna o status 201 (Created), que é o código HTTP correto para quando algo é criado no banco de dados.
    res.status(201).json({
        menssage: "Evento criado"
    })
})

router.get('/calendar', (req,res) => { //Retorna uma lista de eventos com status 200 (OK).
    res.status(200).json({
        menssage: "Eventos acessados com sucesso"
    })
})

router.delete('/calendar/:id' , (req ,res) => { //:id é um parâmetro dinâmico. O código pega esse valor em req.params.id para saber exatamente qual evento deve ser excluído.
    const id = req.params.id

    res.status(200).json({
        menssage: `Evento ${id} excluído`
    })
})



export default router










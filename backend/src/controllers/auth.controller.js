import supabase from '../config/supabase.js'
import jwt from 'jsonwebtoken'

export async function register(req, res){
    const {nome, email, senha} = req.body

    if(!nome || !email || !senha){
        res.status(400).json({
            menssage: "Dados obrigatórios"
        })
    }

    const { error } = await supabase
        .from('users')
        .insert([{nome , email , senha}])

    if(error){
        return res.status(409).json({
            message: "Email já cadastrado"
        })
    }

    return res.status(201).json({
        message: "Usuário criado com sucesso"
    })
}

export async function login(req,res) {
    const {email, senha} = req.body

    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

    if(!user || user.senha != senha){
        res.status(401).json({
            menssage: "Crendeciais inválidas"
        })
    }

    const token = jwt.sign(
        {id: user.id},
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )

    return res.json({token})

  

    

    
    
}
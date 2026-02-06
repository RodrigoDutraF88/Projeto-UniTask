import supabase from '../config/supabase.js'
import jwt from 'jsonwebtoken'

export async function register(req, res) {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({
      message: "Dados obrigatórios"
    })
  }

  // 1️⃣ verificar se email já existe
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    return res.status(409).json({
      message: "Email já cadastrado"
    })
  }

  // 2️⃣ criar usuário
  const { error } = await supabase
    .from('users')
    .insert([{ nome, email, senha }])

  if (error) {
    return res.status(500).json({
      message: "Erro ao criar usuário"
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
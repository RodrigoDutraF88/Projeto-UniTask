import supabase from '../config/supabase.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


export async function register(req, res) {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({
      message: "Dados obrigatórios"
    })
  }

  // 1️⃣ verificar se email já existe
  const { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser && !existingUserError) {
    return res.status(409).json({
      message: "Email já cadastrado"    
       
    })
  }

  // Criptografa a senha antes de salvar
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(senha, saltRounds);

  // 2️⃣ criar usuário
  const { error } = await supabase
    .from('users')
    .insert([{ nome, email, senha: hashedPassword }])

  if (error) {
    return res.status(500).json({
      message: "Erro ao criar usuário"
    })
  }

  return res.status(201).json({
    message: "Usuário criado com sucesso"
  })
}


export async function login(req, res) {
  const { email, senha } = req.body

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return res.status(401).json({
      message: "Credenciais inválidas"
    })
  }

  // Verifica se a senha está criptografada no banco de dados
  let isPasswordValid = false;
  
  if (!user.senha) {
    // Se não há senha armazenada (caso raro), retorna erro
    return res.status(401).json({
      message: "Credenciais inválidas"
    });
  }
  
  // Verifica se a senha está no formato de hash bcrypt
  const isValidHash = typeof user.senha === 'string' && user.senha.startsWith('$2');
  
  if (isValidHash) {
    // Se a senha está criptografada, compara usando bcrypt
    isPasswordValid = await bcrypt.compare(senha, user.senha);
  } else {
    // Se a senha não está criptografada, faz comparação direta (para retrocompatibilidade)
    isPasswordValid = user.senha === senha;
  }
  
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Credenciais inválidas"
    })
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  return res.json({ token })
}

  

    

    
    

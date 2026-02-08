import jwt from 'jsonwebtoken' //criar tokens JWT verificar se um token é válido e decodificar as informações dentro do token

export function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization //Aqui você pega o header Authorization da requisição

    if(!authHeader){
        return res.status(401).json({ // retorna erro 401 (Não autorizado)
            menssage: "Token não enviado"
        })
    }

    const token = authHeader.split(' ')[1] //pega apenas o token, ignorando o "Bearer"

    try{ //capturar erro caso o token seja inválido ou expirado
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // Se tudo estiver certoretorna os dados que foram salvos no token (payload)

        req.userId = decoded.id // pega o id que estava dentro do token e salva em req.userId

        next() //o middleware libera a requisição a rota protegida é executada normalmente

    } catch {
        return res.status(401).json({
            menssage: "Token inválido"
        })
    }

    
}
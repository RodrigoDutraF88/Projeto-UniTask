import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authroutes from './src/routes/auth.routes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', authroutes)


app.get('/', (req, res) => {
  res.send('Servidor UniTask rodando 🚀')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`)
})



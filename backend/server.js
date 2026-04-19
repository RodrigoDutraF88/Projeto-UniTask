import express from 'express' 
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/auth.routes.js'
import taskRoutes from './src/routes/tasks.routes.js'
import calendarRoutes from './src/routes/calendar.routes.js'
import testRoutes from './src/routes/test.routes.js'

dotenv.config()

const app = express()


app.use(cors())
app.use(express.json()) 
app.use('/auth', authRoutes) 
app.use('', taskRoutes)
app.use('', calendarRoutes)
app.use("/", testRoutes)


app.get('/', (req, res) => { 
  res.send('Servidor UniTask rodando 🚀')
})

const PORT = process.env.PORT || 3000 

app.listen(PORT, () => { 
  console.log(`🔥 Servidor rodando na porta ${PORT}`)
})



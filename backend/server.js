import express from 'express' //Importa o Express, o framework que facilita a criação de servidores e rotas no Node.js.
import cors from 'cors'//(Cross-Origin Resource Sharing) é uma ferramenta de segurança que permite que seu aplicativo Mobile acesse este servidor mesmo estando em "lugares" diferentes.
import dotenv from 'dotenv'//serve para ler as variáveis de ambiente (como a porta ou chaves secretas).
import authRoutes from './src/routes/auth.routes.js'//trazendo as regras de login/registro
import taskRoutes from './src/routes/tasks.routes.js'
import calendarRoutes from './src/routes/calendar.routes.js'
import testRoutes from './src/routes/test.routes.js'

dotenv.config()//Ativa a leitura do arquivo .env para que o servidor saiba os segredos do projeto.

const app = express()//Cria a "instância" do seu servidor. A partir daqui, tudo o que você configurar será guardado nessa variável app.

//Middlewares (Os Filtros)
//Os Middlewares são funções que rodam antes da requisição chegar na rota final:
app.use(cors())
app.use(express.json()) //Ensina o servidor a entender mensagens enviadas no formato JSON
app.use('/auth', authRoutes) //Todas as rotas que começarem com /auth serão tratadas no arquivo auth.routes.js
app.use('', taskRoutes)
app.use('', calendarRoutes)
app.use("/", testRoutes)


app.get('/', (req, res) => { //Ela serve apenas para você abrir no navegador e confirmar que seu backend está "vivo" e funcionando.
  res.send('Servidor UniTask rodando 🚀')
})

const PORT = process.env.PORT || 3000 //Ele tenta pegar a porta do arquivo .env (comum em servidores de produção); se não achar, usa a porta 3000 como padrão.

app.listen(PORT, () => { //É o comando que efetivamente "liga" o motor. Ele trava o terminal e fica esperando conexões
  console.log(`🔥 Servidor rodando na porta ${PORT}`)
})



import { createClient } from '@supabase/supabase-js' //Você está trazendo a ferramenta oficial do Supabase para dentro do seu projeto. É como pedir a chave mestra da fábrica.
import dotenv from 'dotenv'//Carrega uma biblioteca que permite ao seu código ler arquivos de texto escondidos (o seu .env).

dotenv.config()//Dá o comando: "Ei, abra o arquivo .env agora e guarde as informações na memória"

const supabase = createClient( //O createClient usa a URL e a KEY que ele leu do .env para criar a conexão oficial.
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default supabase
//Você "empacota" essa conexão pronta para que outros arquivos (como seus controllers) possam usá-la sem ter que configurar tudo de novo.
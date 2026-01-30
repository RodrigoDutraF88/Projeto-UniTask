require('dotenv').config(); // Isso carrega as variáveis do .env

const port = process.env.PORT || 3000; 

console.log(`Servidor rodando na porta ${port}`);
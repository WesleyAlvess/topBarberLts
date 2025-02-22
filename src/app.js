// Importando módulos e configurações
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/database.js';
import salaoRouter from './routes/salao.route.js'
import Usuario from './routes/usuario.route.js'

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
// Rotas para salões
app.use('/api', salaoRouter);

// Rotas para usuários
app.use('/api/user', Usuario);


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));

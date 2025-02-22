// Importando módulos e configurações
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/database.js';
import salaoRouter from './routes/salao.route.js'

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
app.use('/api', salaoRouter);


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));

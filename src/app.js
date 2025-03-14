// Importando módulos e configurações
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/database.js';

// Importando Rotas
import SalaoRouter from './routes/salao.route.js'
import UsuarioRouter from './routes/usuario.route.js'
import ServicoRouter from './routes/servico.route.js'
import HorarioRouter from './routes/horario.route.js'
import AgendamentoRouter from './routes/agendamento.route.js'

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: 'http://192.168.0.10', // Altere para o IP do seu app ou o domínio
  methods: 'GET,POST,PUT,DELETE',
};

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));

// Rotas
// Rotas para salões
app.use('/api', SalaoRouter);

// Rotas para usuários
app.use('/api/user', UsuarioRouter);

// Rotas para serviços
app.use('/api/services', ServicoRouter);

// Rotas para horários
app.use('/api/time', HorarioRouter);

// Rotas para agendamentos
app.use('/api/booking', AgendamentoRouter);


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));

import express from 'express';
const router = express.Router();

// Importando models
import Horario from '../models/horario.model.js';
import Salao from '../models/salao.model.js';

// Importando controllers
import {
  getHorario,
  createHorario,
  updateHorario,
  deleteHorario,
} from '../controllers/horario.controller.js';

// Middleware para verificar se o token JWT está presente e válido
import { verificarToken } from '../middlewares/autenticacao.middleware.js';

// Middleware para verificar se o usuário é dono do salão
import { verificaDonoRecurso } from '../middlewares/verificaDonoRecurso.middleware.js';

// 🔓 Rotas públicas
router.get('/:salaoId', getHorario); // Listar horários do salão

// // 🔒 Rotas protegidas (apenas donos do salão podem gerenciar horários)
router.post('/:salaoId', verificarToken, verificaDonoRecurso(Salao), createHorario); // Criar horário
router.patch('/:salaoId/:id', verificarToken, verificaDonoRecurso(Salao), updateHorario); // Atualizar horário
router.delete('/:salaoId/:id', verificarToken, verificaDonoRecurso(Salao), deleteHorario); // Deletar horário

export default router;

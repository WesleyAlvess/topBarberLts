import express from 'express';
const router = express.Router()

// Importando models
import Salao from '../models/salao.model.js' // Importando modelo Salao

// Importando controllers
import {
  createServico,
  getServicos,
  getServicoById,
  updateServico,
  deleteServico,
} from '../controllers/servico.controller.js'

// Middleware para verificar se o token JWT está presente e válido
import { verificarToken } from "../middlewares/autenticacao.middleware.js";

// Middleware para verificar se o usuário é dono do salão
import { verificaDonoRecurso } from "../middlewares/verificaDonoRecurso.middleware.js";

// 🔓 Rotas públicas
router.get("/:salaoId", getServicos); // Listar serviços de um salão
router.get("/:salaoId/:id", getServicoById); // Listar um serviço específico
// router.get("/:salaoId/horarios", getHorarios); // Listar horários disponíveis do salão

// // 🔒 Rotas protegidas (apenas donos do salão podem gerenciar serviços e horários)
router.post("/:salaoId", verificarToken, verificaDonoRecurso(Salao), createServico); // Criar serviço
router.patch("/:salaoId/:id", verificarToken, verificaDonoRecurso(Salao), updateServico); // Atualizar serviço
router.delete("/:salaoId/:id", verificarToken, verificaDonoRecurso(Salao), deleteServico); // Deletar serviço

// router.post("/:salaoId/horarios", verificarToken, verificaDonoRecurso(Salao), createHorario); // Criar horário
// router.delete("/:salaoId/horarios/:id", verificarToken, verificaDonoRecurso(Salao), deleteHorario); // Remover horário

export default router;

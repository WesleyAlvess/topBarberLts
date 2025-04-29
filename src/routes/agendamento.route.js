import express from "express";
const router = express.Router();

import {
  createAgendamento,
  listarAgendamentos,
  listarAgendamentoById,
  cancelarAgendamento,
  verificaSeTemAgendamento,
} from "../controllers/agendamento.controller.js";

// Middleware para verificar autenticação
import { verificarToken } from "../middlewares/autenticacao.middleware.js"

// 🔓 Rotas públicas
router.get("/verificar/:salaoId", verificarToken, verificaSeTemAgendamento); // Verifica se tem um agendamento.
router.get("/:salaoId", verificarToken, listarAgendamentos); // Listar agendamentos de um salão
router.get("/:salaoId/:id", verificarToken, listarAgendamentoById); // Obter um agendamento específico


// 🔒 Rotas protegidas (usuário autenticado pode criar, editar e cancelar)
router.post("/:salaoId", verificarToken, createAgendamento); // Criar um agendamento
router.put("/:id", verificarToken, cancelarAgendamento); // Cancelar agendamento

export default router;

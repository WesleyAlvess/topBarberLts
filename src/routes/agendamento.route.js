import express from "express";
const router = express.Router();

import {
  createAgendamento,
  // getAllAgendamentos,
  // getOneAgendamento,
  // updateAgendamento,
  // deleteAgendamento,
} from "../controllers/agendamento.controller.js";

// Middleware para verificar autenticação
import { verificarToken } from "../middlewares/autenticacao.middleware.js"

// 🔓 Rotas públicas
// router.get("/:salaoId", verificarToken, getAgendamentos); // Listar agendamentos de um salão
// router.get("/:salaoId/:id", verificarToken, getAgendamentoById); // Obter um agendamento específico


// 🔒 Rotas protegidas (usuário autenticado pode criar, editar e cancelar)
router.post("/:salaoId", verificarToken, createAgendamento); // Criar um agendamento
// router.patch("/:salaoId/:id", verificarToken, updateAgendamento); // Atualizar status de um agendamento (ex: concluir, cancelar)
// router.delete("/:salaoId/:id", verificarToken, deleteAgendamento); // Cancelar agendamento

export default router;

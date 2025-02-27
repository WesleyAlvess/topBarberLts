import express from "express";
const router = express.Router();

// Importando controllers
import {
  createUsuario,
  loginUsuario,
  authUsuarioPerfil,
  updateSenhaPerfil,
  updateDadosPerfil,
  deleteContaUsuario
} from "../controllers/usuario.controller.js";

// Middleware para verificar se o token JWT está presente e válido
import { verificarToken } from "../middlewares/autenticacao.middleware.js";


// 🔓 Rotas públicas (não precisam de autenticação)
router.post("/", createUsuario); // Criar um novo usuário (cliente)
router.post("/login", loginUsuario); // Login do usuário


// 🔒 Rota protegida - apenas usuários autenticados podem acessar
router.get("/perfil", verificarToken, authUsuarioPerfil); // Buscar dados do perfil

// Atualizações de dados
router.put("/alterar-senha", verificarToken, updateSenhaPerfil); // Atualizar senha
router.patch("/atualizar-perfil", verificarToken, updateDadosPerfil); // Atualizar dados do perfil

// Exclusão de conta
router.delete("/deletar", verificarToken, deleteContaUsuario); // Deletar usuário

export default router;

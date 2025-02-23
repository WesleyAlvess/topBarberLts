import express from "express";
const router = express.Router();

// Importando controllers
import {
  createUsuario,
  loginUsuario,
  authUsuarioPerfil,
  updateSenhaPerfil,
  updateDadosPerfil,
} from "../controllers/usuario.controller.js";

// Middleware para verificar se o token JWT está presente e válido
import { verificarToken } from "../middlewares/autenticacao.middleware.js";

// Rota para criar um novo usuário (cliente ou profissional)
router.post("/", createUsuario);

// Rota para login do usuário
router.post("/login", loginUsuario);

// 🔒 Rota protegida - apenas usuários autenticados podem acessar

// Rota para buscar o perfil do usuário
router.get("/perfil", verificarToken, authUsuarioPerfil);

// Rota para atualizar a senha do usuário
router.put("/alterar-senha", verificarToken, updateSenhaPerfil);

// Rota para atualizar dados do perfil do usuário
router.put("/atualizar-perfil", updateDadosPerfil);

export default router;

import express from "express";
import { createUsuario, loginUsuario, getUsuarioById, updateUsuario, deleteUsuario } from "../controllers/userController.js";

const router = express.Router();

// Rota para criar um novo usuário (cliente ou profissional)
router.post("/", createUsuario);

// Rota para login do usuário
router.post("/login", loginUsuario);

// Rota para buscar um usuário pelo ID
router.get("/:id", getUsuarioById);

// Rota para atualizar um usuário existente
router.put("/:id", updateUsuario);

// Rota para deletar um usuário
router.delete("/:id", deleteUsuario);

export default router;

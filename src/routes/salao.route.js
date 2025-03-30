import express from 'express';
const router = express.Router(); // Criando um router para rotas

// Importando controllers
import {
  createSalao, getSalao, getSalaoById, updateSalao, deleteSalao,
  authSalaoPerfil
} from '../controllers/salao.controller.js';

import { verificarToken } from '../middlewares/autenticacao.middleware.js'; // Middleware para verificar se o token JWT está presente e válido
import { verificaDonoRecurso } from '../middlewares/verificaDonoRecurso.middleware.js';  // Middleware para verificar se o usuário é dono do salão
import Salao from '../models/salao.model.js' // Importando modelo Salao

// 🔒 Rota protegidas, busca dados do perfil salao
router.get("/salao", verificarToken, authSalaoPerfil); // Buscar dados do salão

// 🔓 Rotas públicas (qualquer um pode acessar)
router.get('/', getSalao); // Listar todos os salões
router.get('/:id', getSalaoById); // Listar um salão específico

// 🔒 Rotas protegidas (apenas usuários autenticados podem acessar)
router.post('/', verificarToken, createSalao); // Criar um novo salão


// 🔒 Rotas protegidas com verificação de propriedade (apenas donos do salão podem alterar dados)
router.patch('/:id', verificarToken, verificaDonoRecurso(Salao), updateSalao); // Atualizar dados do salão
router.delete('/:id', verificarToken, verificaDonoRecurso(Salao), deleteSalao); // Deletar salão

export default router;

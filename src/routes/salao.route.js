import express from 'express';
const router = express.Router(); // Criando um router para rotas

// Importando controllers
import { 
  createSalao, getSalao, getSalaoById, updateSalao, deleteSalao 
} from '../controllers/salao.controller.js';

import { verificarToken } from '../middlewares/autenticacao.middleware.js'; // Middleware para verificar se o token JWT está presente e válido
import { verificaDonoRecurso } from '../middlewares/verificaDonoRecurso.middleware.js';  // Middleware para verificar se o usuário é dono do salão
import Salao from '../models/salao.model.js' // Importando modelo Salao


// 🔓 Rotas públicas (qualquer um pode acessar)
router.get('/', getSalao);
router.get('/:id', getSalaoById);

// 🔒 Rotas protegidas (apenas usuários autenticados podem acessar)
router.post('/', verificarToken, createSalao);

// 🔒 Rotas protegidas com verificação de propriedade (apenas donos do salão podem alterar dados)
router.patch('/:id', verificarToken, verificaDonoRecurso(Salao), updateSalao);
router.delete('/:id', verificarToken, verificaDonoRecurso(Salao), deleteSalao);

export default router;
  
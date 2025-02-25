import express from 'express';
import { createSalao, getSalao, getSalaoById, updateSalao, deleteSalao} from '../controllers/salao.controller.js';

const router = express.Router();

// Middleware para verificar se o token JWT está presente e válido
import { verificarToken } from '../middlewares/autenticacao.middleware.js';

// Rota para listar todos os salões
router.get('/', getSalao) // Qualquer um pode visualizar os salões

// Rota para buscar um salão por ID
router. get('/:id', getSalaoById) // Qualquer um pode buscar um salão


// 🔒 Rota protegida - apenas usuários autenticados podem acessar
// Rota para criar um novo salão
router.post('/', verificarToken, createSalao) // Apenas usuários autenticados podem criar um salão

// Rota para atualizar um salão
router.put('/:id', verificarToken, updateSalao) // O usuário precisa estar autenticado e ser o dono do salão

// Rota para deletar um salão
router.delete('/:id', verificarToken, deleteSalao) // Só o dono pode deletar o salã

export default router;

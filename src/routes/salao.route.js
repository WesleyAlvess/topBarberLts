import express from 'express';
import { createSalao, getSalao, getSalaoById, updateSalao, deleteSalao} from '../controllers/salao.controller.js';

const router = express.Router();

// Rota para criar um novo salão
router.post('/', createSalao) // Apenas usuários autenticados podem criar um salão

// Rota para listar todos os salões
router.get('/', getSalao) // Qualquer um pode visualizar os salões

// Rota para buscar um salão por ID
router. get('/:id', getSalaoById) // Qualquer um pode visualizar o salão, mas só o dono pode editar ou deletar

// Rota para atualizar um salão
router.put('/:id', updateSalao) // O usuário precisa estar autenticado e ser o dono do salão

// Rota para deletar um salão
router.delete('/:id', deleteSalao) // Qualquer um pode visualizar o salão, mas só o dono pode editar ou deletar

export default router;

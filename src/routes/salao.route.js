import express from 'express';
import { createSalao, getSalao, getSalaoById, updateSalao, deleteSalao} from '../controllers/salao.controller.js';

const router = express.Router();

// Rota para criar um novo salão
router.post('/', createSalao);

// Rota para listar todos os salões
router.get('/', getSalao)

// Rota para buscar um salão por ID
router. get('/:id', getSalaoById)

// Rota para atualizar um salão
router.put('/:id', updateSalao)

// Rota para deletar um salão
router.delete('/:id', deleteSalao)

export default router;

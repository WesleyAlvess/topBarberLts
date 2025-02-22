import express from 'express';
import { createSalao } from '../controllers/salao.controller.js';

const router = express.Router();

// Rota para criar um novo salão
router.post('/', createSalao);
router.get('/', )


export default router;

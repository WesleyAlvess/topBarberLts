import express from 'express';
import { createSalao } from '../controllers/salao.controller.js';

const router = express.Router();

router.post('/', createSalao);

export default router;

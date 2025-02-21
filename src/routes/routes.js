import express from 'express';
import { createSalao } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createSalao);

export default router;

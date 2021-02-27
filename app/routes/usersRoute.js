import express from 'express';

import { createUser, siginUser } from '../controllers/usersController.js';

const router = express.Router();

// users Routes

router.post('/auth/signup', createUser);
router.post('/auth/signin', siginUser);

export default router;

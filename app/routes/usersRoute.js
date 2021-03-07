import express from 'express';

import { createUser, siginUser } from '../controllers/usersController.js';
import {getUsers} from "../controllers/usersController.js";

const router = express.Router();


router.post('/auth/signup', createUser);
router.post('/auth/signin', siginUser);
router.get('/users', getUsers);


export default router;

import express from 'express';
import { createUser, siginUser } from '../controllers/usersController.js';
import pool from "../db/dev/pool.js";

const router = express.Router();


router.post('/auth/signup', createUser);
router.post('/auth/signin', siginUser);
router.get('/users', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        let users = await pool.query(`SELECT * FROM users LIMIT $1 OFFSET $2`, [limit, (page - 1) * limit])
        users = users.rows
        const usersLength = await pool.query(`SELECT * FROM users`)
        const count = usersLength.rows.length
        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        console.error(err.message);
    }
});


export default router;

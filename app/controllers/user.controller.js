const pool = require('../db/dev/pool.js')


const getUsers = async (req, res) => {
    const signinUserQuery = `SELECT * FROM users`;
    const users = await pool.query(signinUserQuery)
    return res.json(users.rows)
};

const deleteUser = async (req, res) => {
    const id = req.params.id
    const user = await pool.query(`DELETE FROM users WHERE id = $1`, [id])
    return res.json(user.rows)
};

const paginatedUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        let users = await pool.query(`SELECT * FROM users LIMIT $1 OFFSET $2`, [limit, (page - 1) * limit])
        users = users.rows
        const usersLength = await pool.query(`SELECT * FROM users`)
        const count = usersLength.rows.length
        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalCount: count
        });
    } catch (err) {
        console.error(err.message);
    }
}

const userMethods =  {
    getUsers,
    deleteUser,
    paginatedUsers
}

module.exports = userMethods

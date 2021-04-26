const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')

const deleteUser = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM users WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }

};

const paginatedUsers = async (req, res) => {
    const {page = 1, limit = 10, searchQuery = "default"} = req.query;
    let users, count
    try {
        if (searchQuery === "default") {
            users = await pool.query(`SELECT * FROM users order by id LIMIT $1 OFFSET $2`, [limit, (page - 1) * limit])
            count = await pool.query(`SELECT COUNT(*) FROM users`)
            users = users.rows
        } else {
            users = await pool.query(`SELECT * FROM users WHERE username ILIKE $1 order by id LIMIT $2 OFFSET $3`, [searchQuery + "%", limit, (page - 1) * limit])
            count = await pool.query(`SELECT COUNT(*) FROM users WHERE username ILIKE $1`, [searchQuery + "%"])
            users = users.rows
        }
        res.json({
            users,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: parseInt(count.rows[0].count)
        });
    } catch (err) {
        console.error(err.message);
    }
}

const userMethods = {
    deleteUser,
    paginatedUsers
}

module.exports = userMethods

const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')


checkDuplicateUsernameOrEmail = async (req, res, next) => {
    const {username, email} = req.body;
    const checkUsername = 'SELECT username FROM users WHERE username = $1';
    const person = await pool.query(checkUsername, [username]);
    let dbResponse = person.rows[0];
    if (dbResponse) {
        errorMessage.error = 'User with this username exist';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const checkEmail = 'SELECT email FROM users WHERE email = $1';
        const personEmail = await pool.query(checkEmail, [email]);
        dbResponse = personEmail.rows[0];
        if (dbResponse) {
            errorMessage.error = 'User with this email exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')


checkDuplicateUsernameOrEmail = async (req, res, next) => {
    const {username, email, password} = req.body;
    if (username === "" || password === "" || email === ""){
        errorMessage.error = 'Поля не могут быть пустыми';
        return res.status(status.notfound).send(errorMessage);
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
        errorMessage.error = 'Email не корректен';
        return res.status(status.conflict).send(errorMessage);
    }
    const checkUsername = 'SELECT username FROM users WHERE username = $1';
    const person = await pool.query(checkUsername, [username]);
    let dbResponse = person.rows[0];
    if (dbResponse) {
        errorMessage.error = 'Пользователь с таким именем уже существует';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const checkEmail = 'SELECT email FROM users WHERE email = $1';
        const personEmail = await pool.query(checkEmail, [email]);
        dbResponse = personEmail.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Пользователь с таким email уже существует';
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
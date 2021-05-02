const {hashPassword, comparePassword, generateUserToken} = require('../helpers/validations.js')
const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')

exports.signup = async (req, res) => {
    const {username, email, password} = req.body;
    const hashedPassword = hashPassword(password);
    const createUserQuery = `INSERT INTO users(username, email, password) VALUES($1, $2, $3) returning *`;
    const values = [
        username,
        email,
        hashedPassword,
    ];
    try {
        const newPerson = await pool.query(createUserQuery, values);
        const dbResponse = newPerson.rows[0];
        delete dbResponse.password;
        successMessage.data = dbResponse;
        return res.status(status.created).send(successMessage);
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

exports.signin = async (req, res) => {
    const {username, password} = req.body;
    if (username === "" || password === ""){
        errorMessage.error = 'Поля не могут быть пустыми';
        return res.status(status.notfound).send(errorMessage);
    }
    const signinUserQuery = 'SELECT * FROM users WHERE username = $1';
    try {
        const person = await pool.query(signinUserQuery, [username]);
        const dbResponse = person.rows[0];
        if (!dbResponse) {
            errorMessage.error = 'Пользователь с таким именем не существует';
            return res.status(status.notfound).send(errorMessage);
        }
        if (!comparePassword(dbResponse.password, password)) {
            errorMessage.error = 'Не верный пароль';
            return res.status(status.bad).send(errorMessage);
        }
        const token = generateUserToken(dbResponse.id, dbResponse.username, dbResponse.email);
        delete dbResponse.password;
        successMessage.data = dbResponse;
        successMessage.data.accessToken = token;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

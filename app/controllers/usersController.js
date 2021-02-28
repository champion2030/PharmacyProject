import dbQuery from '../db/dev/dbQuery.js';

import {
    comparePassword,
    generateUserToken,
    hashPassword,
    isEmpty,
    isValidEmail,
    validatePassword,
} from '../helpers/validations.js';

import {errorMessage, status, successMessage,} from '../helpers/status.js';

/**
 * Create A User
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const createUser = async (req, res) => {
    const {
        userName, email, password,
    } = req.body;

    if (isEmpty(userName) || isEmpty(password) || isEmpty(email)) {
        errorMessage.error = 'Password, userName, email field cannot be empty';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email)) {
        errorMessage.error = 'Please enter a valid Email';
        return res.status(status.bad).send(errorMessage);
    }
    if (!validatePassword(password)) {
        errorMessage.error = 'Password must be more than six(6) characters';
        return res.status(status.bad).send(errorMessage);
    }
    const hashedPassword = hashPassword(password);
    const createUserQuery = `INSERT INTO
      users(userName, email, password)
      VALUES($1, $2, $3)
      returning *`;
    const values = [
        userName,
        email,
        hashedPassword,
    ];

    try {
        const {rows} = await dbQuery.query(createUserQuery, values);
        const dbResponse = rows[0];
        delete dbResponse.password;
        const token = generateUserToken(dbResponse.id, dbResponse.username, dbResponse.email);
        successMessage.data = dbResponse;
        successMessage.data.token = token;
        return res.status(status.created).send(successMessage);
    } catch (error) {
        if (error.routine === '_bt_check_unique') {
            errorMessage.error = 'User with that USERNAME already exist';
            return res.status(status.conflict).send(errorMessage);
        }
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

/**
 * Signin
 * @param {object} req
 * @param {object} res
 * @returns {object} user object
 */
const siginUser = async (req, res) => {
    const {userName, password} = req.body;
    if (isEmpty(userName) || isEmpty(password)) {
        errorMessage.error = 'UserName or Password detail is missing';
        return res.status(status.bad).send(errorMessage);
    }
    if (!validatePassword(password)) {
        errorMessage.error = 'Please enter a valid Password';
        return res.status(status.bad).send(errorMessage);
    }
    const signinUserQuery = 'SELECT * FROM users WHERE userName = $1';
    try {
        const {rows} = await dbQuery.query(signinUserQuery, [userName]);
        const dbResponse = rows[0];
        if (!dbResponse) {
            errorMessage.error = 'User with this userName does not exist';
            return res.status(status.notfound).send(errorMessage);
        }
        if (!comparePassword(dbResponse.password, password)) {
            errorMessage.error = 'The password you provided is incorrect';
            return res.status(status.bad).send(errorMessage);
        }
        const token = generateUserToken(dbResponse.id, dbResponse.userName, dbResponse.email);
        delete dbResponse.password;
        successMessage.data = dbResponse;
        successMessage.data.token = token;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const getUsers = async (req, res) => {
    const signinUserQuery = 'SELECT * FROM users';
    successMessage.data = await dbQuery.query(signinUserQuery)
    return res.status(status.success).send(successMessage)


};


export {
    createUser,
    siginUser,
    getUsers
};

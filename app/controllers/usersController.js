import {
    comparePassword,
    generateUserToken,
    hashPassword,
} from '../helpers/validations.js';

import {errorMessage, status, successMessage,} from '../helpers/status.js';
import pool from "../db/dev/pool.js";

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
        const newPerson = await pool.query(createUserQuery, values);
        const dbResponse = newPerson.rows[0];
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
    const signinUserQuery = 'SELECT * FROM users WHERE userName = $1';
    try {
        const person = await pool.query(signinUserQuery, [userName]);
        const dbResponse = person.rows[0];
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
    const signinUserQuery = `SELECT * FROM users`;
    const users = await pool.query(signinUserQuery)
    return res.json(users.rows)
};


export {
    createUser,
    siginUser,
    getUsers,
};

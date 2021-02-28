import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../../env.js';

/**
 * Hash Password Method
 * @param {string} password
 * @returns {string} returns hashed password
 */
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = password => bcrypt.hashSync(password, salt);

/**
 * comparePassword
 * @param hashedPassword
 * @param {string} password
 * @returns {Boolean} return True or False
 */
const comparePassword = (hashedPassword, password) => {
    return bcrypt.compareSync(password, hashedPassword);
};

/**
 * isValidEmail helper method
 * @param {string} email
 * @returns {Boolean} True or False
 */
export const isValidEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};

/**
 * validatePassword helper method
 * @param {string} password
 * @returns {Boolean} True or False
 */
const validatePassword = (password) => {
    return !(password.length < 6 || password === '');
};
/**
 * isEmpty helper method
 * @param {string} input
 * @returns {Boolean} True or False
 */
const isEmpty = (input) => {
    if (input === undefined || input === '') {
        return true;
    }
    return !input.replace(/\s/g, '').length;
};

/**
 * empty helper method
 * @param {string} input
 * @returns {Boolean} True or False
 */
const empty = (input) => {
    if (input === undefined || input === '') {
        return true;
    }
};

/**
 * Generate Token
 * @param {string} id
 * @param userName
 * @param email
 * @returns {string} token
 */
const generateUserToken = (id, userName, email) => {
    return jwt.sign({
            user_id: id,
            userName,
            email
        },
        env.secret, {expiresIn: '3d'});
};


export {
    hashPassword,
    comparePassword,
    validatePassword,
    isEmpty,
    empty,
    generateUserToken,
};

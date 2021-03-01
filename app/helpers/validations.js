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
    generateUserToken,
};

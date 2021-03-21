const  bcrypt  = require('bcryptjs')
const  jwt  = require('jsonwebtoken')
const  env  = require('../../env.js')


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
            userId: id,
            userName,
            email
        },
        env.secret, {expiresIn: '3d'});
};


const validation = {
    hashPassword,
    comparePassword,
    generateUserToken,
};

module.exports = validation

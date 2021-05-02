const  bcrypt  = require('bcryptjs')
const  jwt  = require('jsonwebtoken')
const  env  = require('../../env.js')

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = password => bcrypt.hashSync(password, salt);

const comparePassword = (hashedPassword, password) => {
    return bcrypt.compareSync(password, hashedPassword);
};

const generateUserToken = (id, userName, email) => {
    return jwt.sign({
            userId: id,
            userName,
            email
        },
        env.secret, {expiresIn: '100y'});
};


const validation = {
    hashPassword,
    comparePassword,
    generateUserToken,
};

module.exports = validation

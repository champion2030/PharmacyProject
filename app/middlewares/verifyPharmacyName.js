const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

checkDuplicatePharmacyName = async (req, res, next) => {
    const {name} = req.body;
    if (name === "") {
        errorMessage.error = 'Name can not be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const Query = 'SELECT name FROM pharmacy_name WHERE name = $1';
        const check = await pool.query(Query, [name]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Name already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
};

checkDuplicatePharmacyNameOnUpdate = async (req, res, next) => {
    const id = req.params.id
    const {name} = req.body;
    if (name === "") {
        errorMessage.error = 'Name can not be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const Query = 'SELECT name FROM pharmacy_name WHERE name = $1 AND id != $2';
        const check = await pool.query(Query, [name, id]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Name already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
};

const verifyPharmacyName = {
    checkDuplicatePharmacyName: checkDuplicatePharmacyName,
    checkDuplicatePharmacyNameOnUpdate: checkDuplicatePharmacyNameOnUpdate
};

module.exports = verifyPharmacyName;
const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

checkDuplicateTypeOfProperty = async (req, res, next) => {
    const {name_of_property} = req.body;
    if (name_of_property === "") {
        errorMessage.error = 'Type of property cannot be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const Query = 'SELECT name_of_property FROM type_of_property WHERE name_of_property = $1';
        const check = await pool.query(Query, [name_of_property]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Type of property already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
};

checkDuplicateTypeOfPropertyOnUpdate = async (req, res, next) => {
    const id = req.params.id
    const {name_of_property} = req.body;
    if (name_of_property === "") {
        errorMessage.error = 'Type of property cannot be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const Query = 'SELECT name_of_property FROM type_of_property WHERE name_of_property = $1 AND id != $2';
        const check = await pool.query(Query, [name_of_property, id]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Type of property already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
};

const verifyTypeOfProperty = {
    checkDuplicateTypeOfProperty: checkDuplicateTypeOfProperty,
    checkDuplicateTypeOfPropertyOnUpdate: checkDuplicateTypeOfPropertyOnUpdate
};

module.exports = verifyTypeOfProperty;
const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

checkDuplicateArea = async (req, res, next) => {
    const {name_of_area} = req.body;
    if (name_of_area === ""){
        errorMessage.error = 'Area cannot be null';
        return res.status(status.conflict).send(errorMessage);
    }else {
        const Query = 'SELECT name_of_area FROM area WHERE name_of_area = $1';
        const check = await pool.query(Query, [name_of_area]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Area already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
};

checkDuplicateAreaOnUpdate = async (req, res, next) => {
    const id = req.params.id
    const {name_of_area} = req.body;
    if (name_of_area === ""){
        errorMessage.error = 'Area cannot be null';
        return res.status(status.conflict).send(errorMessage);
    }else {
        const Query = 'SELECT name_of_area FROM area WHERE name_of_area = $1 AND id != $2';
        const check = await pool.query(Query, [name_of_area, id]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Area already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
};

const verifyArea = {
    checkDuplicateArea: checkDuplicateArea,
    checkDuplicateAreaOnUpdate: checkDuplicateAreaOnUpdate
};

module.exports = verifyArea;
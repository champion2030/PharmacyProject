const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')


checkDuplicateReasonForReturn = async (req, res, next) => {
    const {reason_for_return} = req.body;
    const Query = 'SELECT reason_for_return FROM reason_for_return WHERE reason_for_return = $1';
    const check = await pool.query(Query, [reason_for_return]);
    let dbResponse = check.rows[0];
    if (dbResponse) {
        errorMessage.error = 'Such reason already exist';
        return res.status(status.conflict).send(errorMessage);
    } else {
        next()
    }
};

const verifyReasonForReturn = {
    checkDuplicateReasonForReturn: checkDuplicateReasonForReturn,
};

module.exports = verifyReasonForReturn;
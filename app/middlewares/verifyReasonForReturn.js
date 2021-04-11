const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

checkDuplicateReasonForReturn = async (req, res, next) => {
    const {reason_for_return} = req.body;
    if (reason_for_return === "") {
        errorMessage.error = 'Reason con not be null';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const Query = 'SELECT reason_for_return FROM reason_for_return WHERE reason_for_return = $1';
        const check = await pool.query(Query, [reason_for_return]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Such reason already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
}

checkDuplicateReasonForReturnOnUpdate = async (req, res, next) => {
    const id = req.params.id
    const {reason_for_return} = req.body;
    if (reason_for_return === "") {
        errorMessage.error = 'Reason con not be null';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const Query = 'SELECT reason_for_return FROM reason_for_return WHERE reason_for_return = $1 AND id != $2';
        const check = await pool.query(Query, [reason_for_return, id]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Such reason already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
};

const verifyReasonForReturn = {
    checkDuplicateReasonForReturn: checkDuplicateReasonForReturn,
    checkDuplicateReasonForReturnOnUpdate: checkDuplicateReasonForReturnOnUpdate
};

module.exports = verifyReasonForReturn;
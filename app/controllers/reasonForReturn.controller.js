const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')


const createNewReasonForReturn = async (req, res) => {
    const {reason_for_return} = req.body;
    const Query = `INSERT INTO reason_for_return(reason_for_return) VALUES($1) RETURNING *`;
    const values = [reason_for_return];
    try {
        const newReason = await pool.query(Query, values);
        successMessage.data = newReason.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getReasonForReturn = async (req, res) => {
    const Query = `SELECT * FROM reason_for_return`;
    try {
        const reasons = await pool.query(Query)
        return res.json(reasons.rows)
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const deleteReasonForReturn = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM reason_for_return WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const updateReasonForReturn = async (req, res) => {
    const id = req.params.id
    const {reason_for_return} = req.body;
    try {
        const Query = await pool.query(`UPDATE reason_for_return SET reason_for_return = $1 WHERE id = $2 RETURNING *`, [reason_for_return, id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};


const returnMethods = {
    getReasonForReturn,
    deleteReasonForReturn,
    createNewReasonForReturn,
    updateReasonForReturn
}

module.exports = returnMethods

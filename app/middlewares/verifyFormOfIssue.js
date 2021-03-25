const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

checkDuplicateFormOfIssue = async (req, res, next) => {
    const {form_of_issue} = req.body;
    const checkFormOfIssue = 'SELECT form_of_issue FROM form_of_issue WHERE form_of_issue = $1';
    const form = await pool.query(checkFormOfIssue, [form_of_issue]);
    let dbResponse = form.rows[0];
    if (dbResponse) {
        errorMessage.error = 'Form of issue already exist';
        return res.status(status.conflict).send(errorMessage);
    } else {
        next()
    }
};

const verifyFormOfIssue = {
    checkDuplicateFormOfIssue: checkDuplicateFormOfIssue,
};

module.exports = verifyFormOfIssue;
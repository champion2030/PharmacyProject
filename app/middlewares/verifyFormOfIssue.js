const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

checkDuplicateFormOfIssue = async (req, res, next) => {
    const {form_of_issue} = req.body;
    if (form_of_issue === "") {
        errorMessage.error = 'Форма выпуска не может быть пустой';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const checkFormOfIssue = 'SELECT form_of_issue FROM form_of_issue WHERE form_of_issue = $1';
        const form = await pool.query(checkFormOfIssue, [form_of_issue]);
        let dbResponse = form.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Такая форма выпуска уже существует';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
};

checkDuplicateFormOfIssueOnUpdate = async (req, res, next) => {
    const id = req.params.id
    const {form_of_issue} = req.body;
    if (form_of_issue === "") {
        errorMessage.error = 'Форма выпуска не может быть пустой';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const checkFormOfIssue = 'SELECT form_of_issue FROM form_of_issue WHERE form_of_issue = $1 AND id != $2';
        const form = await pool.query(checkFormOfIssue, [form_of_issue, id]);
        let dbResponse = form.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Такая форма выпуска уже существует';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
};

const verifyFormOfIssue = {
    checkDuplicateFormOfIssue: checkDuplicateFormOfIssue,
    checkDuplicateFormOfIssueOnUpdate: checkDuplicateFormOfIssueOnUpdate
};

module.exports = verifyFormOfIssue;
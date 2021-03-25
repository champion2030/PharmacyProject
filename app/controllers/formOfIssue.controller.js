const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')


const createNewForm = async (req, res) => {
    const {form_of_issue} = req.body;
    const createFormQuery = `INSERT INTO form_of_issue(form_of_issue) VALUES($1) RETURNING *`;
    const values = [form_of_issue];
    try {
        const newForm = await pool.query(createFormQuery, values);
        successMessage.data = newForm.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getFormOfIssues = async (req, res) => {
    const Query = `SELECT * FROM form_of_issue`;
    try {
        const formOfIssues = await pool.query(Query)
        return res.json(formOfIssues.rows)
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const deleteFormOfIssue = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM form_of_issue WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const updateFormOfIssue = async (req, res) => {
    const id = req.params.id
    const {form_of_issue} = req.body;
    try {
        const formOfIssue = await pool.query(`UPDATE form_of_issue SET form_of_issue = $1 WHERE id = $2 RETURNING *`, [form_of_issue, id])
        return res.json(formOfIssue.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};


const formOfIssueMethods = {
    getFormOfIssues,
    deleteFormOfIssue,
    createNewForm,
    updateFormOfIssue
}

module.exports = formOfIssueMethods

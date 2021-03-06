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

const getCurrentFormOfIssue = async (req, res) => {
    const id = req.params.id
    try {
        const formOfIssue = await pool.query(`SELECT * FROM form_of_issue WHERE id = $1`, [id])
        return res.json(formOfIssue.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getDeleteFormOfIssueInfo = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`select 
        count(distinct medicine.id) as medicine,
        count(distinct deliveries.id) as deliveries
        from form_of_issue
        left join medicine on form_of_issue.id = medicine.form_of_issue_id
        left join deliveries on medicine.id = deliveries.medicine_id
        where form_of_issue.id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const formOfIssueMethods = {
    getFormOfIssues,
    deleteFormOfIssue,
    createNewForm,
    updateFormOfIssue,
    getCurrentFormOfIssue,
    getDeleteFormOfIssueInfo
}

module.exports = formOfIssueMethods

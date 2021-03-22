const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')


const createNewForm = async (req, res) => {

    const {formOfIssue} = req.body;
    const createFormQuery = `INSERT INTO formOfIssue(formOfIssue) VALUES($1) returning *`;
    const values = [formOfIssue];
    try {
        const newForm = await pool.query(createFormQuery, values);
        successMessage.data = newForm.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const getFormOfIssues = async (req, res) => {
    const Query = `SELECT * FROM formOfIssue`;
    const formOfIssues = await pool.query(Query)
    return res.json(formOfIssues.rows)
};

const deleteFormOfIssue = async (req, res) => {
    const id = req.params.id
    const formOfIssue = await pool.query(`DELETE FROM formOfIssue WHERE id = $1`, [id])
    return res.json(formOfIssue.rows)
};


const formOfIssueMethods =  {
    getFormOfIssues,
    deleteFormOfIssue,
    createNewForm
}

module.exports = formOfIssueMethods

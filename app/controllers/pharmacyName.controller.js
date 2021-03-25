const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')


const createNewPharmacyName = async (req, res) => {
    const {name} = req.body;
    const Query = `INSERT INTO pharmacy_name(name) VALUES($1) RETURNING *`;
    const values = [name];
    try {
        const newName = await pool.query(Query, values);
        successMessage.data = newName.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getPharmacyName = async (req, res) => {
    const Query = `SELECT * FROM pharmacy_name`;
    try {
        const names = await pool.query(Query)
        return res.json(names.rows)
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const deletePharmacyName = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM pharmacy_name WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const updatePharmacyName = async (req, res) => {
    const id = req.params.id
    const {name} = req.body;
    try {
        const Query = await pool.query(`UPDATE pharmacy_name SET name = $1 WHERE id = $2 RETURNING *`, [name, id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};


const pharmacyNameMethods = {
    getPharmacyName,
    deletePharmacyName,
    createNewPharmacyName,
    updatePharmacyName
}

module.exports = pharmacyNameMethods
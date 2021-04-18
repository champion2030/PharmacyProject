const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')


const createNewPharmacologicalGroup = async (req, res) => {
    const {pharmacological_group} = req.body;
    const Query = `INSERT INTO pharmacological_group(pharmacological_group) VALUES($1) RETURNING *`;
    const values = [pharmacological_group];
    try {
        const newGroup = await pool.query(Query, values);
        successMessage.data = newGroup.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getPharmacologicalGroup = async (req, res) => {
    const Query = `SELECT * FROM pharmacological_group`;
    try {
        const groups = await pool.query(Query)
        return res.json(groups.rows)
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const deletePharmacologicalGroup = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM pharmacological_group WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const updatePharmacologicalGroup = async (req, res) => {
    const id = req.params.id
    const {pharmacological_group} = req.body;
    try {
        const Query = await pool.query(`UPDATE pharmacological_group SET pharmacological_group = $1 WHERE id = $2 RETURNING *`, [pharmacological_group, id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const getCurrentPharmacologicalGroup = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT * FROM pharmacological_group WHERE id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const getDeletePharmacologicalGroupInfo = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`select 
        count(distinct medicine.id) as medicine,
        count(distinct deliveries.id) as deliveries
        from pharmacological_group
        left join medicine on pharmacological_group.id = medicine.pharmacological_group_id
        left join deliveries on medicine.id = deliveries.medicine_id
        where pharmacological_group.id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}


const pharmacologicalGroupMethods = {
    getPharmacologicalGroup,
    deletePharmacologicalGroup,
    createNewPharmacologicalGroup,
    updatePharmacologicalGroup,
    getCurrentPharmacologicalGroup,
    getDeletePharmacologicalGroupInfo
}

module.exports = pharmacologicalGroupMethods

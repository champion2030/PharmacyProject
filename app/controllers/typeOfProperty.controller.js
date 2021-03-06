const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')

const createNewTypeOfProperty = async (req, res) => {
    const {name_of_property} = req.body;
    const Query = `INSERT INTO type_of_property(name_of_property) VALUES($1) RETURNING *`;
    const values = [name_of_property];
    try {
        const newType = await pool.query(Query, values);
        successMessage.data = newType.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getTypeOfProperty = async (req, res) => {
    const Query = `SELECT * FROM type_of_property`;
    try {
        const properties = await pool.query(Query)
        return res.json(properties.rows)
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const deleteTypeOfProperty = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM type_of_property WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const updateTypeOfProperty = async (req, res) => {
    const id = req.params.id
    const {name_of_property} = req.body;
    try {
        const Query = await pool.query(`UPDATE type_of_property SET name_of_property = $1 WHERE id = $2 RETURNING *`, [name_of_property, id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const getCurrentTypeOfProperty = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT * FROM type_of_property WHERE id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getDeleteTypeOfPropertyInfo = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT 
        count(distinct pharmacy.id) as pharmacy,
        count(distinct employee.id) as employee,
        count(distinct deliveries.id) as deliveries
        from type_of_property
        left join pharmacy on type_of_property.id = pharmacy.type_of_property_id
        left join employee on pharmacy.id = employee.pharmacy_id
        left join deliveries on employee.id = deliveries.employee_id
        where type_of_property.id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}


const typeOfPropertyMethods = {
    getTypeOfProperty,
    deleteTypeOfProperty,
    createNewTypeOfProperty,
    updateTypeOfProperty,
    getCurrentTypeOfProperty,
    getDeleteTypeOfPropertyInfo
}

module.exports = typeOfPropertyMethods

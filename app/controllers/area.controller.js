const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')

const createNewArea = async (req, res) => {
    const {name_of_area} = req.body;
    const Query = `INSERT INTO area(name_of_area) VALUES($1) RETURNING *`;
    const values = [name_of_area];
    try {
        const newArea = await pool.query(Query, values);
        successMessage.data = newArea.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getArea = async (req, res) => {
    const Query = `SELECT * FROM area`;
    try {
        const areas = await pool.query(Query)
        return res.json(areas.rows)
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const deleteArea = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM area WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const updateArea = async (req, res) => {
    const id = req.params.id
    const {name_of_area} = req.body;
    try {
        const Query = await pool.query(`UPDATE area SET name_of_area = $1 WHERE id = $2 RETURNING *`, [name_of_area, id])
        return res.json(Query.rows[0])
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getCurrentArea = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT * FROM area WHERE id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getDeleteAreaInfo = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT 
        count(distinct pharmacy.id) as pharmacy,
        count(distinct employee.id) as employee,
        count(distinct deliveries.id) as deliveries
        from area
        left join pharmacy on area.id = pharmacy.area_id
        left join employee on pharmacy.id = employee.pharmacy_id
        left join deliveries on employee.id = deliveries.employee_id
        where area.id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const areaMethods = {
    getArea,
    deleteArea,
    createNewArea,
    updateArea,
    getCurrentArea,
    getDeleteAreaInfo
}

module.exports = areaMethods

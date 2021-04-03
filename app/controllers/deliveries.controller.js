const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')


const createNewDeliver = async (req, res) => {
    const {
        medicine_id,
        employee_id,
        cause_id,
        receipt_date,
        number_of_packages,
        presence_of_defect,
        supplier_price,
        pharmacy_price,
        expiry_start_date,
        expiration_date,
    } = req.body;
    const Query = `INSERT INTO employee(medicine_id, employee_id, cause_id, receipt_date, number_of_packages, presence_of_defect, supplier_price, pharmacy_price,
        expiry_start_date, expiration_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const values = [medicine_id, employee_id, cause_id, receipt_date, number_of_packages, presence_of_defect, supplier_price, pharmacy_price,
        expiry_start_date, expiration_date];
    try {
        const newDeliver = await pool.query(Query, values);
        successMessage.data = newDeliver.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getDeliveries = async (req, res) => {
    const {page = 1, limit = 10} = req.query;
    const Query = `SELECT deliveries.id, medicine.medicine_name, employee.name, reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
JOIN employee ON deliveries.employee_id = employee.id
JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id LIMIT $1 OFFSET $2`;
    try {
        let deliveries = await pool.query(Query, [limit, (page - 1) * limit])
        let count = await pool.query(`SELECT COUNT(*) FROM deliveries;`)
        deliveries = deliveries.rows
        return res.json({
            deliveries,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: count.rows[0].count
        })
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const deleteDeliver = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM deliveries WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const updateDeliver = async (req, res) => {
    const id = req.params.id
    const {
        pharmacy_id,
        name,
        surname,
        patronymic
    } = req.body;
    try {
        const Query = await pool.query(`UPDATE employee SET pharmacy_id = $1, name = $2, surname = $3, patronymic = $4 WHERE id = $5 RETURNING *`, [pharmacy_id,
            name,
            surname,
            patronymic,
            id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const getCurrentDeliver = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT employee.id, employee.pharmacy_id, (SELECT pharmacy_name.name FROM pharmacy JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id WHERE pharmacy.id = employee.pharmacy_id) AS pharmacy_name, 
employee.name, employee.surname, employee.patronymic
FROM employee
JOIN pharmacy ON employee.pharmacy_id = pharmacy.id WHERE employee.id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};


const deliverMethods = {
    getDeliveries,
    deleteDeliver,
    createNewDeliver,
    updateDeliver,
    getCurrentDeliver
}

module.exports = deliverMethods

const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')


const createNewEmployee = async (req, res) => {
    const {
        pharmacy_id,
        name,
        surname,
        patronymic
    } = req.body;
    const Query = `INSERT INTO employee(pharmacy_id, name, surname, patronymic) VALUES($1, $2, $3, $4) RETURNING *`;
    const values = [pharmacy_id, name, surname, patronymic];
    try {
        const newEmployee = await pool.query(Query, values);
        successMessage.data = newEmployee.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getEmployee = async (req, res) => {
    const {page = 1, limit = 10} = req.query;
    const Query = `SELECT employee.id, employee.pharmacy_id, (SELECT pharmacy_name.name FROM pharmacy JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id WHERE pharmacy.id = employee.pharmacy_id) AS pharmacy_name, 
employee.name, employee.surname, employee.patronymic
FROM employee
JOIN pharmacy ON employee.pharmacy_id = pharmacy.id LIMIT $1 OFFSET $2`;
    try {
        let employees = await pool.query(Query, [limit, (page - 1) * limit])
        let count = await pool.query(`SELECT COUNT(*) FROM employee;`)
        employees = employees.rows
        return res.json({
            employees,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: count.rows[0].count
        })
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const deleteEmployee = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM employee WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const updateEmployee = async (req, res) => {
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

const getCurrentEmployee = async (req, res) => {
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


const employeeMethods = {
    getEmployee,
    deleteEmployee,
    createNewEmployee,
    updateEmployee,
    getCurrentEmployee
}

module.exports = employeeMethods

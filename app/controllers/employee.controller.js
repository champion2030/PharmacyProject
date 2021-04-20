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
        if (pharmacy_id === "" || name === "" || surname === "" || patronymic === "") {
            errorMessage.error = 'Fields can not be empty';
            return res.status(status.conflict).send(errorMessage);
        } else {
            const newEmployee = await pool.query(Query, values);
            successMessage.data = newEmployee.rows[0];
            return res.status(status.created).send(successMessage);
        }
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getEmployee = async (req, res) => {
    const {page = 1, limit = 20, searchQuery = "default"} = req.query;
    let employees, count
    const Query = `SELECT employee.id, employee.pharmacy_id, (SELECT pharmacy_name.name FROM pharmacy JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id WHERE pharmacy.id = employee.pharmacy_id) AS pharmacy_name, 
employee.name, employee.surname, employee.patronymic
FROM employee
JOIN pharmacy ON employee.pharmacy_id = pharmacy.id ORDER BY employee.id LIMIT $1 OFFSET $2`;
    const QueryWithParams = `SELECT employee.id, employee.pharmacy_id, (SELECT pharmacy_name.name FROM pharmacy JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id WHERE pharmacy.id = employee.pharmacy_id) AS pharmacy_name, 
employee.name, employee.surname, employee.patronymic
FROM employee
JOIN pharmacy ON employee.pharmacy_id = pharmacy.id
JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id
WHERE employee.name ILIKE $1 OR employee.surname ILIKE $2 OR pharmacy_name.name ILIKE $3 ORDER BY employee.id LIMIT $4 OFFSET $5`;
    try {
        if (searchQuery === "default") {
            employees = await pool.query(Query, [limit, (page - 1) * limit])
            count = await pool.query(`SELECT COUNT(*) FROM employee;`)
            employees = employees.rows
        } else {
            employees = await pool.query(QueryWithParams, [searchQuery + "%", searchQuery + "%", searchQuery + "%", limit, (page - 1) * limit])
            count = await pool.query(`select count(*) from (SELECT employee.id, employee.pharmacy_id, (SELECT pharmacy_name.name FROM pharmacy JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id WHERE pharmacy.id = employee.pharmacy_id) AS pharmacy_name, 
employee.name, employee.surname, employee.patronymic
FROM employee
JOIN pharmacy ON employee.pharmacy_id = pharmacy.id
JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id
WHERE employee.name ILIKE $1 OR employee.surname ILIKE $2 OR pharmacy_name.name ILIKE $3 ORDER BY employee.id) as i`, [searchQuery + "%", searchQuery + "%", searchQuery + "%"])
            employees = employees.rows
        }
        return res.json({
            employees,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: parseInt(count.rows[0].count)
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
        if (pharmacy_id === "" || name === "" || surname === "" || patronymic === "") {
            errorMessage.error = 'Fields can not be empty';
            return res.status(status.conflict).send(errorMessage);
        } else {
            const Query = await pool.query(`UPDATE employee SET pharmacy_id = $1, name = $2, surname = $3, patronymic = $4 WHERE id = $5 RETURNING *`, [pharmacy_id, name, surname, patronymic, id])
            return res.json(Query.rows[0])
        }
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

const getAllEmployee = async (req, res) => {
    let employees
    const Query = `SELECT employee.id, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, (SELECT pharmacy_name.name FROM pharmacy JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id WHERE pharmacy.id = employee.pharmacy_id) AS pharmacy_name FROM employee`;
    try {
        employees = await pool.query(Query)
        return res.json(employees.rows)
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getDeleteEmployeeInfo = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT 
        count(distinct deliveries.id) as deliveries
        from employee
        left join deliveries on employee.id = deliveries.employee_id
        where employee.id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}


const employeeMethods = {
    getEmployee,
    deleteEmployee,
    createNewEmployee,
    updateEmployee,
    getCurrentEmployee,
    getAllEmployee,
    getDeleteEmployeeInfo
}

module.exports = employeeMethods

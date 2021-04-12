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
    const Query = `INSERT INTO deliveries(medicine_id, employee_id, cause_id, receipt_date, number_of_packages, presence_of_defect, supplier_price, pharmacy_price,
        expiry_start_date, expiration_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const values = [medicine_id, employee_id, cause_id, receipt_date, number_of_packages, presence_of_defect, supplier_price, pharmacy_price,
        expiry_start_date, expiration_date];
    try {
        if (medicine_id === "" || employee_id === "" || number_of_packages === "" || supplier_price === "" || pharmacy_price === "") {
            errorMessage.error = 'Fields can not be empty';
            return res.status(status.conflict).send(errorMessage);
        } else {
            if (expiry_start_date >= expiration_date) {
                errorMessage.error = 'Expiry start date can not be less then expiration date';
                return res.status(status.conflict).send(errorMessage);
            } else {
                if (receipt_date < expiry_start_date) {
                    errorMessage.error = 'Receipt date can not be less then expiry start date';
                    return res.status(status.conflict).send(errorMessage);
                } else {
                    const newDeliver = await pool.query(Query, values);
                    successMessage.data = newDeliver.rows[0];
                    return res.status(status.created).send(successMessage);
                }
            }
        }
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getDeliveries = async (req, res) => {
    const {page = 1, limit = 10, searchQuery = "default"} = req.query;
    let deliveries, count
    const Query = `SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
    deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
    FROM deliveries
    JOIN medicine ON deliveries.medicine_id = medicine.id
    JOIN employee ON deliveries.employee_id = employee.id
    LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id LIMIT $1 OFFSET $2`;
    const QueryWithParams = `SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
    deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
    FROM deliveries
    JOIN medicine ON deliveries.medicine_id = medicine.id
    JOIN employee ON deliveries.employee_id = employee.id
    LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id WHERE medicine.medicine_name LIKE $1 OR employee.name LIKE $2 LIMIT $3 OFFSET $4`
    try {
        if (searchQuery === "default") {
            deliveries = await pool.query(Query, [limit, (page - 1) * limit])
            count = await pool.query(`SELECT COUNT(*) FROM deliveries;`)
            deliveries = deliveries.rows
        } else {
            deliveries = await pool.query(QueryWithParams, [searchQuery + "%", searchQuery + "%", limit, (page - 1) * limit])
            count = await pool.query(`SELECT COUNT(*) FROM deliveries 
                JOIN medicine ON deliveries.medicine_id = medicine.id
                JOIN employee ON deliveries.employee_id = employee.id
                WHERE medicine.medicine_name LIKE $1 OR employee.name LIKE $2`, [searchQuery + "%", searchQuery + "%"])
            deliveries = deliveries.rows
        }
        return res.json({
            deliveries,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: parseInt(count.rows[0].count)
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
    try {
        if (medicine_id === "" || employee_id === "" || number_of_packages === "" || supplier_price === "" || pharmacy_price === "") {
            errorMessage.error = 'Fields can not be empty';
            return res.status(status.conflict).send(errorMessage);
        } else {
            if (expiry_start_date >= expiration_date) {
                errorMessage.error = 'Expiry start date can not be less then expiration date';
                return res.status(status.conflict).send(errorMessage);
            } else {
                if (receipt_date < expiry_start_date) {
                    errorMessage.error = 'Receipt date can not be less then expiry start date';
                    return res.status(status.conflict).send(errorMessage);
                } else {
                    const Query = await pool.query(`UPDATE deliveries SET medicine_id = $1, employee_id = $2, cause_id = $3, receipt_date = $4, number_of_packages = $5,
 presence_of_defect = $6, supplier_price = $7, pharmacy_price = $8, expiry_start_date = $9, expiration_date = $10 WHERE id = $11`, [medicine_id, employee_id, cause_id,
                        receipt_date,
                        number_of_packages,
                        presence_of_defect,
                        supplier_price,
                        pharmacy_price,
                        expiry_start_date,
                        expiration_date,
                        id])
                    return res.json(Query.rows[0])
                }
            }
        }
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const getCurrentDeliver = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT deliveries.id, deliveries.medicine_id, medicine.medicine_name, deliveries.employee_id, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS employee_full_name, 
        deliveries.cause_id, reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages,
        deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
        FROM deliveries
        JOIN medicine ON deliveries.medicine_id = medicine.id
        JOIN employee ON deliveries.employee_id = employee.id
        LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id WHERE deliveries.id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        console.log(error)
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

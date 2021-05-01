const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

const queryWithDataCondition = async (req, res) => {
    const {page = 1, limit = 5} = req.query;
    const {start_date, finish_date} = req.body;
    const Query = `SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, 
reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
JOIN employee ON deliveries.employee_id = employee.id
LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id
WHERE deliveries.receipt_date BETWEEN $1 AND $2
ORDER BY deliveries.id
LIMIT $3 OFFSET $4`;
    try {
        let requestResult = await pool.query(Query, [start_date, finish_date, limit, (page - 1) * limit])
        const count = await pool.query(`select count(*) FROM (SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, 
reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
JOIN employee ON deliveries.employee_id = employee.id
LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id
WHERE deliveries.receipt_date BETWEEN $1 AND $2
ORDER BY deliveries.id) as i`, [start_date, finish_date])
        return res.json({
            requestResult: requestResult.rows,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: parseInt(count.rows[0].count)
        })
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const queryWithConditionForGroups = async (req, res) => {
    const Query = `SELECT * FROM area
where ((select count(*) from pharmacy) / (select count(*) from area)) < (select count(*) from pharmacy)
ORDER BY area.id`;
    try {
        let requestResult = await pool.query(Query)
        return res.json(requestResult.rows)
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getFinalQueryWithDataAndGroups = async (req, res) => {
    const {page = 1, limit = 5} = req.query;
    let {start_date, finish_date, manufacturerFirmId} = req.body;
    const Query = `SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, 
reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
JOIN employee ON deliveries.employee_id = employee.id
LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id
WHERE deliveries.receipt_date BETWEEN $1 AND $2 AND manufacturer_firm.id = $3
ORDER BY deliveries.id
LIMIT $4 OFFSET $5`;
    try {
        if (manufacturerFirmId === "") manufacturerFirmId = 0
        let requestResult = await pool.query(Query, [start_date, finish_date, manufacturerFirmId, limit, (page - 1) * limit])
        const count = await pool.query(`select count(*) FROM (SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, 
reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
JOIN employee ON deliveries.employee_id = employee.id
LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id
WHERE deliveries.receipt_date BETWEEN $1 AND $2 AND manufacturer_firm.id = $3
ORDER BY deliveries.id) as i`, [start_date, finish_date, manufacturerFirmId])
        return res.json({
            requestResult: requestResult.rows,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: parseInt(count.rows[0].count)
        })
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const summaryQueriesMethods = {
    queryWithDataCondition,
    queryWithConditionForGroups,
    getFinalQueryWithDataAndGroups
}

module.exports = summaryQueriesMethods
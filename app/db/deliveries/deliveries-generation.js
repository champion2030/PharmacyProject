const pool = require('../../db/dev/pool.js')

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

exports.deliveriesGeneration = async (numberOfDeliveries) => {
    const deleteQuery = `DELETE FROM deliveries;`
    let seqResetQuery = "SELECT setval('deliveries_id_seq', 0);"
    let dbResponse, medicine_id, employee_id, cause_id, receipt_date, number_of_packages, presence_of_defect,
        supplier_price, pharmacy_price, expiry_start_date, expiration_date
    let values
    const getRandomMedicine = `SELECT id FROM medicine ORDER BY RANDOM() LIMIT 1`;
    const getRandomEmployee = `SELECT id FROM employee ORDER BY RANDOM() LIMIT 1`;
    const getRandomCause = `SELECT id FROM reason_for_return ORDER BY RANDOM() LIMIT 1`;
    let insertClientsQuery = "INSERT INTO deliveries(medicine_id, employee_id, cause_id, receipt_date, number_of_packages," +
        "presence_of_defect, supplier_price, pharmacy_price, expiry_start_date, expiration_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *"
    try {
        await pool.query(deleteQuery)
        await pool.query(seqResetQuery)
        for (let i = 1; i < numberOfDeliveries; i++) {
            receipt_date = randomDate(new Date(2001, 0, 1), new Date())
            expiry_start_date = new Date(receipt_date.setMonth(receipt_date.getMonth() - 1))
            expiration_date = new Date(receipt_date.setMonth(receipt_date.getMonth() + 12))
            supplier_price = Math.floor(Math.random() * 2000) + 400
            pharmacy_price = supplier_price + 300
            number_of_packages = Math.floor(Math.random() * 50) + 5
            if (Math.random() < 0.5) {
                presence_of_defect = true
                dbResponse = await pool.query(getRandomCause)
                cause_id = dbResponse.rows[0].id
            } else {
                presence_of_defect = false
                cause_id = null
            }
            dbResponse = await pool.query(getRandomMedicine)
            medicine_id = dbResponse.rows[0].id
            dbResponse = await pool.query(getRandomEmployee)
            employee_id = dbResponse.rows[0].id
            values = [
                medicine_id,
                employee_id,
                cause_id,
                receipt_date,
                number_of_packages,
                presence_of_defect,
                supplier_price,
                pharmacy_price,
                expiry_start_date,
                expiration_date
            ]
            await pool.query(insertClientsQuery, values)
        }
    } catch (e) {
        console.log(e)
    }
}
const pool = require('../../db/dev/pool.js')
const generations = require("./fullNameGeneration");
const {generateManufacturingFirm} = require("../manufacturer_firm/manufacrurer-firm-generation");

exports.employeeGeneration = async (numberOfEmployees, numberOfPharmacy) => {
    let seqResetQuery = "SELECT setval('employee_id_seq', 0);"
    let dbResponse, pharmacy_id, name, surname, patronymic
    const getRandomPharmacy = `SELECT id FROM pharmacy ORDER BY RANDOM() LIMIT 1`;
    let insertClientsQuery = "INSERT INTO employee(pharmacy_id, name, surname, patronymic) VALUES($1, $2, $3, $4) returning *"
    try {
        await pool.query(seqResetQuery)
        for (let i = 1; i < numberOfEmployees; i++) {
            if (i <= numberOfPharmacy) pharmacy_id = i
            else if (i < numberOfPharmacy * 2) {
                pharmacy_id = numberOfPharmacy * 2 - i
            } else {
                dbResponse = await pool.query(getRandomPharmacy)
                pharmacy_id = dbResponse.rows[0].id
            }
            const fullName = await generations.fullNameGeneration()
            name = fullName.randomLastname
            surname = fullName.randomFirstname
            patronymic = fullName.randomMiddlename
            const values = [
                pharmacy_id,
                name,
                surname,
                patronymic
            ]
            await pool.query(insertClientsQuery, values)
        }
        await generateManufacturingFirm(numberOfPharmacy)
    } catch (e) {
        console.log(e)
    }
}
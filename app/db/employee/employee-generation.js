const pool = require('../../db/dev/pool.js')
const generations = require("./fullNameGeneration");

employeeGeneration = async () => {
    const deleteQuery = `DELETE FROM employee;`
    let seqResetQuery = "SELECT setval('employee_id_seq', 0);"
    let dbResponse, pharmacy_id, name, surname, patronymic
    const getRandomPharmacy = `SELECT id FROM pharmacy ORDER BY RANDOM() LIMIT 1`;
    let insertClientsQuery = "INSERT INTO employee(pharmacy_id, name, surname, patronymic) VALUES($1, $2, $3, $4) returning *"
    try {

        await pool.query(deleteQuery)
        await pool.query(seqResetQuery)


        for (let i = 1; i < 8000; i++) {
            if (i <= 3000) pharmacy_id = i
            else if (i < 6000) {
                pharmacy_id = 6000 - i
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
    } catch (e) {
        console.log(e)
    }
}

employeeGeneration()
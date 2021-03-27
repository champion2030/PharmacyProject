const pool = require('../../db/dev/pool.js')
const {fileToArray} = require("../common/fileToArray");


const generateMedicine = async (req, res) => {
    const deleteQuery = `DELETE FROM medicine;`
    const seqResetQuery = "SELECT setval('medicine_id_seq', 0);"
    let Query = `INSERT INTO medicine(form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name) VALUES($1, $2, $3, $4) returning *`
    let medicineNames = []
    let form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name, dbResponse, rowsCheck;
    medicineNames = await fileToArray("../medicine/medicineName/medicineName", medicineNames)
    const getRandomFormOfIssue = `SELECT id FROM form_of_issue ORDER BY RANDOM() LIMIT 1`;
    const getRandomPharmacologicalGroup = `SELECT id FROM pharmacological_group ORDER BY RANDOM() LIMIT 1`;
    const getRandomManufactureFirm = `SELECT id FROM manufacturer_firm ORDER BY RANDOM() LIMIT 1`;
    const check = `select (form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name) from medicine WHERE form_of_issue_id = $1 and 
    pharmacological_group_id = $2 and manufacture_firm_id = $3 and medicine_name = $4`

    try {
        await pool.query(deleteQuery)
        await pool.query(seqResetQuery)
        for (let j = 0; j < 8000; j++) {
            do {
                dbResponse = await pool.query(getRandomFormOfIssue)
                form_of_issue_id = dbResponse.rows[0].id
                dbResponse = await pool.query(getRandomPharmacologicalGroup)
                pharmacological_group_id = dbResponse.rows[0].id
                dbResponse = await pool.query(getRandomManufactureFirm)
                manufacture_firm_id = dbResponse.rows[0].id
                medicine_name = medicineNames[Math.floor(Math.random() * medicineNames.length)] + ' ' + Math.floor(Math.random()*100)+1 + ' мг'
                rowsCheck = await pool.query(check, [form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name])
                dbResponse = rowsCheck.rows
                console.log(dbResponse)
            }while (dbResponse.length !== 0)
            const values = [
                form_of_issue_id,
                pharmacological_group_id,
                manufacture_firm_id,
                medicine_name,
            ]

            await pool.query(Query,values)
        }
    } catch (error) {
        console.log(error)
    }
};

generateMedicine()
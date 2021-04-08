const pool = require('../../db/dev/pool.js')
const {generateMedicine} = require("../medicine/medicine-generation");
const {getEmail} = require("./firmEmails/emailGeneration");
const {fileToArray} = require("../common/fileToArray");


function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

exports.generateManufacturingFirm = async (numberOfPharmacy) => {
    const seqResetQuery = "SELECT setval('manufacturer_firm_id_seq', 0);"
    let Query = `INSERT INTO manufacturer_firm(country_of_manufacture_id, firm_name, email, address, year_open) VALUES($1, $2, $3, $4, $5) returning *`
    let firmNames = [], firm_address = []
    let country_of_manufacture_id, email, address, year_open, dbResponse, firm_name, rowsCheck;
    firmNames = await fileToArray("./manufacturer_firm/firmNames/firmNames", firmNames)
    firm_address = await fileToArray("./manufacturer_firm/firmAddress/firmAddress", firm_address)
    const getRandomCountryOfManufacture = `SELECT id FROM country_of_manufacture ORDER BY RANDOM() LIMIT 1`;
    const check = `select (email) from manufacturer_firm WHERE email = $1`
    try {
        await pool.query(seqResetQuery)
        for (let j = 0; j < 347; j++) {
            do {
                firm_name = firmNames[j]
                dbResponse = await pool.query(getRandomCountryOfManufacture)
                country_of_manufacture_id = dbResponse.rows[0].id
                email = getEmail()
                address = firm_address[Math.floor(Math.random() * firm_address.length)] + ' ' + Math.floor(Math.random()*100)+1 + '-' + String.fromCharCode(Math.floor(Math.random()*(1040-1071))+1071)
                year_open = randomDate(new Date(1990, 0, 1), new Date())
                rowsCheck = await pool.query(check, [email])
                dbResponse = rowsCheck.rows
            }while (dbResponse.length !== 0)

            const values = [
                country_of_manufacture_id,
                firm_name,
                email,
                address,
                year_open
            ]
            await pool.query(Query,values)
        }
        console.log("manufacture_firm generated")
        await generateMedicine(numberOfPharmacy)
    } catch (error) {
        console.log(error)
    }
};
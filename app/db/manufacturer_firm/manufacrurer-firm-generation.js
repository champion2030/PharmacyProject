const pool = require('../../db/dev/pool.js')
const {getEmail} = require("./firmEmails/emailGeneration");
const {fileToArray} = require("../common/fileToArray");


function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const generateFormOfIssues = async (req, res) => {
    const deleteQuery = `DELETE FROM manufacturer_firm;`
    const seqResetQuery = "SELECT setval('manufacturer_firm_id_seq', 0);"
    let Query = `INSERT INTO manufacturer_firm(country_of_manufacture_id, firm_name, email, address, year_open) VALUES($1, $2, $3, $4, $5) returning *`
    let firmNames = [], firm_address = []
    let country_of_manufacture_id, email, address, year_open, dbResponse, firm_name;
    firmNames = await fileToArray("../manufacturer_firm/firmNames/firmNames", firmNames)
    firm_address = await fileToArray("../manufacturer_firm/firmAddress/firmAddress", firm_address)
    const getRandomCountryOfManufacture = `SELECT id FROM country_of_manufacture ORDER BY RANDOM() LIMIT 1`;
    try {
        await pool.query(deleteQuery)
        await pool.query(seqResetQuery)
        for (let j = 0; j < 100; j++) {
            firm_name = firmNames[Math.floor(Math.random() * firmNames.length)]
            dbResponse = await pool.query(getRandomCountryOfManufacture)
            country_of_manufacture_id = dbResponse.rows[0].id
            email = getEmail()
            address = firm_address[Math.floor(Math.random() * firm_address.length)] + ' ' + Math.floor(Math.random()*100)+1 + '-' + String.fromCharCode(Math.floor(Math.random()*(1040-1071))+1071)
            year_open = randomDate(new Date(2012, 0, 1), new Date())
            const values = [
                country_of_manufacture_id,
                firm_name,
                email,
                address,
                year_open
            ]
            await pool.query(Query,values)
        }
    } catch (error) {
        console.log(error)
    }
};

generateFormOfIssues()
const pool = require('../../db/dev/pool.js')
const {employeeGeneration} = require("../employee/employee-generation");
const {randomPhoneNumberGeneration} = require("./pharmacyAddress/generate-telephone");
const {fileToArray} = require("../common/fileToArray");


exports.generatePharmacy = async (numberOfPharmacy) => {
    const seqResetQuery = "SELECT setval('pharmacy_id_seq', 0);"
    let Query = `INSERT INTO pharmacy(name_id, area_id, type_of_property_id, telephone, address) VALUES($1, $2, $3, $4, $5) returning *`
    let pharmacyAddress = []
    let name_id, area_id, type_of_property_id, telephone, address, dbResponse
    pharmacyAddress = await fileToArray("./pharmacy/pharmacyAddress/pharmacyAddress", pharmacyAddress)
    const getRandomName = `SELECT id FROM pharmacy_name ORDER BY RANDOM() LIMIT 1`
    const getRandomArea = `SELECT id FROM area ORDER BY RANDOM() LIMIT 1`
    const getRandomTypeOfProperty = `SELECT id FROM type_of_property ORDER BY RANDOM() LIMIT 1`
    try {
        await pool.query(seqResetQuery)
        for (let j = 0; j < numberOfPharmacy; j++) {
            do {
                dbResponse = await pool.query(getRandomName)
                name_id = dbResponse.rows[0].id
                dbResponse = await pool.query(getRandomArea)
                area_id = dbResponse.rows[0].id
                dbResponse = await pool.query(getRandomTypeOfProperty)
                type_of_property_id = dbResponse.rows[0].id
                telephone = randomPhoneNumberGeneration()
                address = pharmacyAddress[Math.floor(Math.random() * pharmacyAddress.length)] + ' ' + Math.floor(Math.random() * 100) + 1 + '-' + String.fromCharCode(Math.floor(Math.random() * (1040 - 1071)) + 1071)
                dbResponse = await pool.query(`SELECT telephone FROM pharmacy WHERE telephone = $1`, [telephone])
            }while (dbResponse.rows.length !== 0)
            const values = [
                name_id,
                area_id,
                type_of_property_id,
                telephone,
                address
            ]
            await pool.query(Query, values)
        }
        console.log("pharmacy generated")
        await employeeGeneration(numberOfPharmacy * 2 + 2000, numberOfPharmacy)
    } catch (error) {
        console.log(error)
    }
};
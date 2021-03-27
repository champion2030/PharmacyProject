const pool = require('../../db/dev/pool.js')
const {randomPhoneNumberGeneration} = require("./pharmacyAddress/generate-telephone");
const {fileToArray} = require("../common/fileToArray");


const generatePharmacy = async (req, res) => {
    const deleteQuery = `DELETE FROM pharmacy;`
    const seqResetQuery = "SELECT setval('pharmacy_id_seq', 0);"
    let Query = `INSERT INTO pharmacy(name_id, area_id, type_of_property_id, telephone, address) VALUES($1, $2, $3, $4, $5) returning *`
    let pharmacyAddress = []
    let name_id, area_id, type_of_property_id, telephone, address, dbResponse, rowsCheck;
    pharmacyAddress = await fileToArray("../pharmacy/pharmacyAddress/pharmacyAddress", pharmacyAddress)
    const getRandomName = `SELECT id FROM pharmacy_name ORDER BY RANDOM() LIMIT 1`;
    const getRandomArea = `SELECT id FROM area ORDER BY RANDOM() LIMIT 1`;
    const getRandomTypeOfProperty = `SELECT id FROM type_of_property ORDER BY RANDOM() LIMIT 1`;
    const check = `select (address) from pharmacy WHERE address = $1`

    try {
        await pool.query(deleteQuery)
        await pool.query(seqResetQuery)
        for (let j = 0; j < 3000; j++) {
            do {
                dbResponse = await pool.query(getRandomName)
                name_id = dbResponse.rows[0].id
                dbResponse = await pool.query(getRandomArea)
                area_id = dbResponse.rows[0].id
                dbResponse = await pool.query(getRandomTypeOfProperty)
                type_of_property_id = dbResponse.rows[0].id
                telephone = randomPhoneNumberGeneration()
                address = pharmacyAddress[Math.floor(Math.random() * pharmacyAddress.length)] + ' ' + Math.floor(Math.random() * 100) + 1 + '-' + String.fromCharCode(Math.floor(Math.random() * (1040 - 1071)) + 1071)
                rowsCheck = await pool.query(check, [address])
                dbResponse = rowsCheck.rows
            } while (dbResponse.length !== 0)
            const values = [
                name_id,
                area_id,
                type_of_property_id,
                telephone,
                address
            ]
            await pool.query(Query, values)
        }
    } catch (error) {
        console.log(error)
    }
};

generatePharmacy()
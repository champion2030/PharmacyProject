const pool = require('../../db/dev/pool.js')
const {getEmail} = require("./firmEmails/emailGeneration");
const {fileToArray} = require("../common/fileToArray");

clientGeneration = async () => {
    let query = `INSERT INTO client(lastname, firstname, middlename, phone) VALUES($1, $2, $3, $4) returning *`
    try {
        let firm_name = []
        let id = 0;
        firm_name = await fileToArray("../manufacturer_firm/firmNames/firmNames", firm_name)
        //for (let j = 0; j < 25; j++) {
            //const email = await getEmail()

            pool.connect((err, client, done) => {
                for (let j = 0; j < 25; j++) {

                    client.query(`SELECT id FROM country_of_manufacture ORDER BY RANDOM() LIMIT 1`, (err, result) => {
                        id = result.rows[0].id
                        console.log(id)
                        console.log("j = " + j)
                    })
                }
            })
            // const values = [
            //     firm_name[i],
            //     email,
            //     id
            // ]
            // console.log(values)
        //}

    } catch (e) {

    }
}

clientGeneration()
const pool = require('../../db/dev/pool.js')
const {getEmail} = require("./firmEmails/emailGeneration");
const {fileToArray} = require("../common/fileToArray");



// clientGeneration = async () => {
//     let query = `INSERT INTO client(lastname, firstname, middlename, phone) VALUES($1, $2, $3, $4) returning *`
//     try {
//         let firm_name = []
//         const id = await pool.query(`SELECT id FROM country_of_manufacture ORDER BY RANDOM() LIMIT 5`, (err, result) => {
//             console.log( result.rows)
//         });
//         console.log(id)
//         firm_name = await fileToArray("../manufacturer_firm/firmNames/firmNames", firm_name)
//         for (let j = 0; j < firm_name.length; j++) {
//             const values = [
//                 firm_name[j],
//                 await getEmail(),
//             ]
//             console.log(values)
//         }
//     } catch (e) {
//         console.log(e)
//     }
// }

const getFormOfIssues = async (req, res) => {
    let firm_name = []
    const Query = `SELECT id FROM country_of_manufacture ORDER BY RANDOM() LIMIT 1`;
    try {

        const formOfIssues = await pool.query(Query)
        console.log(formOfIssues.rows)
        firm_name = await fileToArray("../manufacturer_firm/firmNames/firmNames", firm_name)
        for (let j = 0; j < firm_name.length; j++) {
            const values = [
                firm_name[j],
                await getEmail(),
                formOfIssues.rows[j].id
            ]
            console.log(values)
        }
    } catch (error) {
        console.log(error)
    }
};

getFormOfIssues()
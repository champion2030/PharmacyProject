const pool = require("./dev/pool");
const fs = require("fs");
const {generatePharmacy} = require("./pharmacy/pharmacy-generation");

const files = ['area.sql', 'country_of_manufacture.sql', 'form_of_issue.sql', 'pharmacological_group.sql', 'pharmacy_name.sql',
    'reason_for_return.sql', 'type_of_property.sql']

const fullGeneration = async (numberOfPharmacy) => {

    let deleteAllReferenceBooks =
        `DELETE FROM area;` +
        `SELECT setval('area_id_seq', 0);` +
        `DELETE FROM country_of_manufacture;` +
        `SELECT setval('country_of_manufacture_id_seq', 0);` +
        `DELETE FROM form_of_issue;` +
        `SELECT setval('form_of_issue_id_seq', 0);` +
        `DELETE FROM pharmacological_group;` +
        `SELECT setval('pharmacological_group_id_seq', 0);` +
        `DELETE FROM pharmacy_name;` +
        `SELECT setval('pharmacy_name_id_seq', 0);` +
        `DELETE FROM type_of_property;` +
        `SELECT setval('type_of_property_id_seq', 0);` +
        `DELETE FROM reason_for_return; ` +
        `SELECT setval('reason_for_return_id_seq', 0)`


    await pool.query(deleteAllReferenceBooks, (err) => {
        if (err) throw err
        for (let i = 0; i < files.length; i++) {
            let sql = fs.readFileSync('reference_books/' + files[i]).toString();
            pool.query(sql, (err) => {
                if (err) {
                    console.log('error: ', err);
                    process.exit(-1);
                }
            });
        }
        let deleteAllTables = "DELETE FROM deliveries;" +
            "DELETE FROM medicine;" +
            "DELETE FROM manufacturer_firm;" +
            "DELETE FROM employee;" +
            "DELETE FROM pharmacy;"
        pool.query(deleteAllTables, (err) => {
            if (err) throw err
            if (numberOfPharmacy % 2) numberOfPharmacy += 1
            generatePharmacy(numberOfPharmacy)
        })
    })


}


fullGeneration(300)
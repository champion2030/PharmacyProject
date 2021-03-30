const pool = require("./dev/pool");
const {generatePharmacy} = require("./pharmacy/pharmacy-generation");

const fullGeneration = async (numberOfPharmacy) => {
    let deleteAllTables = "DELETE FROM deliveries;" +
        "DELETE FROM medicine;" +
        "DELETE FROM manufacturer_firm;" +
        "DELETE FROM employee;" +
        "DELETE FROM pharmacy;"
    await pool.query(deleteAllTables, (err) => {
        if (err) throw err
        if (numberOfPharmacy % 2) numberOfPharmacy += 1
        generatePharmacy(numberOfPharmacy)
    })

}


fullGeneration(300)
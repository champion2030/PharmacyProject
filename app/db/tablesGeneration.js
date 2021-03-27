const {generatePharmacy} = require("./pharmacy/pharmacy-generation");
const fullGeneration = async (numberOfPharmacy) => {
    let deleteAllTables = "DELETE FROM repairs;" +
        "DELETE FROM orders;" +
        "DELETE FROM masters;" +
        "DELETE FROM repair_firms;" +
        "DELETE FROM devices;" +
        "DELETE FROM clients;"
    await pool.query(deleteAllTables, (err) => {
        if (err) throw err
        if (numberOfPharmacy % 2) numberOfPharmacy+=1
        generatePharmacy(numberOfPharmacy)
    })

}



fullGeneration(3000)
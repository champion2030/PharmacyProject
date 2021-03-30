const pool = require('../../db/dev/pool.js')
const {deliveriesGeneration} = require("../deliveries/deliveries-generation");
const {fileToArray} = require("../common/fileToArray");

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}



exports.generateMedicine = async (numberOfPharmacy) => {
    const numberOfMedicine = numberOfPharmacy * 2 + 3000
    const seqResetQuery = "SELECT setval('medicine_id_seq', 0);"
    let Query = `INSERT INTO medicine(form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name, instruction, barcode) VALUES($1, $2, $3, $4, $5, $6) returning *`
    let medicineNames = []
    let form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name, dbResponse, rowsCheck, barcode, instruction, dbResponseBarcode, rowsCheckBarcode;
    medicineNames = await fileToArray("./medicine/medicineName/medicineName", medicineNames)
    const getRandomFormOfIssue = `SELECT id FROM form_of_issue ORDER BY RANDOM() LIMIT 1`;
    const getRandomPharmacologicalGroup = `SELECT id FROM pharmacological_group ORDER BY RANDOM() LIMIT 1`;
    const getRandomManufactureFirm = `SELECT id FROM manufacturer_firm ORDER BY RANDOM() LIMIT 1`;
    const check = `select (form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name) from medicine WHERE form_of_issue_id = $1 and 
    pharmacological_group_id = $2 and manufacture_firm_id = $3 and medicine_name = $4`
    const checkBarcode = `select (barcode) from medicine WHERE barcode = $1`

    const listInstructions = [
        "В связи с вероятным эстрогеноподобным эффектом силимарина его следует применять с осторожностью у пациентов с гормональными нарушениями (эндометриоз, миома матки, карцинома молочной железы, яичника, матки и предстательной железы).",
        "В состав препарата входит лактоза, в связи с чем его не рекомендуется назначать пациентам с врожденной галактоземией, синдромом мальабсорбции глюкозы или галактозы, либо при врожденной лактазной недостаточности.",
        "С осторожностью применять у пациентов с артериальной гипертензией, сердечной недостаточностью, сахарным диабетом, эпилепсией, тромбоэмболией, тяжелой миастенией и глаукомой.",
        "Способность влиять на скорость реакции при управлении автотранспортом или другими механизмами. Предостережений нет.",
        "Лікування необхідно продовжувати до появи клініко-гематологічної ремісії. Передчасне припинення лікування призводить до рецидивів.",
        "Перед применением следует открыть бутылку (флакон) с порошком, добавить до отметки 250 мл чистую питьевую воду, взболтать до получения однородной суспензии."
]

    try {
        await pool.query(seqResetQuery)
        for (let j = 0; j < numberOfMedicine; j++) {
            do {
                dbResponse = await pool.query(getRandomFormOfIssue)
                form_of_issue_id = dbResponse.rows[0].id
                dbResponse = await pool.query(getRandomPharmacologicalGroup)
                pharmacological_group_id = dbResponse.rows[0].id
                dbResponse = await pool.query(getRandomManufactureFirm)
                manufacture_firm_id = dbResponse.rows[0].id
                medicine_name = medicineNames[Math.floor(Math.random() * medicineNames.length)] + ' ' + Math.floor(Math.random()*100)+1 + ' мг'
                barcode = randomInteger(100000000000000000, 999999999999999999)
                instruction = listInstructions[Math.floor(Math.random() * listInstructions.length)]
                rowsCheck = await pool.query(check, [form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name])
                dbResponse = rowsCheck.rows
                rowsCheckBarcode = await pool.query(checkBarcode, [barcode])
                dbResponseBarcode = rowsCheckBarcode.rows
            }while (dbResponse.length !== 0 && dbResponseBarcode.length !== 0)
            const values = [
                form_of_issue_id,
                pharmacological_group_id,
                manufacture_firm_id,
                medicine_name,
                instruction,
                barcode
            ]
            await pool.query(Query,values)
        }
        await deliveriesGeneration(numberOfPharmacy * 4)
    } catch (error) {
        console.log(error)
    }
};
const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')


const createNewMedicine = async (req, res) => {
    const {
        form_of_issue_id,
        pharmacological_group_id,
        manufacture_firm_id,
        medicine_name,
        instruction,
        barcode
    } = req.body;
    const Query = `INSERT INTO medicine(form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name, instruction, barcode) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name, instruction, barcode];
    try {
        const newMedicine = await pool.query(Query, values);
        successMessage.data = newMedicine.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getMedicine = async (req, res) => {
    const {page = 1, limit = 20, searchQuery = "default"} = req.query;
    let medicines, count
    const Query = `SELECT medicine.id, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group, manufacturer_firm.firm_name, medicine.medicine_name, medicine.instruction, medicine.barcode
FROM medicine
JOIN form_of_issue ON medicine.form_of_issue_id = form_of_issue.id
JOIN pharmacological_group ON medicine.pharmacological_group_id = pharmacological_group.id
JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id LIMIT $1 OFFSET $2`;
    const QueryWithParams = `SELECT medicine.id, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group, manufacturer_firm.firm_name, medicine.medicine_name, medicine.instruction, medicine.barcode
FROM medicine
JOIN form_of_issue ON medicine.form_of_issue_id = form_of_issue.id
JOIN pharmacological_group ON medicine.pharmacological_group_id = pharmacological_group.id
JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id WHERE medicine.medicine_name LIKE $1 LIMIT $2 OFFSET $3`;
    try {
        if (searchQuery === "default") {
            medicines = await pool.query(Query, [limit, (page - 1) * limit])
            count = await pool.query(`SELECT COUNT(*) FROM medicine`)
            medicines = medicines.rows
        } else {
            medicines = await pool.query(QueryWithParams, [searchQuery + "%", limit, (page - 1) * limit])
            count = await pool.query(`SELECT COUNT(*) FROM medicine WHERE medicine_name LIKE $1`, [searchQuery + "%"])
            medicines = medicines.rows
        }
        return res.json({
            medicines,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: parseInt(count.rows[0].count)
        })
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const deleteMedicine = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM medicine WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const updateMedicine = async (req, res) => {
    const id = req.params.id
    const {
        form_of_issue_id,
        pharmacological_group_id,
        manufacture_firm_id,
        medicine_name,
        instruction,
        barcode
    } = req.body;
    try {
        const Query = await pool.query(`UPDATE medicine SET form_of_issue_id = $1, pharmacological_group_id = $2, manufacture_firm_id = $3, medicine_name = $4, instruction = $5, barcode = $6 WHERE id = $7 RETURNING *`, [form_of_issue_id,
            pharmacological_group_id,
            manufacture_firm_id,
            medicine_name,
            instruction,
            barcode,
            id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const getCurrentMedicine = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT * FROM medicine WHERE medicine.id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const getAllMedicine = async (req, res) => {
    let medicines
    const QueryWithParams = `SELECT medicine.id, medicine.medicine_name FROM medicine`;
    try {
        medicines = await pool.query(QueryWithParams)
        return res.json(medicines.rows)
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};


const medicineMethods = {
    getMedicine,
    deleteMedicine,
    createNewMedicine,
    updateMedicine,
    getCurrentMedicine,
    getAllMedicine
}

module.exports = medicineMethods

const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

checkDuplicateMedicine = async (req, res, next) => {
    const {
        form_of_issue_id,
        pharmacological_group_id,
        manufacture_firm_id,
        medicine_name,
        instruction,
        barcode
    } = req.body;
    if (form_of_issue_id === "" || pharmacological_group_id === "" || manufacture_firm_id === "" || barcode === "" || instruction === "" || medicine_name === "") {
        errorMessage.error = 'Fields can not be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        if (barcode.length < 19 || barcode.length > 19) {
            errorMessage.error = 'Barcode length must be 19 numbers';
            return res.status(status.conflict).send(errorMessage);
        } else {
            let Query = 'select (form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name) from medicine WHERE form_of_issue_id = $1 and pharmacological_group_id = $2 and manufacture_firm_id = $3 and medicine_name = $4';
            let check = await pool.query(Query, [form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name]);
            let dbResponse = check.rows[0];
            if (dbResponse) {
                errorMessage.error = 'Identical medicine already exist';
                return res.status(status.conflict).send(errorMessage);
            } else {
                next()
            }
        }
    }
}

checkDuplicateMedicineOnUpdate = async (req, res, next) => {
    const id = req.params.id
    const {
        form_of_issue_id,
        pharmacological_group_id,
        manufacture_firm_id,
        medicine_name,
        instruction,
        barcode
    } = req.body;
    if (form_of_issue_id === "" || pharmacological_group_id === "" || manufacture_firm_id === "" || barcode === "" || instruction === "" || medicine_name === "") {
        errorMessage.error = 'Fields can not be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        if (barcode.length < 19 || barcode.length > 19) {
            errorMessage.error = 'Barcode length must be 19 numbers';
            return res.status(status.conflict).send(errorMessage);
        } else {
            let Query = 'select (form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name) from medicine WHERE form_of_issue_id = $1 and pharmacological_group_id = $2 and manufacture_firm_id = $3 and medicine_name = $4 and id != $5';
            let check = await pool.query(Query, [form_of_issue_id, pharmacological_group_id, manufacture_firm_id, medicine_name, id]);
            let dbResponse = check.rows[0];
            if (dbResponse) {
                errorMessage.error = 'Identical medicine already exist';
                return res.status(status.conflict).send(errorMessage);
            } else {
                next()
            }
        }
    }
}

const verifyMedicine = {
    checkDuplicateMedicine: checkDuplicateMedicine,
    checkDuplicateMedicineOnUpdate: checkDuplicateMedicineOnUpdate
};

module.exports = verifyMedicine;
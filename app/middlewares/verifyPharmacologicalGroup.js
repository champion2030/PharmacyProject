const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

checkDuplicatePharmacologicalGroup = async (req, res, next) => {
    const {pharmacological_group} = req.body;
    if (pharmacological_group === "") {
        errorMessage.error = 'Pharmacological Group can not be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const Query = 'SELECT pharmacological_group FROM pharmacological_group WHERE pharmacological_group = $1';
        const check = await pool.query(Query, [pharmacological_group]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Pharmacological Group already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
};

checkDuplicatePharmacologicalGroupOnUpdate = async (req, res, next) => {
    const id = req.params.id
    const {pharmacological_group} = req.body;
    if (pharmacological_group === "") {
        errorMessage.error = 'Pharmacological Group can not be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const Query = 'SELECT pharmacological_group FROM pharmacological_group WHERE pharmacological_group = $1 AND id != $2';
        const check = await pool.query(Query, [pharmacological_group, id]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Pharmacological Group already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
};

const verifyPharmacologicalGroup = {
    checkDuplicatePharmacologicalGroup: checkDuplicatePharmacologicalGroup,
    checkDuplicatePharmacologicalGroupOnUpdate : checkDuplicatePharmacologicalGroupOnUpdate
};

module.exports = verifyPharmacologicalGroup;
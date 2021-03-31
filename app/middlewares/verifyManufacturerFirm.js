const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')


checkDuplicateManufacturerFirm = async (req, res, next) => {
    const {firm_name, email, address} = req.body;
    if (firm_name === "" || email === "" || address === "") {
        errorMessage.error = 'Fields can not be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        let Query = 'SELECT firm_name FROM manufacturer_firm WHERE firm_name = $1';
        let check = await pool.query(Query, [firm_name]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Such firm already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            Query = 'SELECT email FROM manufacturer_firm WHERE email = $1';
            check = await pool.query(Query, [email]);
            dbResponse = check.rows[0];
            if (dbResponse) {
                errorMessage.error = 'Such email already exist';
                return res.status(status.conflict).send(errorMessage);
            } else {
                next()
            }
        }
    }
};

const verifyManufacturerFirm = {
    checkDuplicateManufacturerFirm: checkDuplicateManufacturerFirm,
};

module.exports = verifyManufacturerFirm;
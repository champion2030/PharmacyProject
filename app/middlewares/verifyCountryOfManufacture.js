const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

checkDuplicateCountry = async (req, res, next) => {
    const {country} = req.body;
    if (country === "") {
        errorMessage.error = 'Country cannot be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const checkCountry = 'SELECT country FROM country_of_manufacture WHERE country = $1';
        const check = await pool.query(checkCountry, [country]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Country already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
}

checkDuplicateCountryOnUpdate = async (req, res, next) => {
    const id = req.params.id
    const {country} = req.body;
    if (country === "") {
        errorMessage.error = 'Country cannot be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const checkCountry = 'SELECT country FROM country_of_manufacture WHERE country = $1 AND id != $2';
        const check = await pool.query(checkCountry, [country, id]);
        let dbResponse = check.rows[0];
        if (dbResponse) {
            errorMessage.error = 'Country already exist';
            return res.status(status.conflict).send(errorMessage);
        } else {
            next()
        }
    }
}

const verifyCountry = {
    checkDuplicateCountry: checkDuplicateCountry,
    checkDuplicateCountryOnUpdate: checkDuplicateCountryOnUpdate
};

module.exports = verifyCountry;
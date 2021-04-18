const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')


const createNewCountry = async (req, res) => {
    const {country} = req.body;
    const Query = `INSERT INTO country_of_manufacture(country) VALUES($1) RETURNING *`;
    const values = [country];
    try {
        const newCountry = await pool.query(Query, values);
        successMessage.data = newCountry.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getCountry = async (req, res) => {
    const Query = `SELECT * FROM country_of_manufacture`;
    try {
        const countries = await pool.query(Query)
        return res.json(countries.rows)
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const deleteCountry = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM country_of_manufacture WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const updateCountry = async (req, res) => {
    const id = req.params.id
    const {country} = req.body;
    try {
        const Query = await pool.query(`UPDATE country_of_manufacture SET country = $1 WHERE id = $2 RETURNING *`, [country, id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const getCurrentCountry = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT * FROM country_of_manufacture WHERE id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getDeleteCountryInfo = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`select 
        count(distinct manufacturer_firm.id) as manufacturer_firm,
        count(distinct medicine.id) as medicine,
        count(distinct deliveries.id) as deliveries
        from country_of_manufacture
        left join manufacturer_firm on country_of_manufacture.id = manufacturer_firm.country_of_manufacture_id
        left join medicine on manufacturer_firm.id = medicine.manufacture_firm_id
        left join deliveries on medicine.id = deliveries.medicine_id
        where country_of_manufacture.id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}


const countryMethods = {
    getCountry,
    deleteCountry,
    createNewCountry,
    updateCountry,
    getCurrentCountry,
    getDeleteCountryInfo
}

module.exports = countryMethods

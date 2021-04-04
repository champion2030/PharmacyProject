const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')


const createNewManufacturerFirm = async (req, res) => {
    const {
        country_of_manufacture_id,
        firm_name,
        email,
        address,
        year_open
    } = req.body;
    const createFormQuery = `INSERT INTO manufacturer_firm(country_of_manufacture_id, firm_name, email, address, year_open) VALUES($1, $2, $3, $4, $5) RETURNING *`
    const values = [country_of_manufacture_id, firm_name, email, address, year_open];
    try {
        const newFirm = await pool.query(createFormQuery, values);
        successMessage.data = newFirm.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getManufacturerFirm = async (req, res) => {
    const {page = 1, limit = 10, searchQuery = "default"} = req.query;
    let manufacturerFirms, count
    const Query = `SELECT manufacturer_firm.id, country_of_manufacture.country, manufacturer_firm.firm_name, manufacturer_firm.email, manufacturer_firm.address, manufacturer_firm.year_open
FROM manufacturer_firm
JOIN country_of_manufacture
ON manufacturer_firm.country_of_manufacture_id = country_of_manufacture.id LIMIT $1 OFFSET $2`;
    const QueryWithParams = `SELECT manufacturer_firm.id, country_of_manufacture.country, manufacturer_firm.firm_name, manufacturer_firm.email, manufacturer_firm.address, manufacturer_firm.year_open
FROM manufacturer_firm
JOIN country_of_manufacture
ON manufacturer_firm.country_of_manufacture_id = country_of_manufacture.id WHERE manufacturer_firm.firm_name LIKE $1 LIMIT $2 OFFSET $3`
    try {
        if (searchQuery === "default") {
            manufacturerFirms = await pool.query(Query, [limit, (page - 1) * limit])
            count = await pool.query(`SELECT COUNT(*) FROM manufacturer_firm;`)
            manufacturerFirms = manufacturerFirms.rows
        } else {
            manufacturerFirms = await pool.query(QueryWithParams, [searchQuery + "%", limit, (page - 1) * limit])
            count = await pool.query(`SELECT COUNT(*) FROM manufacturer_firm JOIN country_of_manufacture
            ON manufacturer_firm.country_of_manufacture_id = country_of_manufacture.id WHERE manufacturer_firm.firm_name LIKE $1`, [searchQuery + "%"])
            manufacturerFirms = manufacturerFirms.rows
        }
        return res.json({
            manufacturerFirms,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: parseInt(count.rows[0].count)
        })
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const deleteManufacturerFirm = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM manufacturer_firm WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const updateManufacturerFirm = async (req, res) => {
    const id = req.params.id
    const {
        country_of_manufacture_id,
        firm_name,
        email,
        address,
        year_open
    } = req.body;
    try {
        const manufacturerFirm = await pool.query(`UPDATE manufacturer_firm SET country_of_manufacture_id = $1,
 firm_name = $2, email = $3, address = $4, year_open = $5
 WHERE id = $6 RETURNING *`, [country_of_manufacture_id, firm_name, email, address, year_open, id])
        return res.json(manufacturerFirm.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const getCurrentManufacturerFirm = async (req, res) => {
    const id = req.params.id
    try {
        const manufacturerFirm = await pool.query(`SELECT manufacturer_firm.id, country_of_manufacture.country, manufacturer_firm.firm_name, manufacturer_firm.email, manufacturer_firm.address, manufacturer_firm.year_open 
FROM manufacturer_firm 
JOIN country_of_manufacture 
ON manufacturer_firm.country_of_manufacture_id = country_of_manufacture.id WHERE manufacturer_firm.id = $1`, [id])
        return res.json(manufacturerFirm.rows[0])
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};


const manufacturerFirmMethods = {
    getManufacturerFirm,
    deleteManufacturerFirm,
    createNewManufacturerFirm,
    updateManufacturerFirm,
    getCurrentManufacturerFirm,
}

module.exports = manufacturerFirmMethods

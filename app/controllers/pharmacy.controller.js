const pool = require('../db/dev/pool.js')
const {errorMessage, status, successMessage} = require('../helpers/status.js')


const createNewPharmacy = async (req, res) => {
    const {
        name_id,
        area_id,
        type_of_property_id,
        telephone,
        address
    } = req.body;
    const Query = `INSERT INTO pharmacy(name_id, area_id, type_of_property_id, telephone, address) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const values = [name_id, area_id, type_of_property_id, telephone, address];
    try {
        const newPharmacy = await pool.query(Query, values);
        successMessage.data = newPharmacy.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getPharmacy = async (req, res) => {
    const {page = 1, limit = 10} = req.query;
    const Query = `SELECT pharmacy.id, pharmacy_name.name, area.name_of_area, type_of_property.name_of_property, pharmacy.telephone, pharmacy.address
FROM pharmacy
JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id
JOIN area ON pharmacy.area_id = area.id
JOIN type_of_property ON pharmacy.type_of_property_id = type_of_property.id LIMIT $1 OFFSET $2`;
    try {
        let pharmacies = await pool.query(Query, [limit, (page - 1) * limit])
        let count = await pool.query(`SELECT COUNT(*) FROM pharmacy;`)
        pharmacies = pharmacies.rows
        return res.json({
            pharmacies,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: count.rows[0].count
        })
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const deletePharmacy = async (req, res) => {
    const id = req.params.id
    try {
        await pool.query(`DELETE FROM pharmacy WHERE id = $1`, [id])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const updatePharmacy = async (req, res) => {
    const id = req.params.id
    const {
        name_id,
        area_id,
        type_of_property_id,
        telephone,
        address
    } = req.body;
    try {
        const Query = await pool.query(`UPDATE pharmacy SET name_id = $1, area_id = $2, type_of_property_id = $3, telephone = $4, address = $5 WHERE id = $6 RETURNING *`, [name_id,
            area_id,
            type_of_property_id,
            telephone,
            address, id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const getCurrentPharmacy = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT pharmacy.id, pharmacy_name.name, area.name_of_area, type_of_property.name_of_property, pharmacy.telephone, pharmacy.address
FROM pharmacy
JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id
JOIN area ON pharmacy.area_id = area.id
JOIN type_of_property ON pharmacy.type_of_property_id = type_of_property.id WHERE pharmacy.id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};


const pharmacyMethods = {
    getPharmacy,
    deletePharmacy,
    createNewPharmacy,
    updatePharmacy,
    getCurrentPharmacy
}

module.exports = pharmacyMethods

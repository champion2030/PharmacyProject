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
    if (name_id === "" || area_id === "" || type_of_property_id === "" || telephone === "" || address === "") {
        errorMessage.error = 'Fields can not be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (!re.test(telephone) || telephone.length < 12) {
            errorMessage.error = 'Telephone is not correct';
            return res.status(status.conflict).send(errorMessage);
        } else {
            let dbResponse, Query = `SELECT telephone FROM pharmacy WHERE telephone = $1`
            dbResponse = await pool.query(Query, [telephone])
            if (dbResponse.rows.length !== 0) {
                errorMessage.error = 'Such telephone already exist';
                return res.status(status.conflict).send(errorMessage);
            } else {
                Query = `INSERT INTO pharmacy(name_id, area_id, type_of_property_id, telephone, address) VALUES($1, $2, $3, $4, $5) RETURNING *`;
                const values = [name_id, area_id, type_of_property_id, telephone, address];
                try {
                    const newPharmacy = await pool.query(Query, values);
                    successMessage.data = newPharmacy.rows[0];
                    return res.status(status.created).send(successMessage);
                } catch (error) {
                    console.log(error)
                    errorMessage.error = 'Operation was not successful';
                    return res.status(status.error).send(errorMessage);
                }
            }
        }
    }
}

const getPharmacy = async (req, res) => {
    const {page = 1, limit = 20, searchQuery = "default"} = req.query;
    let pharmacies, count
    const Query = `SELECT pharmacy.id, pharmacy_name.name, area.name_of_area, type_of_property.name_of_property, pharmacy.telephone, pharmacy.address
    FROM pharmacy
    JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id
    JOIN area ON pharmacy.area_id = area.id
    JOIN type_of_property ON pharmacy.type_of_property_id = type_of_property.id ORDER BY pharmacy.id LIMIT $1 OFFSET $2`;
    const QueryWithParams = `SELECT pharmacy.id, pharmacy_name.name, area.name_of_area, type_of_property.name_of_property, pharmacy.telephone, pharmacy.address
    FROM pharmacy
    JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id
    JOIN area ON pharmacy.area_id = area.id
    JOIN type_of_property ON pharmacy.type_of_property_id = type_of_property.id WHERE pharmacy_name.name ILIKE $1 OR area.name_of_area ILIKE $2 ORDER BY pharmacy.id LIMIT $3 OFFSET $4`
    try {
        if (searchQuery === "default") {
            pharmacies = await pool.query(Query, [limit, (page - 1) * limit])
            count = await pool.query(`SELECT COUNT(*) FROM pharmacy`)
            pharmacies = pharmacies.rows
        } else {
            pharmacies = await pool.query(QueryWithParams, [searchQuery + "%", searchQuery + "%", limit, (page - 1) * limit])
            count = await pool.query(`SELECT COUNT(*) FROM pharmacy 
JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id 
JOIN area ON pharmacy.area_id = area.id
WHERE pharmacy_name.name ILIKE $1 OR area.name_of_area ILIKE $2`, [searchQuery + "%", searchQuery + "%"])
            pharmacies = pharmacies.rows
        }
        return res.json({
            pharmacies,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: parseInt(count.rows[0].count)
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
    if (name_id === "" || area_id === "" || type_of_property_id === "" || telephone === "" || address === "") {
        errorMessage.error = 'Fields can not be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (!re.test(telephone) || telephone.length < 12) {
            errorMessage.error = 'Telephone is not correct';
            return res.status(status.conflict).send(errorMessage);
        } else {
            let dbResponse, Query = `SELECT telephone FROM pharmacy WHERE telephone = $1 AND id != $2`
            dbResponse = await pool.query(Query, [telephone, id])
            if (dbResponse.rows.length !== 0) {
                errorMessage.error = 'Such telephone already exist';
                return res.status(status.conflict).send(errorMessage);
            } else {
                try {
                    Query = await pool.query(`UPDATE pharmacy SET name_id = $1, area_id = $2, type_of_property_id = $3, telephone = $4, address = $5 WHERE id = $6 RETURNING *`, [name_id,
                        area_id,
                        type_of_property_id,
                        telephone,
                        address, id])
                    return res.json(Query.rows[0])
                } catch (error) {
                    errorMessage.error = 'Operation was not successful';
                    return res.status(status.error).send(errorMessage);
                }
            }
        }
    }
};

const getCurrentPharmacy = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT pharmacy.id, pharmacy.name_id, pharmacy_name.name, pharmacy.area_id, area.name_of_area, pharmacy.type_of_property_id,
        type_of_property.name_of_property, pharmacy.telephone, pharmacy.address
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

const getAllPharmacy = async (req, res) => {
    try {
        const Query = await pool.query(`SELECT pharmacy.id, pharmacy_name.name FROM pharmacy JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id`)
        return res.json(Query.rows)
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getDeletePharmacyInfo = async (req, res) => {
    const id = req.params.id
    try {
        const Query = await pool.query(`SELECT 
        count(distinct employee.id) as employee,
        count(distinct deliveries.id) as deliveries
        from pharmacy
        left join employee on pharmacy.id = employee.pharmacy_id
        left join deliveries on employee.id = deliveries.employee_id
        where pharmacy.id = $1`, [id])
        return res.json(Query.rows[0])
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const deleteGroupOfPharmacy = async (req, res) => {
    const {pharmacyId} = req.body
    try {
        await pool.query(`delete from pharmacy where id=ANY($1)`, [pharmacyId])
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const pharmacyMethods = {
    getPharmacy,
    deletePharmacy,
    createNewPharmacy,
    updatePharmacy,
    getCurrentPharmacy,
    getAllPharmacy,
    getDeletePharmacyInfo,
    deleteGroupOfPharmacy
}

module.exports = pharmacyMethods

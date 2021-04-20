const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

const getFirstRequestPartOne = async (req, res) => {
    const {pharmacy_id} = req.body;
    if (pharmacy_id === "") {
        errorMessage.error = 'Fields can not be empty';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const Query = `select medicine.id, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group,
        manufacturer_firm.firm_name, medicine.medicine_name, medicine.instruction, medicine.barcode, count(*)
        FROM medicine
        JOIN form_of_issue ON medicine.form_of_issue_id = form_of_issue.id
        JOIN pharmacological_group ON medicine.pharmacological_group_id = pharmacological_group.id
        JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
        left join deliveries on deliveries.medicine_id = medicine.id
        left join employee on deliveries.employee_id = employee.id
        left join pharmacy on employee.pharmacy_id = pharmacy.id
        where pharmacy.id = $1
        group by medicine.id, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group, manufacturer_firm.firm_name
        order by count(*) desc
        limit 5`;
        const values = [pharmacy_id];
        try {
            const requestResult = await pool.query(Query, values);
            return res.json(requestResult.rows)
        } catch (error) {
            console.log(error)
            errorMessage.error = 'Operation was not successful';
            return res.status(status.error).send(errorMessage);
        }
    }
}

const getFirstRequestPartTwo = async (req, res) => {
    const Query = `select medicine.id, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group,
manufacturer_firm.firm_name, medicine.medicine_name, medicine.instruction, medicine.barcode, count(*)
FROM medicine
JOIN form_of_issue ON medicine.form_of_issue_id = form_of_issue.id
JOIN pharmacological_group ON medicine.pharmacological_group_id = pharmacological_group.id
JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
left join deliveries on deliveries.medicine_id = medicine.id
left join employee on deliveries.employee_id = employee.id
left join pharmacy on employee.pharmacy_id = pharmacy.id
left join area on pharmacy.area_id = area.id
group by medicine.id, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group, manufacturer_firm.firm_name
order by count(*) desc
limit 5`;
    try {
        const requestResult = await pool.query(Query);
        return res.json(requestResult.rows)
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getSecondRequestFirstPart = async (req, res) => {
    const {page = 1, limit = 5} = req.query;
    const Query = `Select count(pharmacy.id), type_of_property.name_of_property, area.name_of_area
from pharmacy
right join type_of_property on type_of_property.id = pharmacy.type_of_property_id
right join area on area.id = pharmacy.area_id
group by type_of_property.name_of_property, area.name_of_area, area.id
order by area.id desc LIMIT $1 OFFSET $2`;
    try {
        let requestResult = await pool.query(Query, [limit, (page - 1) * limit]);
        let count = await pool.query(`select count(*) from (Select count(pharmacy.id), type_of_property.name_of_property, area.name_of_area
from pharmacy
right join type_of_property on type_of_property.id = pharmacy.type_of_property_id
right join area on area.id = pharmacy.area_id
group by type_of_property.name_of_property, area.name_of_area, area.id
order by area.id desc) as i`)
        requestResult = requestResult.rows
        return res.json({
            requestResult,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: parseInt(count.rows[0].count)
        })
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getSecondRequestSecondPart = async (req, res) => {
    const Query = `select count(pharmacy.id), type_of_property.name_of_property
from pharmacy
right join type_of_property on type_of_property.id = pharmacy.type_of_property_id
group by type_of_property.name_of_property, type_of_property.id
order by type_of_property.id desc`;
    try {
        let requestResult = await pool.query(Query)
        return res.json(requestResult.rows)
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getThirdRequest = async (req, res) => {
    const {page = 1, limit = 5, searchQuery = "default"} = req.query;
    let requestResult, count
    const Query = `select count(*), sum(supplier_price), manufacturer_firm.firm_name
from deliveries
left join medicine on deliveries.medicine_id = medicine.id
left join manufacturer_firm on medicine.manufacture_firm_id = manufacturer_firm.id
where deliveries.presence_of_defect=true
group by manufacturer_firm.id
order by count(*) desc LIMIT $1 OFFSET $2`;
    const QueryWithParams = `select count(*), sum(supplier_price), manufacturer_firm.firm_name
from deliveries
left join medicine on deliveries.medicine_id = medicine.id
left join manufacturer_firm on medicine.manufacture_firm_id = manufacturer_firm.id
where manufacturer_firm.firm_name ILIKE $1
and deliveries.presence_of_defect=true
group by manufacturer_firm.id
order by count(*) desc LIMIT $2 OFFSET $3`
    try {
        if (searchQuery === "default") {
            requestResult = await pool.query(Query, [limit, (page - 1) * limit]);
            count = await pool.query(`select count(*) from (select count(*), sum(supplier_price), manufacturer_firm.firm_name
            from deliveries
            left join medicine on deliveries.medicine_id = medicine.id
            left join manufacturer_firm on medicine.manufacture_firm_id = manufacturer_firm.id
            where deliveries.presence_of_defect=true
            group by manufacturer_firm.id
            order by count(*) desc) as i`)
            requestResult = requestResult.rows
        } else {
            requestResult = await pool.query(QueryWithParams, [searchQuery + "%", limit, (page - 1) * limit]);
            count = await pool.query(`select count(*) from (select count(*), sum(supplier_price), manufacturer_firm.firm_name
from deliveries
left join medicine on deliveries.medicine_id = medicine.id
left join manufacturer_firm on medicine.manufacture_firm_id = manufacturer_firm.id
where manufacturer_firm.firm_name ILIKE $1
and deliveries.presence_of_defect=true
group by manufacturer_firm.id
order by count(*) desc) as i`, [searchQuery + "%"])
            requestResult = requestResult.rows
        }
        return res.json({
            requestResult,
            totalPages: Math.ceil(count.rows[0].count / limit),
            currentPage: page,
            totalCount: parseInt(count.rows[0].count)
        })
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const requestsMethods = {
    getFirstRequestPartOne,
    getFirstRequestPartTwo,
    getSecondRequestFirstPart,
    getSecondRequestSecondPart,
    getThirdRequest
}


module.exports = requestsMethods
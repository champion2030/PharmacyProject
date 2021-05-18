const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

const queryWithDataCondition = async (req, res) => {
    const {page = 1, limit = 5} = req.query;
    const {start_date, finish_date} = req.body;
    const Query = `SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, 
reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
JOIN employee ON deliveries.employee_id = employee.id
LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id
WHERE deliveries.receipt_date BETWEEN $1 AND $2
ORDER BY deliveries.id
LIMIT $3 OFFSET $4`;
    try {
        let requestResult = await pool.query(Query, [start_date, finish_date, limit, (page - 1) * limit])
        const count = await pool.query(`select count(*) FROM (SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, 
reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
JOIN employee ON deliveries.employee_id = employee.id
LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id
WHERE deliveries.receipt_date BETWEEN $1 AND $2
ORDER BY deliveries.id) as i`, [start_date, finish_date])
        return res.json({
            requestResult: requestResult.rows,
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

const queryWithConditionForGroups = async (req, res) => {
    const {page = 1, limit = 5} = req.query;
    let {manufacturerFirmId} = req.body;
    const Query = `SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, 
    reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
    deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number 
    FROM deliveries 
    JOIN medicine ON deliveries.medicine_id = medicine.id
    LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id 
    JOIN employee ON deliveries.employee_id = employee.id 
    left join manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id 
    where manufacturer_firm.id = $1 ORDER BY deliveries.id LIMIT $2 OFFSET $3`;
    try {
        if (manufacturerFirmId === "") manufacturerFirmId = 0
        let requestResult = await pool.query(Query, [manufacturerFirmId, limit, (page - 1) * limit])
        const count = await pool.query(`select count(*) from (SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, 
    reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
    deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number 
    FROM deliveries 
    JOIN medicine ON deliveries.medicine_id = medicine.id
    LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id 
    JOIN employee ON deliveries.employee_id = employee.id
    left join manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
    where manufacturer_firm.id = $1) as i`, [manufacturerFirmId])
        return res.json({
            requestResult: requestResult.rows,
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

const getFinalQueryWithDataAndGroups = async (req, res) => {
    const {page = 1, limit = 5} = req.query;
    let {start_date, finish_date, manufacturerFirmId} = req.body;
    const Query = `SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, 
reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
JOIN employee ON deliveries.employee_id = employee.id
LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id
WHERE deliveries.receipt_date BETWEEN $1 AND $2 AND manufacturer_firm.id = $3
ORDER BY deliveries.id
LIMIT $4 OFFSET $5`;
    try {
        if (manufacturerFirmId === "") manufacturerFirmId = 0
        let requestResult = await pool.query(Query, [start_date, finish_date, manufacturerFirmId, limit, (page - 1) * limit])
        const count = await pool.query(`select count(*) FROM (SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name, 
reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages, 
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
JOIN employee ON deliveries.employee_id = employee.id
LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id
WHERE deliveries.receipt_date BETWEEN $1 AND $2 AND manufacturer_firm.id = $3
ORDER BY deliveries.id) as i`, [start_date, finish_date, manufacturerFirmId])
        return res.json({
            requestResult: requestResult.rows,
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

const getFinalRequestWithoutCondition = async (req, res) => {
    const {page = 1, limit = 5} = req.query;
    const Query = `select count(*), manufacturer_firm.firm_name
from deliveries
left join medicine on deliveries.medicine_id = medicine.id
left join manufacturer_firm on medicine.manufacture_firm_id = manufacturer_firm.id
group by manufacturer_firm.id
order by count(*) desc
LIMIT $1 OFFSET $2`;
    try {
        let requestResult = await pool.query(Query, [limit, (page - 1) * limit])
        const count = await pool.query(`select count(*) from (select count(*), manufacturer_firm.firm_name
from deliveries
left join medicine on deliveries.medicine_id = medicine.id
left join manufacturer_firm on medicine.manufacture_firm_id = manufacturer_firm.id
group by manufacturer_firm.id
order by count(*) desc) as i`)
        return res.json({
            requestResult: requestResult.rows,
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

const getQueryOnWrapUpQuery = async (req, res) => {
    let {pharmacyId} = req.body;
    if (pharmacyId === '') pharmacyId = 0
    const Query = `SELECT deliveries.id, medicine.medicine_name, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group, manufacturer_firm.firm_name, deliveries.supplier_price
    FROM deliveries
    JOIN medicine ON deliveries.medicine_id = medicine.id 
    JOIN form_of_issue ON medicine.form_of_issue_id = form_of_issue.id 
    JOIN pharmacological_group ON medicine.pharmacological_group_id = pharmacological_group.id 
    JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
    JOIN employee ON deliveries.employee_id = employee.id 
    JOIN pharmacy ON employee.pharmacy_id = pharmacy.id 
    where pharmacy.id = $1 
    order by deliveries.supplier_price desc 
    limit 1`;
    try {
        let requestResult = await pool.query(Query, [pharmacyId])
        return res.json(requestResult.rows[0])
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const getFinalQueryWithSubquery = async (req, res) => {
    const {page = 1, limit = 5} = req.query;
    const Query = `select * from (select count(*) as cnt, 
(SELECT country_of_manufacture.country FROM manufacturer_firm JOIN country_of_manufacture ON manufacturer_firm.country_of_manufacture_id = country_of_manufacture.id 
 WHERE manufacturer_firm.id = me.manufacture_firm_id) as country_of_manufacture, mf.firm_name, mf.email, mf.address, mf.year_open from medicine me 
join manufacturer_firm mf on mf.id = me.manufacture_firm_id 
group by manufacture_firm_id, mf.id
order by cnt desc
limit $1 offset $2
) ant
where 
ant.cnt > (select avg(cnm) from (select count(*) as cnm, manufacture_firm_id from medicine group by manufacture_firm_id) as d)`;
    try {
        let requestResult = await pool.query(Query, [limit, (page - 1) * limit])
        const count = await pool.query(`select count(*) from (select * from (select count(*) as cnt, 
(SELECT country_of_manufacture.country FROM manufacturer_firm JOIN country_of_manufacture ON manufacturer_firm.country_of_manufacture_id = country_of_manufacture.id 
 WHERE manufacturer_firm.id = me.manufacture_firm_id) as country_of_manufacture, mf.firm_name, mf.email, mf.address, mf.year_open from medicine me 
join manufacturer_firm mf on mf.id = me.manufacture_firm_id 
group by manufacture_firm_id, mf.id
order by cnt desc
) ant
where 
ant.cnt > (select avg(cnm) from (select count(*) as cnm, manufacture_firm_id from medicine group by manufacture_firm_id) as d)) as i`)
        return res.json({
            requestResult: requestResult.rows,
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

const getDiagram = async (req, res) => {
    let labels = [], data = []
    const Query = `Select area.name_of_area as label, count(pharmacy.id) as value
    from pharmacy
    right join area on area.id = pharmacy.area_id
    group by area.name_of_area, area.id
    order by area.id desc`;
    try {
        let requestResult = await pool.query(Query)
        for (let i = 0; i < requestResult.rows.length; i++) labels.push(requestResult.rows[i].label)
        for (let i = 0; i < requestResult.rows.length; i++) data.push(parseInt(requestResult.rows[i].value))
        return res.json({
            requestResult: requestResult.rows,
            result: {
                labels: labels,
                datasets: [
                    {
                        label: 'Районы',
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        data: data
                    }
                ]
            }
        })
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const get3DDiagram = async (req, res) => {
    let dataset = []
    const category = await pool.query(`SELECT name_of_area as label FROM area order by id`)
    const types_of_property = await pool.query(`SELECT name_of_property FROM type_of_property order by id`)
    const pharmacy_count = await pool.query(`Select count(pharmacy.id)
from pharmacy
right join type_of_property on type_of_property.id = pharmacy.type_of_property_id
right join area on area.id = pharmacy.area_id
group by type_of_property.name_of_property, area.name_of_area, area.id, type_of_property.id
order by area.id, type_of_property.id`);
    for (let i = 0; i < types_of_property.rows.length; i++) {
        let data = []
        for (let j = i; j < pharmacy_count.rows.length; j += types_of_property.rows.length) {
            let temp = {value: pharmacy_count.rows[j].count}
            data.push(temp)
        }
        let jsonObject =
            {
                seriesname: types_of_property.rows[i].name_of_property,
                data: data
            }
        dataset.push(jsonObject)
    }
    try {
        return res.json({
            category: category.rows,
            dataset: dataset
        })
    } catch (error) {
        console.log(error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

const summaryQueriesMethods = {
    queryWithDataCondition,
    queryWithConditionForGroups,
    getFinalQueryWithDataAndGroups,
    getFinalRequestWithoutCondition,
    getQueryOnWrapUpQuery,
    getFinalQueryWithSubquery,
    getDiagram,
    get3DDiagram
}

module.exports = summaryQueriesMethods
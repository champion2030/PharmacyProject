const pool = require('../db/dev/pool.js')
const {errorMessage, status} = require('../helpers/status.js')

checkDuplicateManufacturerFirm = async (req, res, next) => {
    const {country_of_manufacture_id, firm_name, email, address, year_open} = req.body;
    if (country_of_manufacture_id === "" || firm_name === "" || email === "" || address === "" || year_open === null) {
        errorMessage.error = 'Поля не могут быть пустыми';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email).toLowerCase())) {
            errorMessage.error = 'Email не корректен';
            return res.status(status.conflict).send(errorMessage);
        } else {
            const date = new Date()
            if (new Date(year_open) > date) {
                errorMessage.error = 'Дата основания не может быть больше чем сегодняшняя дата';
                return res.status(status.conflict).send(errorMessage);
            } else {
                let Query = 'SELECT firm_name FROM manufacturer_firm WHERE firm_name = $1';
                let check = await pool.query(Query, [firm_name]);
                let dbResponse = check.rows[0];
                if (dbResponse) {
                    errorMessage.error = 'Такая фирма уже существует';
                    return res.status(status.conflict).send(errorMessage);
                } else {
                    Query = 'SELECT email FROM manufacturer_firm WHERE email = $1';
                    check = await pool.query(Query, [email]);
                    dbResponse = check.rows[0];
                    if (dbResponse) {
                        errorMessage.error = 'Такой email уже существует';
                        return res.status(status.conflict).send(errorMessage);
                    } else {
                        next()
                    }
                }
            }
        }
    }
};

checkDuplicateManufacturerFirmOnUpdate = async (req, res, next) => {
    const id = req.params.id
    const {country_of_manufacture_id, firm_name, email, address, year_open} = req.body;
    if (country_of_manufacture_id === undefined || firm_name === "" || email === undefined || address === "" || year_open === null) {
        errorMessage.error = 'Поля не могут быть пустыми';
        return res.status(status.conflict).send(errorMessage);
    } else {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email).toLowerCase())) {
            errorMessage.error = 'Email не корректен';
            return res.status(status.conflict).send(errorMessage);
        } else {
            const date = new Date()
            if (new Date(year_open) > date) {
                errorMessage.error = 'Дата основания не может быть больше чем сегодняшняя дата';
                return res.status(status.conflict).send(errorMessage);
            } else {
                let Query = 'SELECT firm_name FROM manufacturer_firm WHERE firm_name = $1 AND id != $2';
                let check = await pool.query(Query, [firm_name, id]);
                let dbResponse = check.rows[0];
                if (dbResponse) {
                    errorMessage.error = 'Такая фирма уже существует';
                    return res.status(status.conflict).send(errorMessage);
                } else {
                    Query = 'SELECT email FROM manufacturer_firm WHERE email = $1 AND id != $2';
                    check = await pool.query(Query, [email, id]);
                    dbResponse = check.rows[0];
                    if (dbResponse) {
                        errorMessage.error = 'Такой email уже существует';
                        return res.status(status.conflict).send(errorMessage);
                    } else {
                        next()
                    }
                }
            }
        }
    }
};

const verifyManufacturerFirm = {
    checkDuplicateManufacturerFirm: checkDuplicateManufacturerFirm,
    checkDuplicateManufacturerFirmOnUpdate: checkDuplicateManufacturerFirmOnUpdate,
};

module.exports = verifyManufacturerFirm;
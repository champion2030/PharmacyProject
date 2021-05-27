-- Симметричное внутреннее соединение с условием отбора по внешнему ключу

        -- Поиск фирм производителя по внешнему ключу - страна производитель
SELECT manufacturer_firm.id, country_of_manufacture.country, manufacturer_firm.firm_name, manufacturer_firm.email,
manufacturer_firm.address, manufacturer_firm.year_open
FROM manufacturer_firm
INNER JOIN country_of_manufacture
ON manufacturer_firm.country_of_manufacture_id = country_of_manufacture.id WHERE manufacturer_firm.firm_name ILIKE $1
OR country_of_manufacture.country ILIKE $2 ORDER BY manufacturer_firm.id LIMIT $3 OFFSET $4

        -- Поиск лекарств по внешнему ключу - фирма производитель
SELECT medicine.id, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group, manufacturer_firm.firm_name,
medicine.medicine_name, medicine.instruction, medicine.barcode
FROM medicine
INNER JOIN form_of_issue ON medicine.form_of_issue_id = form_of_issue.id
INNER JOIN pharmacological_group ON medicine.pharmacological_group_id = pharmacological_group.id
INNER JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id WHERE medicine.medicine_name ILIKE $1 OR manufacturer_firm.firm_name ILIKE $2
ORDER BY medicine.id LIMIT $3 OFFSET $4




-- Симметричное внутреннее соединение с условием отбора по датам

        -- Поиск фирм основанных раньше чем заданная дата
SELECT manufacturer_firm.id, country_of_manufacture.country, manufacturer_firm.firm_name, manufacturer_firm.email,
manufacturer_firm.address, manufacturer_firm.year_open
FROM manufacturer_firm
INNER JOIN country_of_manufacture
ON manufacturer_firm.country_of_manufacture_id = country_of_manufacture.id WHERE year_open < $1 ORDER BY manufacturer_firm.id LIMIT $2 OFFSET $3


        -- Поиск фирм основанных позже чем заданная дата
SELECT manufacturer_firm.id, country_of_manufacture.country, manufacturer_firm.firm_name, manufacturer_firm.email,
manufacturer_firm.address, manufacturer_firm.year_open
FROM manufacturer_firm
INNER JOIN country_of_manufacture
ON manufacturer_firm.country_of_manufacture_id = country_of_manufacture.id WHERE year_open > $1 ORDER BY manufacturer_firm.id LIMIT $2 OFFSET $3




-- Симметричное внутреннее соединение без условия

        -- Считывание таблицы аптеки
SELECT pharmacy.id, pharmacy_name.name, area.name_of_area, type_of_property.name_of_property, pharmacy.telephone, pharmacy.address
FROM pharmacy
INNER JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id
INNER JOIN area ON pharmacy.area_id = area.id
INNER JOIN type_of_property ON pharmacy.type_of_property_id = type_of_property.id ORDER BY pharmacy.id LIMIT $1 OFFSET $2

        -- Считывание таблицы Фирма производитель
SELECT manufacturer_firm.id, country_of_manufacture.country, manufacturer_firm.firm_name, manufacturer_firm.email,
manufacturer_firm.address, manufacturer_firm.year_open
FROM manufacturer_firm
INNER JOIN country_of_manufacture
ON manufacturer_firm.country_of_manufacture_id = country_of_manufacture.id ORDER BY manufacturer_firm.id LIMIT $1 OFFSET $2

        --Считывание таблицы Лекарства
SELECT medicine.id, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group, manufacturer_firm.firm_name,
medicine.medicine_name, medicine.instruction, medicine.barcode
FROM medicine
INNER JOIN form_of_issue ON medicine.form_of_issue_id = form_of_issue.id
INNER JOIN pharmacological_group ON medicine.pharmacological_group_id = pharmacological_group.id
INNER JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id ORDER BY medicine.id LIMIT $1 OFFSET $2





-- Левое внешнее соединение

        -- Получение всех поставок где причина возврата отсутствует
SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name,
reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages,
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date,
deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
JOIN employee ON deliveries.employee_id = employee.id
LEFT OUTER JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id ORDER BY deliveries.id LIMIT $1 OFFSET $2





-- Правое внешнее соединение

    -- Получение количество аптек в каждом районе каждого типа собственности
Select count(pharmacy.id), type_of_property.name_of_property, area.name_of_area
from pharmacy
right outer join type_of_property on type_of_property.id = pharmacy.type_of_property_id
right outer join area on area.id = pharmacy.area_id
group by type_of_property.name_of_property, area.name_of_area, area.id
order by area.id LIMIT $1 OFFSET $2




-- Запрос на запросе по принципу левого ссоединения

    -- Вывод всех сотрудников аптек и название аптек в которой они работают
SELECT employee.id, employee.pharmacy_id,
(SELECT pharmacy_name.name FROM pharmacy JOIN pharmacy_name ON pharmacy.name_id = pharmacy_name.id WHERE pharmacy.id = employee.pharmacy_id) AS pharmacy_name,
employee.name, employee.surname, employee.patronymic
FROM employee
JOIN pharmacy ON employee.pharmacy_id = pharmacy.id ORDER BY employee.id LIMIT $1 OFFSET $2




-- Итоговый запрос без условия

    -- Количество поставок для каждого производителя
select count(*), manufacturer_firm.firm_name
from deliveries
left join medicine on deliveries.medicine_id = medicine.id
left join manufacturer_firm on medicine.manufacture_firm_id = manufacturer_firm.id
group by manufacturer_firm.id
order by count(*) desc
LIMIT $1 OFFSET $2




-- Итоговый запрос с условием на данные

    -- Подсчет поставок и их количества за определённый промежуток времени
SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name,
reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages,
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
JOIN employee ON deliveries.employee_id = employee.id
LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id
WHERE deliveries.receipt_date BETWEEN $1 AND $2
ORDER BY deliveries.id
LIMIT $3 OFFSET $4




-- Итоговый запрос с условием на группы

    -- Подсчет поставок и их количества для конкретной фирмы
SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name,
reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages,
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id
JOIN employee ON deliveries.employee_id = employee.id
left join manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
where manufacturer_firm.id = $1 ORDER BY deliveries.id LIMIT $2 OFFSET $3





-- Итоговый запрос с условием на данные и на группы

    -- Поставки и их количество за определённый промежуток времени для конкретного производителя
SELECT deliveries.id, medicine.medicine_name, (employee.name || ' ' || employee.surname || ' ' || employee.patronymic) AS full_name,
reason_for_return.reason_for_return, deliveries.receipt_date, deliveries.number_of_packages,
deliveries.presence_of_defect, deliveries.supplier_price, deliveries.pharmacy_price, deliveries.expiry_start_date, deliveries.expiration_date, deliveries.batch_number
FROM deliveries
JOIN medicine ON deliveries.medicine_id = medicine.id
JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
JOIN employee ON deliveries.employee_id = employee.id
LEFT JOIN reason_for_return ON deliveries.cause_id = reason_for_return.id
WHERE deliveries.receipt_date BETWEEN $1 AND $2 AND manufacturer_firm.id = $3
ORDER BY deliveries.id
LIMIT $4 OFFSET $5





-- Запрос на запросе по принципу итогового запроса

    -- Поиск самого дорогого лекарства поставленного в конкретную аптеку
SELECT deliveries.id, medicine.medicine_name, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group, manufacturer_firm.firm_name, deliveries.supplier_price
    FROM deliveries
    JOIN medicine ON deliveries.medicine_id = medicine.id
    JOIN form_of_issue ON medicine.form_of_issue_id = form_of_issue.id
    JOIN pharmacological_group ON medicine.pharmacological_group_id = pharmacological_group.id
    JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
    JOIN employee ON deliveries.employee_id = employee.id
    JOIN pharmacy ON employee.pharmacy_id = pharmacy.id
    where pharmacy.id = $1
    order by deliveries.supplier_price desc
    limit 1




-- Итоговый запрос с подзапросом

    -- Производители с количеством лекарств больше среднего
    select * from (select count(*) as cnt,
    (SELECT country_of_manufacture.country FROM manufacturer_firm JOIN country_of_manufacture ON manufacturer_firm.country_of_manufacture_id = country_of_manufacture.id
     WHERE manufacturer_firm.id = me.manufacture_firm_id) as country_of_manufacture, mf.firm_name, mf.email, mf.address, mf.year_open from medicine me
    join manufacturer_firm mf on mf.id = me.manufacture_firm_id
    group by manufacture_firm_id, mf.id
    order by cnt desc
    limit $1 offset $2
    ) ant
    where
    ant.cnt > (select avg(cnm) from (select count(*) as cnm, manufacture_firm_id from medicine group by manufacture_firm_id) as d)
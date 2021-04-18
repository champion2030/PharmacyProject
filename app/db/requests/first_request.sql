
--Топ 5 лекарств поставляемых в конкретную аптеку

select medicine.id, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group,
manufacturer_firm.firm_name, medicine.medicine_name, medicine.instruction, medicine.barcode, count(*)
FROM medicine
JOIN form_of_issue ON medicine.form_of_issue_id = form_of_issue.id
JOIN pharmacological_group ON medicine.pharmacological_group_id = pharmacological_group.id
JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
left join deliveries on deliveries.medicine_id = medicine.id
left join employee on deliveries.employee_id = employee.id
left join pharmacy on employee.pharmacy_id = pharmacy.id
where pharmacy.id = 10
group by medicine.id, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group, manufacturer_firm.firm_name
order by count(*) desc
limit 5

--Топ 5 лекарств поставляемых по конкретному району

select medicine.id, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group,
manufacturer_firm.firm_name, medicine.medicine_name, medicine.instruction, medicine.barcode, count(*)
FROM medicine
JOIN form_of_issue ON medicine.form_of_issue_id = form_of_issue.id
JOIN pharmacological_group ON medicine.pharmacological_group_id = pharmacological_group.id
JOIN manufacturer_firm ON medicine.manufacture_firm_id = manufacturer_firm.id
left join deliveries on deliveries.medicine_id = medicine.id
left join employee on deliveries.employee_id = employee.id
left join pharmacy on employee.pharmacy_id = pharmacy.id
left join area on pharmacy.area_id = area.id
where area.id = 1
group by medicine.id, form_of_issue.form_of_issue, pharmacological_group.pharmacological_group, manufacturer_firm.firm_name
order by count(*) desc
limit 5
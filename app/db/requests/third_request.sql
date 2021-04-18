
--Определить сколько было возвратов лекарств и на какую сумму по каждому производителю лекарств.

select count(*), sum(supplier_price), manufacturer_firm.firm_name
from deliveries
left join medicine on deliveries.medicine_id = medicine.id
left join manufacturer_firm on medicine.manufacture_firm_id = manufacturer_firm.id
where deliveries.presence_of_defect=true
group by manufacturer_firm.id
order by count(*) desc

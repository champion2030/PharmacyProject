
--Получить количество аптек каждого типа собственности в каждом районе

select count(pharmacy.id), type_of_property.name_of_property, area.name_of_area
from pharmacy
right join type_of_property on type_of_property.id = pharmacy.type_of_property_id
right join area on area.id = pharmacy.area_id
group by type_of_property.name_of_property, area.name_of_area, area.id
order by area.id desc

--Количество аптек конкретного типа собственности по городу в целом

select count(pharmacy.id), type_of_property.name_of_property
from pharmacy
right join type_of_property on type_of_property.id = pharmacy.type_of_property_id
group by type_of_property.name_of_property, type_of_property.id
order by type_of_property.id desc
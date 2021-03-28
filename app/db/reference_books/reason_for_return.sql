INSERT INTO reason_for_return(reason_for_return) VALUES('Срок годности лекарственного средства истек') RETURNING *;
INSERT INTO reason_for_return(reason_for_return) VALUES('Стерты дата изготовления и/или срок годности, отсутствуют обязательные маркировки') RETURNING *;
INSERT INTO reason_for_return(reason_for_return) VALUES('Обнаружены повреждения упаковки') RETURNING *;
INSERT INTO reason_for_return(reason_for_return) VALUES('Препарат является подделкой или некачественный') RETURNING *;
INSERT INTO reason_for_return(reason_for_return) VALUES('Ошибка фармацевта') RETURNING *;
INSERT INTO reason_for_return(reason_for_return) VALUES('Отсутствие инструкции') RETURNING *
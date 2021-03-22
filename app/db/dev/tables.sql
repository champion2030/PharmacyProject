CREATE TABLE  IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    username CHARACTER VARYING(30) NOT NULL UNIQUE,
    email CHARACTER VARYING(30) NOT NULL UNIQUE,
    password CHARACTER VARYING(100) NOT NULL,
	CHECK ((username != '') AND (email !='') AND (password !=''))
);

CREATE TABLE IF NOT EXISTS formOfIssue
(
    id SERIAL PRIMARY KEY,
    formOfIssue VARCHAR(100) NOT NULL UNIQUE,
);

CREATE TABLE IF NOT EXISTS pharmacologicalGroup
(
    id SERIAL PRIMARY KEY,
    pharmacologicalGroup  VARCHAR(100) NOT NULL UNIQUE,
);


CREATE TABLE IF NOT EXISTS countryOfManufacture
(
    id SERIAL PRIMARY KEY,
    countryOfManufacture  VARCHAR(100) NOT NULL UNIQUE,
);

CREATE TABLE IF NOT EXISTS manufacturingFirm
(
    id SERIAL PRIMARY KEY,
    countryOfManufactureId INTEGER,
    manufacturingFirm  VARCHAR(100) NOT NULL UNIQUE,
    FOREIGN KEY (countryOfManufactureId) REFERENCES countryOfManufacture(id) ON DELETE CASCADE,
    FOREIGN KEY (countryOfManufactureId) REFERENCES countryOfManufacture(id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS medicine
(
    id SERIAL PRIMARY KEY,
    manufacturingFirmId INTEGER,
    pharmacologicalGroupId INTEGER,
    formOfIssueId INTEGER,
    drugName VARCHAR(100) NOT NULL UNIQUE,

    FOREIGN KEY (manufacturingFirmId) REFERENCES manufacturingFirm(id) ON DELETE CASCADE,
    FOREIGN KEY (manufacturingFirmId) REFERENCES manufacturingFirm(id) ON UPDATE CASCADE,

    FOREIGN KEY (pharmacologicalGroupId) REFERENCES pharmacologicalGroup(id) ON DELETE CASCADE,
    FOREIGN KEY (pharmacologicalGroupId) REFERENCES pharmacologicalGroup(id) ON UPDATE CASCADE,

    FOREIGN KEY (formOfIssueId) REFERENCES formOfIssue(id) ON DELETE CASCADE,
    FOREIGN KEY (formOfIssueId) REFERENCES formOfIssue(id) ON UPDATE CASCADE,
);
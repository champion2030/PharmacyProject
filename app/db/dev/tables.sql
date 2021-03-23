CREATE TABLE "pharmacy" (
	"id" serial NOT NULL,
	"nameId" integer NOT NULL,
	"areaId" integer NOT NULL,
	"typeOPpropertyId" integer NOT NULL,
	"telephone" varchar(50) NOT NULL UNIQUE,
	"address" varchar(50) NOT NULL,
	CONSTRAINT "pharmacy_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "type_of_property" (
	"id" serial NOT NULL,
	"nameOfProperty" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "type_of_property_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "pharmacy_name" (
	"id" serial NOT NULL,
	"name" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "pharmacy_name_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "area" (
	"id" serial NOT NULL,
	"nameOfArea" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "area_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "employee" (
	"id" serial NOT NULL,
	"pharmacyId" integer NOT NULL,
	"name" varchar(50) NOT NULL,
	"surname" varchar(50) NOT NULL,
	"patronymic" varchar(50) NOT NULL,
	CONSTRAINT "employee_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "country_of_manufacture" (
	"id" serial NOT NULL,
	"country" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "country_of_manufacture_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "manufacturer_firm" (
	"id" serial NOT NULL,
	"countryOfManufactureId" integer NOT NULL,
	"firmName" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "manufacturer_firm_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "medicine" (
	"id" serial NOT NULL,
	"formOfIssueId" integer NOT NULL,
	"pharmacologicalGroupId" integer NOT NULL,
	"manufactureFirmId" integer NOT NULL,
	"medicineName" varchar(50) NOT NULL,
	CONSTRAINT "medicine_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "pharmacological_group" (
	"id" serial NOT NULL,
	"pharmacologicalGroup" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "pharmacological_group_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "deliveries" (
	"id" serial NOT NULL,
	"medicineId" integer NOT NULL,
	"employeeId" integer NOT NULL,
	"causeId" integer,
	"receiptDate" DATE NOT NULL,
	"numberOfPackages" integer NOT NULL,
	"presenceOfDefect" BOOLEAN NOT NULL,
	"supplierPrice" integer NOT NULL,
	"pharmacyPrice" integer NOT NULL,
	"expiryStartDate" DATE NOT NULL,
	"expirationDate" DATE NOT NULL,
	CONSTRAINT "deliveries_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "form_of_issue" (
	"id" serial NOT NULL,
	"formOfIssue" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "form_of_issue_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




CREATE TABLE "reason_for_return" (
	"id" serial NOT NULL,
	"reasonForReturn" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "reason_for_return_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "pharmacy" ADD CONSTRAINT "pharmacy_fk0" FOREIGN KEY ("nameId") REFERENCES "pharmacy_name"("id");
ALTER TABLE "pharmacy" ADD CONSTRAINT "pharmacy_fk1" FOREIGN KEY ("areaId") REFERENCES "area"("id");
ALTER TABLE "pharmacy" ADD CONSTRAINT "pharmacy_fk2" FOREIGN KEY ("typeOPpropertyId") REFERENCES "type_of_property"("id");




ALTER TABLE "employee" ADD CONSTRAINT "employee_fk0" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacy"("id");


ALTER TABLE "manufacturer_firm" ADD CONSTRAINT "manufacturer_firm_fk0" FOREIGN KEY ("countryOfManufactureId") REFERENCES "country_of_manufacture"("id");

ALTER TABLE "medicine" ADD CONSTRAINT "medicine_fk0" FOREIGN KEY ("formOfIssueId") REFERENCES "form_of_issue"("id");
ALTER TABLE "medicine" ADD CONSTRAINT "medicine_fk1" FOREIGN KEY ("pharmacologicalGroupId") REFERENCES "pharmacological_group"("id");
ALTER TABLE "medicine" ADD CONSTRAINT "medicine_fk2" FOREIGN KEY ("manufactureFirmId") REFERENCES "manufacturer_firm"("id");


ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_fk0" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id");
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_fk1" FOREIGN KEY ("employeeId") REFERENCES "employee"("id");
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_fk2" FOREIGN KEY ("causeId") REFERENCES "reason_for_return"("id");
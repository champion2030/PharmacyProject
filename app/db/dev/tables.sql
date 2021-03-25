CREATE TABLE "pharmacy" (
	"id" serial NOT NULL,
	"name_id" integer NOT NULL,
	"area_id" integer NOT NULL,
	"type_of_property_id" integer NOT NULL,
	"telephone" varchar(50) NOT NULL UNIQUE,
	"address" varchar(50) NOT NULL,
	CONSTRAINT "pharmacy_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "type_of_property" (
	"id" serial NOT NULL,
	"name_of_property" varchar(50) NOT NULL UNIQUE,
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
	"name_of_area" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "area_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "employee" (
	"id" serial NOT NULL,
	"pharmacy_id" integer NOT NULL,
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
	"country_of_manufacture_id" integer NOT NULL,
	"firm_name" varchar(50) NOT NULL UNIQUE,
	"email" varchar(50) NOT NULL UNIQUE,
	"address" varchar(50) NOT NULL UNIQUE,
	"year_open" DATE NOT NULL,
	CONSTRAINT "manufacturer_firm_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "medicine" (
	"id" serial NOT NULL,
	"form_of_issue_id" integer NOT NULL,
	"pharmacological_group_id" integer NOT NULL,
	"manufacture_firm_id" integer NOT NULL,
	"medicine_name" varchar(50) NOT NULL,
	CONSTRAINT "medicine_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "pharmacological_group" (
	"id" serial NOT NULL,
	"pharmacological_group" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "pharmacological_group_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "deliveries" (
	"id" serial NOT NULL,
	"medicine_id" integer NOT NULL,
	"employee_id" integer NOT NULL,
	"cause_id" integer,
	"receipt_date" DATE NOT NULL,
	"number_of_packages" integer NOT NULL,
	"presence_of_defect" BOOLEAN NOT NULL,
	"supplier_price" integer NOT NULL,
	"pharmacy_price" integer NOT NULL,
	"expiry_start_date" DATE NOT NULL,
	"expiration_date" DATE NOT NULL,
	CONSTRAINT "deliveries_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "form_of_issue" (
	"id" serial NOT NULL,
	"form_of_issue" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "form_of_issue_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




CREATE TABLE "reason_for_return" (
	"id" serial NOT NULL,
	"reason_for_return" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "reason_for_return_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "pharmacy" ADD CONSTRAINT "pharmacy_fk0" FOREIGN KEY ("name_id") REFERENCES "pharmacy_name"("id");
ALTER TABLE "pharmacy" ADD CONSTRAINT "pharmacy_fk1" FOREIGN KEY ("area_id") REFERENCES "area"("id");
ALTER TABLE "pharmacy" ADD CONSTRAINT "pharmacy_fk2" FOREIGN KEY ("type_of_property_id") REFERENCES "type_of_property"("id");




ALTER TABLE "employee" ADD CONSTRAINT "employee_fk0" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacy"("id");


ALTER TABLE "manufacturer_firm" ADD CONSTRAINT "manufacturer_firm_fk0" FOREIGN KEY ("country_of_manufacture_id") REFERENCES "country_of_manufacture"("id");

ALTER TABLE "medicine" ADD CONSTRAINT "medicine_fk0" FOREIGN KEY ("form_of_issue_id") REFERENCES "form_of_issue"("id");
ALTER TABLE "medicine" ADD CONSTRAINT "medicine_fk1" FOREIGN KEY ("pharmacological_group_id") REFERENCES "pharmacological_group"("id");
ALTER TABLE "medicine" ADD CONSTRAINT "medicine_fk2" FOREIGN KEY ("manufacture_firm_id") REFERENCES "manufacturer_firm"("id");


ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_fk0" FOREIGN KEY ("medicine_id") REFERENCES "medicine"("id");
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_fk1" FOREIGN KEY ("employee_id") REFERENCES "employee"("id");
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_fk2" FOREIGN KEY ("cause_id") REFERENCES "reason_for_return"("id");
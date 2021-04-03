const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifyFormOfIssue = require("./verifyFormOfIssue");
const verifyCountry = require("./verifyCountryOfManufacture");
const verifyPharmacologicalGroup = require("./verifyPharmacologicalGroup");
const verifyTypeOfProperty = require("./verifyTypeOfProperty");
const verifyPharmacyName = require("./verifyPharmacyName");
const verifyArea = require("./verifyArea");
const verifyReasonForReturn = require("./verifyReasonForReturn");
const verifyManufacturerFirm = require("./verifyManufacturerFirm");
const verifyMedicine = require("./verifyMedicine");

module.exports = {
    authJwt,
    verifySignUp,
    verifyFormOfIssue,
    verifyCountry,
    verifyPharmacologicalGroup,
    verifyTypeOfProperty,
    verifyPharmacyName,
    verifyArea,
    verifyReasonForReturn,
    verifyManufacturerFirm,
    verifyMedicine
};
const controller = require("../controllers/countryOfManufacture.controller.js");
const verifyCountry = require("../middlewares/verifyCountryOfManufacture");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getCountryOfManufacture", [authJwt.verifyToken], controller.getCountry);

    app.get("/api/getCurrentCountryOfManufacture/:id", [authJwt.verifyToken], controller.getCurrentCountry)

    app.get("/api/deleteCountryOfManufactureInfo/:id", [authJwt.verifyToken], controller.getDeleteCountryInfo)

    app.delete("/api/deleteCountryOfManufacture/:id", [authJwt.verifyToken], controller.deleteCountry);

    app.post("/api/createCountryOfManufacture", [authJwt.verifyToken, verifyCountry.checkDuplicateCountry], controller.createNewCountry);

    app.put("/api/updateCountryOfManufacture/:id", [authJwt.verifyToken, verifyCountry.checkDuplicateCountryOnUpdate], controller.updateCountry);
};
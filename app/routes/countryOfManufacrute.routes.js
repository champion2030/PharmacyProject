const controller = require("../controllers/countryOfManufacture.controller.js");
const verifyCountry = require("../middlewares/verifyCountryOfManufacture");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getCountryOfManufacture",
        //[authJwt.verifyToken],
        controller.getCountry);

    app.get("/api/getCurrentCountryOfManufacture/:id",
        //[authJwt.verifyToken],
        controller.getCurrentCountry)

    app.delete("/api/deleteCountryOfManufacture/:id",
        //[authJwt.verifyToken],
        controller.deleteCountry);

    app.post("/api/createCountryOfManufacture",
        [verifyCountry.checkDuplicateCountry],
        controller.createNewCountry);

    app.put("/api/updateCountryOfManufacture/:id",
        [verifyCountry.checkDuplicateCountryOnUpdate],
        controller.updateCountry);
};
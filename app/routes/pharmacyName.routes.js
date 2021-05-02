const controller = require("../controllers/pharmacyName.controller.js");
const verifyPharmacyName = require("../middlewares/verifyPharmacyName.js");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getPharmacyName", [authJwt.verifyToken], controller.getPharmacyName);

    app.get("/api/getCurrentPharmacyName/:id", [authJwt.verifyToken], controller.getCurrentPharmacyName);

    app.get("/api/deletePharmacyNameInfo/:id", [authJwt.verifyToken], controller.getDeletePharmacyNameInfo);

    app.delete("/api/deletePharmacyName/:id", [authJwt.verifyToken], controller.deletePharmacyName);

    app.post("/api/createPharmacyName", [authJwt.verifyToken, verifyPharmacyName.checkDuplicatePharmacyName], controller.createNewPharmacyName);

    app.put("/api/updatePharmacyName/:id", [authJwt.verifyToken, verifyPharmacyName.checkDuplicatePharmacyNameOnUpdate], controller.updatePharmacyName);
};
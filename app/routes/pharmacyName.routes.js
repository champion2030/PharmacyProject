const controller = require("../controllers/pharmacyName.controller.js");
const verifyPharmacyName = require("../middlewares/verifyPharmacyName.js");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getPharmacyName",
        //[authJwt.verifyToken],
        controller.getPharmacyName);

    app.get("/api/getCurrentPharmacyName/:id",
        //[authJwt.verifyToken],
        controller.getCurrentPharmacyName);

    app.delete("/api/deletePharmacyName/:id",
        //[authJwt.verifyToken],
        controller.deletePharmacyName);

    app.post("/api/createPharmacyName",
        [verifyPharmacyName.checkDuplicatePharmacyName],
        controller.createNewPharmacyName);

    app.put("/api/updatePharmacyName/:id",
        [verifyPharmacyName.checkDuplicatePharmacyNameOnUpdate],
        controller.updatePharmacyName);
};
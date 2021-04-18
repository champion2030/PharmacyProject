const controller = require("../controllers/pharmacy.controller.js");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getAllPharmacy",
        //[authJwt.verifyToken],
        controller.getAllPharmacy);

    app.get("/api/getPharmacy",
        //[authJwt.verifyToken],
        controller.getPharmacy);

    app.get("/api/getCurrentPharmacy/:id",
        //[authJwt.verifyToken],
        controller.getCurrentPharmacy);

    app.get("/api/deletePharmacyInfo/:id",
        //[authJwt.verifyToken],
        controller.getDeletePharmacyInfo);

    app.delete("/api/deletePharmacy/:id",
        //[authJwt.verifyToken],
        controller.deletePharmacy);

    app.post("/api/createPharmacy",
        //[authJwt.verifyToken],
        controller.createNewPharmacy);

    app.put("/api/updatePharmacy/:id",
        //[authJwt.verifyToken],
        controller.updatePharmacy);
};
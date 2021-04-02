const controller = require("../controllers/pharmacy.controller.js");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getPharmacy",
        //[authJwt.verifyToken],
        controller.getPharmacy);

    app.get("/api/getCurrentPharmacy/:id",
        //[authJwt.verifyToken],
        controller.getCurrentPharmacy);

    app.delete("/api/deletePharmacy/:id",
        //[authJwt.verifyToken],
        controller.deletePharmacy);

    app.post("/api/createPharmacy",
        controller.createNewPharmacy);

    app.put("/api/updatePharmacy/:id",
        controller.updatePharmacy);
};
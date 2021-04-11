const controller = require("../controllers/pharmacologicalGroup.controller.js");
const verifyPharmacologicalGroup = require("../middlewares/verifyPharmacologicalGroup");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getPharmacologicalGroup",
        //[authJwt.verifyToken],
        controller.getPharmacologicalGroup);

    app.get("/api/getCurrentPharmacologicalGroup/:id",
        //[authJwt.verifyToken],
        controller.getCurrentPharmacologicalGroup);

    app.delete("/api/deletePharmacologicalGroup/:id",
        //[authJwt.verifyToken],
        controller.deletePharmacologicalGroup);

    app.post("/api/createPharmacologicalGroup",
        [verifyPharmacologicalGroup.checkDuplicatePharmacologicalGroup],
        controller.createNewPharmacologicalGroup);

    app.put("/api/updatePharmacologicalGroup/:id",
        [verifyPharmacologicalGroup.checkDuplicatePharmacologicalGroupOnUpdate],
        controller.updatePharmacologicalGroup);
};
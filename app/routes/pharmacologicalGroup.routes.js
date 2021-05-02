const controller = require("../controllers/pharmacologicalGroup.controller.js");
const verifyPharmacologicalGroup = require("../middlewares/verifyPharmacologicalGroup");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getPharmacologicalGroup", [authJwt.verifyToken], controller.getPharmacologicalGroup);

    app.get("/api/getCurrentPharmacologicalGroup/:id", [authJwt.verifyToken], controller.getCurrentPharmacologicalGroup);

    app.get("/api/getDeletePharmacologicalGroupInfo/:id", [authJwt.verifyToken], controller.getDeletePharmacologicalGroupInfo);

    app.delete("/api/deletePharmacologicalGroup/:id", [authJwt.verifyToken], controller.deletePharmacologicalGroup);

    app.post("/api/createPharmacologicalGroup", [authJwt.verifyToken, verifyPharmacologicalGroup.checkDuplicatePharmacologicalGroup], controller.createNewPharmacologicalGroup);

    app.put("/api/updatePharmacologicalGroup/:id", [authJwt.verifyToken, verifyPharmacologicalGroup.checkDuplicatePharmacologicalGroupOnUpdate], controller.updatePharmacologicalGroup);
};
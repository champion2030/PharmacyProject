const controller = require("../controllers/manufacturerFirm.controller.js");
const verifyManufacturerFirm = require("../middlewares/verifyManufacturerFirm");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getManufacturerFirm", [authJwt.verifyToken], controller.getManufacturerFirm);

    app.get("/api/getCurrentManufacturerFirm/:id", [authJwt.verifyToken], controller.getCurrentManufacturerFirm);

    app.get("/api/getAllManufacturerFirm", [authJwt.verifyToken], controller.getAllManufacturerFirm);

    app.get("/api/deleteManufacturerFirmInfo/:id", [authJwt.verifyToken], controller.getDeleteManufacturerFirmInfo);

    app.delete("/api/deleteManufacturerFirm/:id", [authJwt.verifyToken], controller.deleteManufacturerFirm);

    app.delete("/api/deleteGroupOfFirms", [authJwt.verifyToken], controller.deleteGroupOfFirms);

    app.post("/api/createManufacturerFirm", [authJwt.verifyToken, verifyManufacturerFirm.checkDuplicateManufacturerFirm], controller.createNewManufacturerFirm);

    app.put("/api/updateManufacturerFirm/:id", [authJwt.verifyToken, verifyManufacturerFirm.checkDuplicateManufacturerFirmOnUpdate], controller.updateManufacturerFirm);
};
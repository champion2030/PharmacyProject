const controller = require("../controllers/area.controller.js");
const verifyArea = require("../middlewares/verifyArea.js");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getArea", [authJwt.verifyToken], controller.getArea);

    app.get("/api/getCurrentArea/:id", [authJwt.verifyToken], controller.getCurrentArea);

    app.get("/api/deleteAreaInfo/:id", [authJwt.verifyToken], controller.getDeleteAreaInfo);

    app.delete("/api/deleteArea/:id", [authJwt.verifyToken], controller.deleteArea);

    app.post("/api/createArea", [authJwt.verifyToken, verifyArea.checkDuplicateArea], controller.createNewArea);

    app.put("/api/updateArea/:id", [authJwt.verifyToken, verifyArea.checkDuplicateAreaOnUpdate], controller.updateArea);
};
const controller = require("../controllers/typeOfProperty.controller.js");
const verifyTypeOfProperty = require("../middlewares/verifyTypeOfProperty");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getTypeOfProperty",
        //[authJwt.verifyToken],
        controller.getTypeOfProperty);

    app.get("/api/getCurrentTypeOfProperty/:id",
        //[authJwt.verifyToken],
        controller.getCurrentTypeOfProperty);

    app.delete("/api/deleteTypeOfProperty/:id",
        //[authJwt.verifyToken],
        controller.deleteTypeOfProperty);

    app.post("/api/createTypeOfProperty",
        [verifyTypeOfProperty.checkDuplicateTypeOfProperty],
        controller.createNewTypeOfProperty);

    app.put("/api/updateTypeOfProperty/:id",
        [verifyTypeOfProperty.checkDuplicateTypeOfPropertyOnUpdate],
        controller.updateTypeOfProperty);
};
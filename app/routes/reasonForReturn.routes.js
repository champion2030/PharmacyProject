const controller = require("../controllers/reasonForReturn.controller.js");
const verifyTypeOfProperty = require("../middlewares/verifyReasonForReturn");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getReasonForReturn",
        //[authJwt.verifyToken],
        controller.getReasonForReturn);

    app.get("/api/getCurrentReasonForReturn/:id",
        //[authJwt.verifyToken],
        controller.getCurrentReasonForReturn);

    app.get("/api/deleteReasonForReturnInfo/:id",
        //[authJwt.verifyToken],
        controller.getDeleteReasonForReturnInfo);

    app.delete("/api/deleteReasonForReturn/:id",
        //[authJwt.verifyToken],
        controller.deleteReasonForReturn);

    app.post("/api/createReasonForReturn",
        [verifyTypeOfProperty.checkDuplicateReasonForReturn],
        controller.createNewReasonForReturn);

    app.put("/api/updateReasonForReturn/:id",
        [verifyTypeOfProperty.checkDuplicateReasonForReturnOnUpdate],
        controller.updateReasonForReturn);
};
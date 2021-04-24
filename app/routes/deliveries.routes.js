const controller = require("../controllers/deliveries.controller.js");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getDeliveries",
        //[authJwt.verifyToken],
        controller.getDeliveries);

    app.get("/api/getCurrentDeliver/:id",
        //[authJwt.verifyToken],
        controller.getCurrentDeliver);

    app.get("/api/getDeliveriesForCurrentPharmacy/:id",
        //[authJwt.verifyToken],
        controller.getDeliversForCurrentPharmacy);

    app.delete("/api/deleteDeliver/:id",
        //[authJwt.verifyToken],
        controller.deleteDeliver);

    app.delete("/api/deleteGroupOfDelivers",
        //[authJwt.verifyToken],
        controller.deleteGroupOfDelivers);

    app.post("/api/createDeliver",
        controller.createNewDeliver);

    app.put("/api/updateDeliver/:id",
        controller.updateDeliver);
};
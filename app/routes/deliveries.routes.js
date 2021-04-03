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

    app.delete("/api/deleteDeliver/:id",
        //[authJwt.verifyToken],
        controller.deleteDeliver);

    app.post("/api/createDeliver",
        controller.createNewDeliver);

    app.put("/api/updateDeliver/:id",
        controller.updateDeliver);
};
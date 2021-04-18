const controller = require("../controllers/requests.controller.js");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/firstRequestPartOne",
        //[authJwt.verifyToken],
        controller.getFirstRequestPartOne);

    app.post("/api/firstRequestPartTwo",
        //[authJwt.verifyToken],
        controller.getFirstRequestPartTwo);

    app.get("/api/secondRequest",
        //[authJwt.verifyToken],
        controller.getSecondRequest);

    app.get("/api/thirdRequest",
        //[authJwt.verifyToken],
        controller.getThirdRequest);
};
const controller = require("../controllers/requests.controller.js");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/firstRequestPartOne", [authJwt.verifyToken], controller.getFirstRequestPartOne);

    app.get("/api/firstRequestPartTwo", [authJwt.verifyToken], controller.getFirstRequestPartTwo);

    app.get("/api/secondRequestFirstPart", [authJwt.verifyToken], controller.getSecondRequestFirstPart);

    app.get("/api/secondRequestSecondPart", [authJwt.verifyToken], controller.getSecondRequestSecondPart);

    app.get("/api/thirdRequest", [authJwt.verifyToken], controller.getThirdRequest);

    app.post("/api/dateFirstRequest", [authJwt.verifyToken], controller.dateFirstRequest);

    app.post("/api/dateSecondRequest", [authJwt.verifyToken], controller.dateSecondRequest);
};
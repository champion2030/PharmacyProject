const controller = require("../controllers/summaryQueries.controller.js");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/queryWithDataCondition", [authJwt.verifyToken], controller.queryWithDataCondition);

    app.post("/api/queryWithConditionForGroups", [authJwt.verifyToken], controller.queryWithConditionForGroups);

    app.post("/api/finalQueryWithDataAndGroup", [authJwt.verifyToken], controller.getFinalQueryWithDataAndGroups);

    app.get("/api/finalRequestWithoutCondition", [authJwt.verifyToken], controller.getFinalRequestWithoutCondition);

    app.post("/api/queryOnWrapUpQuery", [authJwt.verifyToken], controller.getQueryOnWrapUpQuery)

    app.get("/api/finalQueryWithSubquery", [authJwt.verifyToken], controller.getFinalQueryWithSubquery)

    app.get("/api/diagram",
        //[authJwt.verifyToken],
     controller.getDiagram)


};
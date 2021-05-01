const controller = require("../controllers/summaryQueries.controller.js");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/queryWithDataCondition",
        //[authJwt.verifyToken],
        controller.queryWithDataCondition);

    app.get("/api/queryWithConditionForGroups",
        //[authJwt.verifyToken],
        controller.queryWithConditionForGroups);

    app.post("/api/finalQueryWithDataAndGroup",
        //[authJwt.verifyToken],
        controller.getFinalQueryWithDataAndGroups);
};
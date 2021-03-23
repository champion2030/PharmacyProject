const controller = require("../controllers/formOfIssue.controller.js");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/formOfIssues",
        //[authJwt.verifyToken],
        controller.getFormOfIssues);

    app.delete("/api/deleteFormOfIssue/:id",
        //[authJwt.verifyToken],
        controller.deleteFormOfIssue);

    app.post("/api/newFormOfIssue",
        controller.createNewForm);


};
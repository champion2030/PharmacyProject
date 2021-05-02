const controller = require("../controllers/formOfIssue.controller.js");
const authJwt = require("../middlewares/authJwt");
const {verifyFormOfIssue} = require("../middlewares");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getFormOfIssue", [authJwt.verifyToken], controller.getFormOfIssues);

    app.get("/api/getCurrentFormOfIssue/:id", [authJwt.verifyToken], controller.getCurrentFormOfIssue);

    app.get("/api/getDeleteFormOfIssueInfo/:id", [authJwt.verifyToken], controller.getDeleteFormOfIssueInfo);

    app.delete("/api/deleteFormOfIssue/:id", [authJwt.verifyToken], controller.deleteFormOfIssue);

    app.post("/api/createFormOfIssue", [authJwt.verifyToken, verifyFormOfIssue.checkDuplicateFormOfIssue], controller.createNewForm);

    app.put("/api/updateFormOfIssue/:id", [authJwt.verifyToken, verifyFormOfIssue.checkDuplicateFormOfIssueOnUpdate], controller.updateFormOfIssue);
};
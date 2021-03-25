const controller = require("../controllers/formOfIssue.controller.js");
const {verifyFormOfIssue} = require("../middlewares");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getFormOfIssue",
        //[authJwt.verifyToken],
        controller.getFormOfIssues);

    app.delete("/api/deleteFormOfIssue/:id",
        //[authJwt.verifyToken],
        controller.deleteFormOfIssue);

    app.post("/api/createFormOfIssue",
        [verifyFormOfIssue.checkDuplicateFormOfIssue],
        controller.createNewForm);

    app.put("/api/updateFormOfIssue/:id",
        controller.updateFormOfIssue);
};
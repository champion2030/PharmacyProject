const controller = require("../controllers/employee.controller.js");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getEmployee",
        //[authJwt.verifyToken],
        controller.getEmployee);

    app.get("/api/getCurrentEmployee/:id",
        //[authJwt.verifyToken],
        controller.getCurrentEmployee);

    app.delete("/api/deleteEmployee/:id",
        //[authJwt.verifyToken],
        controller.deleteEmployee);

    app.post("/api/createEmployee",
        controller.createNewEmployee);

    app.put("/api/updateEmployee/:id",
        controller.updateEmployee);
};
const controller = require("../controllers/employee.controller.js");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getAllEmployee", [authJwt.verifyToken], controller.getAllEmployee);

    app.get("/api/getEmployee", [authJwt.verifyToken], controller.getEmployee);

    app.get("/api/getCurrentEmployee/:id", [authJwt.verifyToken], controller.getCurrentEmployee);

    app.get("/api/deleteEmployeeInfo/:id", [authJwt.verifyToken], controller.getDeleteEmployeeInfo);

    app.get("/api/getEmployeeForCurrentPharmacy/:id", [authJwt.verifyToken], controller.getEmployeeForCurrentPharmacy);

    app.delete("/api/deleteEmployee/:id", [authJwt.verifyToken], controller.deleteEmployee);

    app.delete("/api/deleteGroupOfEmployee", [authJwt.verifyToken], controller.deleteGroupOfEmployee);

    app.post("/api/createEmployee", [authJwt.verifyToken], controller.createNewEmployee);

    app.put("/api/updateEmployee/:id", [authJwt.verifyToken], controller.updateEmployee);
};
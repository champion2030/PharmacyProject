const controller = require("../controllers/medicine.controller.js");
const verifyMedicine = require("../middlewares/verifyMedicine");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getAllMedicine",
        //[authJwt.verifyToken],
        controller.getAllMedicine);

    app.get("/api/getMedicine",
        //[authJwt.verifyToken],
        controller.getMedicine);

    app.get("/api/getCurrentMedicine/:id",
        //[authJwt.verifyToken],
        controller.getCurrentMedicine);

    app.delete("/api/deleteMedicine/:id",
        //[authJwt.verifyToken],
        controller.deleteMedicine);

    app.post("/api/createMedicine",
        [verifyMedicine.checkDuplicateMedicine],
        controller.createNewMedicine);

    app.put("/api/updateMedicine/:id",
        [verifyMedicine.checkDuplicateMedicineOnUpdate],
        controller.updateMedicine);
};
const controller = require("../controllers/user.controller.js");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.delete("/api/deleteUser/:id",
        //[authJwt.verifyToken],
        controller.deleteUser);

    app.get("/api/users",
        //[authJwt.verifyToken],
        controller.paginatedUsers);
};
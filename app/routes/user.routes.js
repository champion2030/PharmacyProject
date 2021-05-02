const controller = require("../controllers/user.controller.js");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.delete("/api/deleteUser/:id", controller.deleteUser);

    app.get("/api/users", controller.paginatedUsers);
};
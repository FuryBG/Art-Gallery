const authController = require("../controllers/authController");
const publicationsController = require("../controllers/publicationsController");


module.exports = (app) => {
    app.use("/auth", authController);
    app.use("/", publicationsController);
};
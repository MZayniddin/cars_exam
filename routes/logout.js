const router = require("express").Router();

// CONTROLLER
const logoutController = require("../controllers/logoutController");

router.get("/", logoutController.handleLogout);

module.exports = router;

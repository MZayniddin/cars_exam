const router = require("express").Router();

// CONTROLLER
const refreshController = require("../controllers/refreshController.js");

router.get("/", refreshController.handleRefreshToken);

module.exports = router;

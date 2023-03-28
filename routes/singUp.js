const router = require("express").Router();

// CONTROLLER
const signUpController = require("../controllers/signUpController");

router.post("/", signUpController.signUp);

module.exports = router;

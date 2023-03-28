const router = require("express").Router();

// CONTROLLER
const signUpController = require("../controllers/signUpController");

// VALIDATION
const signUpValidation = require("../validations/singUpValidation");

router.post("/", signUpValidation, signUpController.signUp);

module.exports = router;

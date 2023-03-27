// INIT ROUTER
const router = require("express").Router();

// CONTROLLER
const signInController = require("../controllers/signInController");

// VALIDATION
const signInValidation = require("../validations/signInValidation");

router.post("/", signInValidation, signInController.signIn);

module.exports = router;

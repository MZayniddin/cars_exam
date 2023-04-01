const router = require("express").Router();

// CONTROLLER
const carsController = require("../../controllers/carsController");

// VALIDATION
const carValidation = require("../../validations/carValidation");

// ROLE VERIFIER MIDDLEWARE
const verifyRole = require("../../middlewares/verifyRole");
const ROLE_LIST = require("../../config/roles_list");

// CREATE CAR
router.post(
    "/create",
    verifyRole(ROLE_LIST.Admin),
    carValidation,
    carsController.createNewCar
);

module.exports = router;

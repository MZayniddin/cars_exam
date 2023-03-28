const router = require("express").Router();

// CONTROLLER
const carsController = require("../../controllers/carsController");

// CREATE CAR
router.post("/create", carsController.createNewCar);

module.exports = router;

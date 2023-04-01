const router = require("express").Router();

// CONTROLLER
const carsController = require("../../controllers/carsController");

// VALIDATION
const carValidation = require("../../validations/carValidation");

// ROLE VERIFIER MIDDLEWARE
const verifyRole = require("../../middlewares/verifyRole");
const ROLES_LIST = require("../../config/roles_list");

// BUY CAR
router.get("/buy/:carId", carsController.buyCar);

// GET CARS OF COMPANY
router.get("/company/:companyId", carsController.getCarsOfCompany);

// CREATE CAR
router.post(
    "/create",
    verifyRole(ROLES_LIST.Admin),
    carValidation,
    carsController.createNewCar
);

// GET CARS LIST
router.get("/list", carsController.getCarsList);

// GET ONE CAR
router.get("/:carId", carsController.getOneCar);

// UPDATE CAR
router.put(
    "/update/:carId",
    verifyRole(ROLES_LIST.Admin),
    carValidation,
    carsController.updateCar
);

// DELETE CAR
router.delete(
    "/destroy/:carId",
    verifyRole(ROLES_LIST.Admin),
    carsController.deleteCar
);

module.exports = router;

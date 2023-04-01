const router = require("express").Router();

// CONTROLLER
const userController = require("../../controllers/userController");

// ROLE VERIFIER MIDDLEWARE
const verifyRole = require("../../middlewares/verifyRole");
const ROLES_LIST = require("../../config/roles_list");

// VALIDATION
const signInValidation = require("../../validations/signInValidation");

// GET USER'S PURCHASED CARS
router.get(
    "/customer/:userId",
    verifyRole(ROLES_LIST.Owner),
    userController.getCustomer
);

// GET USER'S ACTIVITY
router.get(
    "/activity/:userId",
    verifyRole(ROLES_LIST.Owner),
    userController.getUserActivity
);

// GET USERS OF COMPANY
router.get(
    "/company/:companyId",
    verifyRole(ROLES_LIST.Owner),
    userController.getUsersOfCompany
);

// GET USERS LIST
router.get("/list", verifyRole(ROLES_LIST.Owner), userController.getUsersList);

// UPDATE USER PROFILE
router.post("/update", signInValidation, userController.updateProfile)

module.exports = router;

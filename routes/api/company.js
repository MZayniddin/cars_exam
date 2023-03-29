const router = require("express").Router();

// CONTROLLER
const companyController = require("../../controllers/companyController");

// ROLE VERIFIER MIDDLEWARE
const verifyRole = require("../../middlewares/verifyRole");
const ROLES_LIST = require("../../config/roles_list");

// VALIDATOR
const validateCompany = require("../../validations/companyValidation");

// CREATE COMPANY
router.post(
    "/create",
    verifyRole(ROLES_LIST.Admin),
    validateCompany,
    companyController.createNewCompany
);

// GET ALL COMPANY
router.get("/list", companyController.getAllCompany);

module.exports = router;

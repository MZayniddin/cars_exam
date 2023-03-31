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

// GET A COMPANY
router.get("/:companyId", companyController.getCompany);

// UPDATE COMPANY
router.put(
    "/update/:companyId",
    verifyRole(ROLES_LIST.Admin),
    validateCompany,
    companyController.updateCompany
);

// DELETE A COMPANY
router.delete(
    "/destroy/:companyId",
    verifyRole(ROLES_LIST.Admin),
    companyController.deleteCompany
);

module.exports = router;

const router = require("express").Router();

// CONTROLLER
const companyController = require("../../controllers/companyController");

// ROLE VERIFIER MIDDLEWARE
const verifyRole = require("../../middlewares/verifyRole");
const ROLES_LIST = require("../../config/roles_list");

// CREATE COMPANY
router.post(
    "/create",
    verifyRole(ROLES_LIST.Admin),
    companyController.createNewCompany
);

module.exports = router;

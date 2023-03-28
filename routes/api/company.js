const router = require("express").Router();

// CONTROLLER
const companyController = require("../../controllers/companyController");

// CREATE COMPANY
router.post("/create", companyController.createNewCompany);

module.exports = router;

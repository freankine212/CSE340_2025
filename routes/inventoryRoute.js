// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
//const invId = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build vehicle detail view
router.get("/detail/:invId", invController.buildByInvId);

router.use(utilities.handleError)

//route to build management view route
router.get("/", invController.buildManagement)

//route for adding classification form
router.get("/add-classification", invController.buildAddClassification)

// form submisstion handling
router.post("/add-classification", invValidate.classificationRules(), invValidate.checkClassificationData, invController.addClassification)

//add inventory view
router.get("/add-inventory", invController.buildAddInventory)

//process add inventory
//router.get("/add-inventory", invController.addInventory)


//add post route for inventory addition
router.post(
    "/add-inventory", validate.addInventoryRules(), validate.checkAddInventoryData, invController.addInventory
)

//route for add/edit/delete 
router.get("/add-classification", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddClassification))

router.post("/add-classification",
  utilities.checkAccountType,

)

module.exports = router;

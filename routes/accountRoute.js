//Needed resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")


//route to build the my account view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//route to build the registration view
router.get("/register", utilities.handleErrors(accountController.buildAccount))

//Even more registration route
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;
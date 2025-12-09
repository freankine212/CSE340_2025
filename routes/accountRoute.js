//Needed resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


//route to build the my account view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//route to build the registration view
router.get("/register", utilities.handleErrors(accountController.buildAccount))

//Even more registration route
//router.post('/register', utilities.handleErrors(accountController.registerAccount))

// process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// GET update view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
)

// POST account update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// POST password change
router.post(
  "/change-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
)

// Logout route
router.get("/logout", utilities.handleErrors(accountController.logout))

module.exports = router;
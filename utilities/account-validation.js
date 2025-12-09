const utilities = require("./index")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const accountModel = require("../models/account-model")

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      //.notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
            throw new Error("Email exists. Please log in or use a different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

//validating login rules
validate.loginRules = () =>{
  return[
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ]
}

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let nav = await utilities.getNav()
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email,
      message: null
    })
  }
  next()
}

// Update account validation rules
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),
    
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id
        const accountData = await accountModel.getAccountById(account_id)
        // Only check if email changed
        if (account_email !== accountData.account_email) {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists) {
            throw new Error("Email exists. Please use a different email.")
          }
        }
      })
  ]
}

validate.checkUpdateData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(req.body.account_id)
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      accountData,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
      message: null
    })
  }
  next()
}

// Password validation
validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements.")
  ]
}

validate.checkPasswordData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(req.body.account_id)
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      accountData,
      message: req.flash("notice")
    })
  }
  next()
}

module.exports = validate

const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name may not contain spaces or special characters."),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      message: null,
    })
    return
  }
  next()
}

module.exports = validate
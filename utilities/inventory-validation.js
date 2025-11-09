const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invModel = require("../models/inventory-model")

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
  const {classification_name} = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors: errors.array(),
      title: "Add Classification",
      nav,
      classification_name,
      message: null,
    })
    return
  }
  next()
}

/* ****************************************
 *  Add Inventory Validation Rules
 * *************************************** */
validate.addInventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a vehicle make."),
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a vehicle model."),
    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Please enter a valid year."),
    body("inv_description")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Please provide a vehicle description."),
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .isFloat({ min: 1 })
      .withMessage("Please enter a valid price."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Please enter a valid mileage."),
    body("inv_color")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid color."),
    body("classification_id")
      .isInt({ min: 1 })
      .withMessage("Please select a classification.")
  ]
}

/* ****************************************
 *  Check Add Inventory Data and Return Errors
 * *************************************** */
validate.checkAddInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(req.body.classification_id)

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body
    })
  }
  next()
}

module.exports = validate
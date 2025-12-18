const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Review Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Review must be at least 10 characters long.")
  ]
}

/* ******************************
 * Check review data and return errors
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { inv_id } = req.body
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    req.flash("notice", "Please provide a valid review (at least 10 characters).")
    return res.redirect(`/inv/detail/${inv_id}`)
  }
  next()
}

module.exports = validate
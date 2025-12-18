const utilities = require("../utilities")
const reviewModel = require("../models/review-model")

const reviewController = {}

/* ****************************************
 * Add Review (POST)
 * *************************************** */
reviewController.addReview = async function (req, res) {
  const { review_text, inv_id, account_id } = req.body
  
  const addResult = await reviewModel.addReview(review_text, inv_id, account_id)
  
  if (addResult) {
    req.flash("notice", "Review added successfully!")
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Sorry, adding the review failed.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ****************************************
 * Build Edit Review View
 * *************************************** */
reviewController.buildEditReview = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id)
  
  // Check if user owns this review
  if (reviewData.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You can only edit your own reviews.")
    return res.redirect("/account/")
  }
  
  res.render("reviews/edit-review", {
    title: "Edit Review",
    nav,
    errors: null,
    message: req.flash("notice"),
    reviewData
  })
}

/* ****************************************
 * Update Review (POST)
 * *************************************** */
reviewController.updateReview = async function (req, res) {
  const { review_text, review_id } = req.body
  
  const updateResult = await reviewModel.updateReview(review_text, review_id)
  
  if (updateResult) {
    req.flash("notice", "Review updated successfully!")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the review update failed.")
    const reviewData = await reviewModel.getReviewById(review_id)
    let nav = await utilities.getNav()
    res.render("reviews/edit-review", {
      title: "Edit Review",
      nav,
      errors: null,
      message: req.flash("notice"),
      reviewData
    })
  }
}

/* ****************************************
 * Build Delete Review View
 * *************************************** */
reviewController.buildDeleteReview = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id)
  
  // Check if user owns this review
  if (reviewData.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You can only delete your own reviews.")
    return res.redirect("/account/")
  }
  
  res.render("reviews/delete-review", {
    title: "Delete Review",
    nav,
    errors: null,
    message: req.flash("notice"),
    reviewData
  })
}

/* ****************************************
 * Delete Review (POST)
 * *************************************** */
reviewController.deleteReview = async function (req, res) {
  const { review_id } = req.body
  
  const deleteResult = await reviewModel.deleteReview(review_id)
  
  if (deleteResult) {
    req.flash("notice", "Review deleted successfully!")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the review deletion failed.")
    res.redirect("/account/")
  }
}

module.exports = reviewController
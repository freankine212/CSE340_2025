const pool = require("../database/")

/* *****************************
 * Add new review
 * *************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [review_text, inv_id, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
 * Get reviews by inventory ID (newest first)
 * *************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT r.review_id, r.review_text, r.review_date, r.inv_id, r.account_id,
             a.account_firstname, a.account_lastname
      FROM review r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByInvId error: " + error)
    return []
  }
}

/* *****************************
 * Get reviews by account ID
 * *************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `
      SELECT r.review_id, r.review_text, r.review_date, r.inv_id,
             i.inv_make, i.inv_model, i.inv_year
      FROM review r
      JOIN inventory i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByAccountId error: " + error)
    return []
  }
}

/* *****************************
 * Get single review by ID
 * *************************** */
async function getReviewById(review_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname, i.inv_make, i.inv_model, i.inv_year
      FROM review r
      JOIN account a ON r.account_id = a.account_id
      JOIN inventory i ON r.inv_id = i.inv_id
      WHERE r.review_id = $1
    `
    const result = await pool.query(sql, [review_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
 * Update review
 * *************************** */
async function updateReview(review_text, review_id) {
  try {
    const sql = "UPDATE review SET review_text = $1 WHERE review_id = $2 RETURNING *"
    const result = await pool.query(sql, [review_text, review_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
 * Delete review
 * *************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM review WHERE review_id = $1"
    const result = await pool.query(sql, [review_id])
    return result
  } catch (error) {
    return error.message
  }
}

module.exports = {addReview, getReviewsByInvId, getReviewsByAccountId, getReviewById, updateReview, deleteReview
}
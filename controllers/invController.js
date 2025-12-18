const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  
  // Check if data exists
  if (!data || data.length === 0) {
    return next({status: 404, message: "No vehicles found for this classification."})
  }
  
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next){
  try{
    const inv_id = req.params.invId
    const data = await invModel.getVehicleById(inv_id)
    const vehicle = data[0]

    if(!vehicle){
      return next({status:404, message: "vehicle not found, please check inventory again"})
    }
    
    const detailHTML = await utilities.buildVehicleDetail(vehicle)
    const nav = await utilities.getNav()
    const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`

    // GET REVIEWS FOR THIS VEHICLE
    const reviewModel = require("../models/review-model")
    const reviews = await reviewModel.getReviewsByInvId(inv_id)

    res.render("./inventory/detail", {
      title,
      nav,
      detail: detailHTML,
      inv_id,           
      reviews,          
      errors: null,    
      message: req.flash("notice")  
    })
  } catch (error){
    console.error("Error building vehicle detail view", error)
    next(error)
  }
}

/* ***************************
 *  Deliver management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message: req.flash("notice"),
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Deliver Add Classification View
* *************************************** */
invCont.buildAddClassification = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("inventory/add-classification",{
    title: "Add Classification",
    nav,
    message: null,
    errors: null,
  })
}
/* ****************************************
*  Process Add Classification
* *************************************** */
invCont.addClassification = async function(req, res, next){
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", `Classification "${classification_name}" added successfully.`)
    res.redirect("/inv/")
  } else {
    //req.flash("notice", "Sorry, adding the classification failed.")
    const message = "Sorry, adding the classification failed"
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: message,
      errors: null,
      classification_name
    })
  }
}

/* ****************************************
 *  Deliver Add Inventory View
 * *************************************** */
invCont.buildAddInventory = async (req, res, next) =>{
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    message: req.flash("notice"),
    errors: null,
  })
}

/* ****************************************
 *  Process Add Inventory
 * *************************************** */
invCont.addInventory = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    let {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body


    //convert string values to numbers
    inv_year = parseInt(inv_year)
    inv_price = parseFloat(inv_price)
    inv_miles = parseInt(inv_miles)
    classification_id = parseInt(classification_id)


    // Insert into your PG4 Admin database
    const result = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )

    if (result) {
      req.flash("notice", `The ${inv_year} ${inv_make} ${inv_model} was successfully added.`)
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, adding the vehicle failed. Please check your input and try again.")
      const classificationList = await utilities.buildClassificationList(classification_id)
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        message: req.flash("notice"),
        errors: null,
      })
    }
  } catch (error) {
    console.error("Error adding inventory:", error)
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    req.flash("notice", "There was an error processing your request. Please try again later.")
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      message: req.flash("notice"),
      errors: null,
    })
  }
}
module.exports = invCont
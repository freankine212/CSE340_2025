const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
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
  //console.log("car buildByInvId triggered for ID:", req.params.invId)
  try{
    const inv_id = req.params.invId
    const data = await invModel.getVehicleById(inv_id)
    const vehicle = data [0]

    if(!vehicle){
      // If no vehicle found, trigger that darn 404 message
      return next ({status:404, message: "vehicle not found, please check inventory again"})
    }
    const detailHTML = await utilities.buildVehicleDetail(vehicle)
    const nav = await utilities.getNav()
    const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`

    res.render("./inventory/detail", {
      title,
      nav,
      detail: detailHTML
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
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("notice"),
      errors: null,
    })
  }
}

module.exports = invCont
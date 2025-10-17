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

module.exports = invCont
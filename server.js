/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")
const session = require("express-session")
const pool = require('./database/')
const accountController = require("./controllers/accountController")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")


/* *************
 * Middleware
************* */
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId'
}))

// express messages middleware
app.use(require('connect-flash')())
app.use(function(req, res,next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes
 *************************/

//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", inventoryRoute)


//account Route
app.use("/account", require("./routes/accountRoute"))

app.use(static)


// Intentional 500 error route for testing
app.use("/error", (req, res, next) => {
  // Create an error object and pass it to the next() function
  next(new Error("This is a test 500 error"))
})

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Oh no... what did you do? They are coming for us now. Quick, use the link below to get back home!'})
})


/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  // Default to 500 if no status provided
  const status = err.status || 500
  let message

  if (status === 404) {
    message = err.message || 'Page not found.'
  } else if (status === 500) {
    message = err.message || 'Oh no! There was a crash. Maybe try a different route? :)'
  } else {
    message = 'Something went wrong!'
  }

  res.status(status).render("errors/error", {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    status,
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

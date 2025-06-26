const express = require("express")
const _ = express.Router()
const authRouter = require("./authRoutes.js")
const parcelRoutes = require("./parcelRoutes.js")


_.use("/auth",authRouter )
_.use("/parcels",parcelRoutes )


module.exports = _
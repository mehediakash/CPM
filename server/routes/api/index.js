const express = require("express")
const _ = express.Router()
const authRouter = require("./authRoutes.js")
const parcelRoutes = require("./parcelRoutes.js")
const adminRoutes = require("./adminRoutes.js")


_.use("/auth",authRouter )
_.use("/parcels",parcelRoutes )
_.use("/users",adminRoutes )


module.exports = _
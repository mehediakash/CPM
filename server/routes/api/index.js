const express = require("express")
const _ = express.Router()
const authRouter = require("./authRoutes.js")
const parcelRoutes = require("./parcelRoutes.js")
const adminRoutes = require("./adminRoutes.js")
const analyticsRoutes = require("./analyticsRouter.js")



_.use("/auth",authRouter )
_.use("/parcels",parcelRoutes )
_.use("/users",adminRoutes )
_.use("/analytics",analyticsRoutes )


module.exports = _
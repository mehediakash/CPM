const express = require("express");
const auth = require("../../middleware/auth");
const checkRole = require("../../middleware/role");
const { getMetrics } = require("../../controllers/analyticsController");

const _ = express.Router();
_.get("/metrics", auth, checkRole(["admin"]), getMetrics);
module.exports = _;

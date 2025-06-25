const express = require("express");
const _ = express.Router();
const auth = require("../../middleware/auth");
const checkRole = require("../../middleware/role");
const {
  getAnalytics,
  exportCSV,
  exportPDF,
} = require("../../controllers/analyticsController");

_.get("/analytics", auth, checkRole(["admin"]), getAnalytics);
_.get("/export/csv", auth, checkRole(["admin"]), exportCSV);
_.get("/export/pdf", auth, checkRole(["admin"]), exportPDF);


module.exports = _;

// routes/api/parcels.js
const express = require("express");
const _ = express.Router();

const {
  createParcel,
  getMyParcels,
  getAllParcels,
  assignAgent,
  getAssignedParcels,
  updateParcelStatus,
  getMetrics,
  exportCSV,
  exportPDF,
  getParcelById, // <- import this!
} = require("../../controllers/parcelController");

const auth = require("../../middleware/auth");
const checkRole = require("../../middleware/role");

// CUSTOMER
_.post("/", auth, checkRole(["customer"]), createParcel);
_.get("/my", auth, checkRole(["customer"]), getMyParcels);

// ADMIN
_.get("/", auth, checkRole(["admin"]), getAllParcels);
_.put("/assign/:parcelId", auth, checkRole(["admin"]), assignAgent);
_.get("/metrics", auth, checkRole(["admin"]), getMetrics);
_.get("/export/csv", auth, checkRole(["admin"]), exportCSV);
_.get("/export/pdf", auth, checkRole(["admin"]), exportPDF);

// DELIVERY AGENT
_.put("/status/:parcelId", auth, checkRole(["agent"]), updateParcelStatus);
_.get("/assigned", auth, checkRole(["agent"]), getAssignedParcels);

// 🔥 Put this last so it doesn't conflict
_.get("/:id", auth, getParcelById);

module.exports = _;

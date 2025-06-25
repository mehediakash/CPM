const express = require("express");
const _ = express.Router();

const {
  createParcel,
  getMyParcels,
  getAllParcels,
  assignAgent,
  getAssignedParcels,
  updateParcelStatus,
} = require("../../controllers/parcelController");

const auth = require("../../middleware/auth");
const checkRole = require("../../middleware/role");

// CUSTOMER
_.post("/", auth, checkRole(["customer"]), createParcel);
_.get("/my", auth, checkRole(["customer"]), getMyParcels);


// ADMIN
_.get("/", auth, checkRole(["admin"]), getAllParcels);
_.put("/assign/:parcelId", auth, checkRole(["admin"]), assignAgent);

// DELIVERY AGENT
_.put("/status/:parcelId", auth, checkRole(["agent"]), updateParcelStatus);
_.get("/assigned", auth, checkRole(["agent"]), getAssignedParcels);
module.exports = _;

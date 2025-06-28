const express = require("express");
const _ = express.Router();

const {
  createParcel,
  getMyParcels,
  getAllParcels,
  assignAgent,
  getAssignedParcels,
  updateParcelStatus,
  getParcelById, 
} = require("../../controllers/parcelController");

const auth = require("../../middleware/auth");
const checkRole = require("../../middleware/role");


_.post("/", auth, checkRole(["customer"]), createParcel);
_.get("/my", auth, checkRole(["customer"]), getMyParcels);


_.get("/", auth, checkRole(["admin"]), getAllParcels);
_.put("/assign/:parcelId", auth, checkRole(["admin"]), assignAgent);



_.put("/status/:parcelId", auth, checkRole(["agent"]), updateParcelStatus);
_.get("/assigned", auth, checkRole(["agent"]), getAssignedParcels);

_.get("/:id", auth, getParcelById);

module.exports = _;

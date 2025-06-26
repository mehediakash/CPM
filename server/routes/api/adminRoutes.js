const express = require("express");
const auth = require("../../middleware/auth");
const checkRole = require("../../middleware/role");
const { getAllUsers } = require("../../controllers/adminController");

const _ = express.Router();
_.get("/", auth, checkRole(["admin"]), getAllUsers);
module.exports = _;

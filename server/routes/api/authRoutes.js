const express = require("express");
const { register, login } = require("../../controllers/authController");

const _ = express.Router();

_.post("/register", register);
_.post("/login", login);

module.exports = _;

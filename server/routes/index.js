const express = require("express")
const _ = express.Router() 
const baseUrl = process.env.BASEURL

const api = require("./api/index.js")
console.log(baseUrl)

_.use(baseUrl,api)

module.exports = _
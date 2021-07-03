const express = require('express')
const websiteRouter = express.Router()
const Cache = require("../Cache/Index")

const BannerController = require("../Controllers/Website/Banner")
const CategoryController = require("../Controllers/Website/Category")

// ------ Banner -------
websiteRouter.get("/banner", Cache.Banners, BannerController.Index)

// ------ Category -------
websiteRouter.get("/category", CategoryController.Index)


module.exports = { websiteRouter }

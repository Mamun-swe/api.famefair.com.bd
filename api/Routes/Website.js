const express = require('express')
const websiteRouter = express.Router()
const Cache = require("../Cache/Index")

const BannerController = require("../Controllers/Website/Banner")

websiteRouter.get("/banner", Cache.Banners, BannerController.Index)


module.exports = { websiteRouter }

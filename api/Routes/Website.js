const express = require('express')
const websiteRouter = express.Router()
const Cache = require("../Cache/Index")

const BannerController = require("../Controllers/Website/Banner")
const CategoryController = require("../Controllers/Website/Category")
const ProductController = require("../Controllers/Website/Product")
const SearchController = require("../Controllers/Website/Search")

// ------ Banner -------
websiteRouter.get("/banner", Cache.Banners, BannerController.Index)

// ------ Category -------
websiteRouter.get("/category", CategoryController.Index)
websiteRouter.get("/category/:slug", Cache.Category, CategoryController.Show)
websiteRouter.get("/category/products/:category", CategoryController.Products)

// ------ Product -------
websiteRouter.get("/product/:slug", Cache.Product, ProductController.Show)

// ------ Search -------
websiteRouter.get("/search/suggestion/:query", SearchController.Suggestion)
websiteRouter.get("/search/results/:query", SearchController.Results)

module.exports = { websiteRouter }

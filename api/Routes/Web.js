const express = require('express')
const webRouter = express.Router()
const Cache = require("../Cache/Index")

const BannerController = require("../Controllers/Web/Banner")
const CategoryController = require("../Controllers/Web/Category")
const ProductController = require("../Controllers/Web/Product")
const SearchController = require("../Controllers/Web/Search")

// ------ Banner -------
webRouter.get("/banner", Cache.Banners, BannerController.Index)

// ------ Category -------
webRouter.get("/category", CategoryController.Index)
webRouter.get("/category/:slug", Cache.Category, CategoryController.Show)
webRouter.get("/category/products/:category", CategoryController.Products)

// ------ Product -------
webRouter.get("/product/:slug", Cache.Product, ProductController.Show)

// ------ Search -------
webRouter.get("/search/suggestion/:query", SearchController.Suggestion)
webRouter.get("/search/results/:query", SearchController.Results)

module.exports = { webRouter }

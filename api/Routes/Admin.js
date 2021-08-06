const express = require('express')
const adminRouter = express.Router()
const AdminController = require("../Controllers/Admin/Admin")
const DashboardController = require("../Controllers/Admin/Dashboard")
const OptionController = require("../Controllers/Admin/Option")
const CategoryController = require("../Controllers/Admin/Category")
const BannerController = require("../Controllers/Admin/Banner")
const BrandController = require("../Controllers/Admin/Brand")
const VendorController = require("../Controllers/Admin/Vendor")
const ProductController = require("../Controllers/Admin/Product")
const CustomerController = require("../Controllers/Admin/Customer")
const RatingReviewController = require("../Controllers/Admin/RatingReview")

// ----------- Admin Routes ------------
adminRouter.get("/admin", AdminController.Index)
adminRouter.get("/admin/:id", AdminController.Show)
adminRouter.post("/admin", AdminController.Create)
adminRouter.put("/admin/:id", AdminController.Update)

//  ---------- Dashboard Route -----------
adminRouter.get("/dashboard", DashboardController.Index)

//  ---------- Option Route -----------
adminRouter.get("/options", OptionController.Index)

//  ---------- Category Routes -----------
adminRouter.get("/category", CategoryController.Index)
adminRouter.post("/category", CategoryController.Store)
adminRouter.get("/category/:id", CategoryController.Show)
adminRouter.put("/category/:id", CategoryController.Update)

//  --------- Banner Routes -------------
adminRouter.get("/banner", BannerController.Index)
adminRouter.post("/banner", BannerController.Store)
adminRouter.delete("/banner/:id", BannerController.Delete)

//  --------- Brand Routes ------------
adminRouter.get("/brand", BrandController.Index)
adminRouter.post("/brand", BrandController.Store)
adminRouter.get("/brand/:id", BrandController.Show)
adminRouter.put("/brand/:id", BrandController.Update)
adminRouter.delete("/brand/:id", BrandController.Delete)
adminRouter.post("/brand/search", BrandController.Search)

//  --------- Vendor Routes ------------
adminRouter.get("/vendor", VendorController.Index)
adminRouter.post("/vendor", VendorController.Create)
adminRouter.get("/vendor/:id", VendorController.Show)
adminRouter.put("/vendor/:id", VendorController.Update)
adminRouter.post("/vendor/search", VendorController.Search)

//  --------- Product Routes ------------ 
adminRouter.get("/product", ProductController.Index)
adminRouter.post("/product", ProductController.Store)
adminRouter.get("/product/:id", ProductController.Show)
adminRouter.put("/product/:id", ProductController.Update)
adminRouter.get("/product/status/:id", ProductController.UpdateStatus)
adminRouter.put("/product/sm-image/:id", ProductController.UpdateSMImage)
adminRouter.put("/product/additional-image/:id", ProductController.AddAdditionalImage)
adminRouter.delete("/product/additional-image/:id/:file", ProductController.RemoveAdditionalImage)
adminRouter.post("/product/search", ProductController.Search)
adminRouter.get("/product/search/:sku", ProductController.SearchBySKU)

//  --------- Customer Routes ------------ 
adminRouter.get("/customer", CustomerController.Index)
adminRouter.get("/customer/:id", CustomerController.Show)
adminRouter.post("/customer", CustomerController.Store)
adminRouter.put("/customer/:id", CustomerController.Update)
adminRouter.post("/customer/search", CustomerController.Search)

//  --------- Rating & Review Routes ------------ 
adminRouter.get("/review", RatingReviewController.Index)
adminRouter.put("/review/:id", RatingReviewController.Update)


module.exports = { adminRouter }

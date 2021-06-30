const express = require('express')
const adminRouter = express.Router()
const CategoryController = require("../Controllers/Admin/Category")
const BannerController = require("../Controllers/Admin/Banner")
const BrandController = require("../Controllers/Admin/Brand")
const VendorController = require("../Controllers/Admin/Vendor")
const ProductController = require("../Controllers/Admin/Product")

//  ---------- Category Routes -----------
adminRouter.get("/category", CategoryController.Index)
adminRouter.get("/category/options", CategoryController.IndexAsOption)
adminRouter.post("/category", CategoryController.Store)
adminRouter.get("/category/:id", CategoryController.Show)
adminRouter.put("/category/:id", CategoryController.Update)
adminRouter.put("/category/:id/image", CategoryController.UpdateImage)

//  --------- Banner Routes -------------
adminRouter.get("/banner", BannerController.Index)
adminRouter.post("/banner", BannerController.Store)
adminRouter.delete("/banner/:id", BannerController.Delete)

//  --------- Brand Routes ------------
adminRouter.get("/brand", BrandController.Index)
adminRouter.get("/brand/options", BrandController.IndexAsOption)
adminRouter.post("/brand", BrandController.Store)
adminRouter.get("/brand/:id", BrandController.Show)
adminRouter.put("/brand/:id/name", BrandController.UpdateName)
adminRouter.put("/brand/:id/image", BrandController.UpdateImage)
adminRouter.delete("/brand/:id", BrandController.Delete)

//  --------- Vendor Routes ------------
adminRouter.get("/vendor", VendorController.Index)
adminRouter.get("/vendor/options", VendorController.IndexAsOption)
adminRouter.post("/vendor", VendorController.Create)

// Need fix in vendor show controller   ------------------------------------ ///////////////////
adminRouter.get("/vendor/:id", VendorController.Show)
adminRouter.put("/vendor/:id", VendorController.Update)
adminRouter.post("/vendor/search", VendorController.Search)

//  --------- Product Routes ------------ Working for product creation ------------------------------------------
adminRouter.get("/product", ProductController.Index)
adminRouter.post("/product", ProductController.Store)
adminRouter.get("/product/:id", ProductController.Show)


module.exports = { adminRouter }

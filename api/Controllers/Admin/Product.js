const Brand = require("../../../Models/Brand")
const Vendor = require("../../../Models/Vendor")
const Product = require("../../../Models/Product")
const Category = require("../../../Models/Category")
const Validator = require("../../Validator/Product")
const CheckId = require("../../Middleware/CheckId")
const { Paginate } = require("../../Helpers/Pagination")
const { Slug, Host, SmFileUpload, LgFileUpload } = require("../../Helpers/Index")

// Index of products
const Index = async (req, res, next) => {
    try {
        const limit = 30
        let { page } = req.query
        if (!parseInt(page)) page = 1
        if (page && parseInt(page) <= 0) page = 1

        const totalItems = await Product.countDocuments().exec()
        let results = await Product.find(
            { vendorRequest: 'Approved' },
            {
                name: 1,
                sku: 1,
                purchasePrice: 1,
                salePrice: 1,
                stockAmount: 1,
                isActive: 1,
                'images.small': 1
            }
        )
            .populate("brand", "name")
            .populate("vendor", "name")
            .populate("category", "name")
            .skip((parseInt(page) * limit) - limit)
            .limit(limit)
            .exec()


        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: "Product are not available"
            })
        }

        results = await results.map(product => {
            return {
                _id: product._id,
                name: product.name,
                sku: product.sku,
                purchasePrice: product.purchasePrice,
                salePrice: product.salePrice,
                stockAmount: product.stockAmount,
                isActive: product.isActive,
                brand: product.brand ? product.brand.name : null,
                vendor: product.vendor ? product.vendor.name : null,
                category: product.category ? product.category.name : null,
                thumbnail: Host(req) + "upload/product/small/" + product.images.small
            }
        })

        res.status(200).json({
            status: true,
            products: results,
            pagination: Paginate({ page, limit, totalItems })
        })

    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    Index
}
const Product = require("../../../Models/Product")
const Category = require("../../../Models/Category")
const { Host } = require("../../Helpers/Index")
const { PaginateQueryParams, Paginate } = require("../../Helpers/Pagination")
const { RedisClient } = require("../../Cache/Index")

// List of categories with product
const Index = async (req, res, next) => {
    try {
        let categories = []
        const { page } = req.query

        // Find categories where products available
        const results = await Category.find(
            { products: { $exists: true, $not: { $size: 0 } } },
            { name: 1, slug: 1 })
            .populate({
                path: "products",
                select: "name slug images.small",
                match: {
                    stockAmount: { $gt: 0 },
                    isActive: { $eq: true },
                    vendorRequest: { $eq: "Approved" }
                },
                options: {
                    perDocumentLimit: 14,
                    sort: { _id: -1 }
                }
            })
            .sort({ _id: -1 })
            .skip((parseInt(page) * 2) - 2)
            .limit(2)
            .exec()

        // Modify results
        if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
                let products = []
                const element = results[i]

                if (element && element.products && element.products.length) {
                    for (let j = 0; j < element.products.length; j++) {
                        const product = element.products[j]
                        products.push({
                            _id: product._id,
                            name: product.name,
                            slug: product.slug,
                            image: product.images.small ? Host(req) + "uploads/product/small/" + product.images.small : null
                        })
                    }
                }

                categories.push({
                    _id: element._id,
                    name: element.name,
                    slug: element.slug,
                    products
                })
            }
        }

        res.status(200).json({
            status: true,
            data: categories
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Show specific category
const Show = async (req, res, next) => {
    try {
        const { slug } = req.params

        let result = await Category.findOne(
            { slug: slug },
            { slug: 1, image: 1 })
            .exec()

        if (!result) {
            return res.status(404).json({
                status: false,
                message: "Category not available."
            })
        }

        result.image = result.image ? Host(req) + "uploads/category/" + result.image : null

        // set data to cache
        RedisClient.setex(slug, 3600, JSON.stringify(result))

        res.status(200).json({
            status: true,
            data: result
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Specific category products
const Products = async (req, res, next) => {
    try {
        let products = []
        const { category } = req.params
        const { page } = req.query

        // Find matched products
        const results = await Product.find(
            {
                $and: [
                    { category: category },
                    { isActive: true },
                    { vendorRequest: "Approved" },
                ]
            },
            {
                name: 1,
                slug: 1,
                "images.small": 1
            }
        )
            .sort({ _id: -1 })
            .skip((parseInt(page) * 28) - 28)
            .limit(28)
            .exec()


        // Modify results
        if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
                const element = results[i]
                products.push({
                    _id: element._id,
                    slug: element.slug,
                    name: element.name,
                    image: element.images.small ? Host(req) + "uploads/product/small/" + element.images.small : null
                })
            }
        }

        res.status(200).json({
            status: true,
            data: products
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index,
    Show,
    Products
}
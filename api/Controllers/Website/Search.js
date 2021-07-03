const Product = require("../../../Models/Product")
const { Host } = require("../../Helpers/Index")
const { Paginate } = require("../../Helpers/Pagination")

// Search suggestion
const Suggestion = async (req, res, next) => {
    try {
        const { query } = req.params

        // Text search in products
        let results = await Product.find({
            $and: [
                { $text: { $search: query } },
                { stockAmount: { $gt: 0 } },
                { isActive: { $eq: true } },
                { vendorRequest: { $eq: "Approved" } }
            ]
        },
            { slug: 1, name: 1, "images.small": 1 }
        )
            .limit(5)
            .exec()

        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: 'Result not found.'
            })
        }

        // Modify results
        results = await results.map(item => {
            return {
                slug: item.slug,
                name: item.name,
                image: Host(req) + "uploads/product/small/" + item.images.small
            }
        })

        res.status(200).json({
            status: true,
            results
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Search Result
const Results = async (req, res, next) => {
    try {
        const { query } = req.params

        const limit = 30
        let { page } = req.query
        if (!parseInt(page)) page = 1
        if (page && parseInt(page) <= 0) page = 1

        // Count total documents in matches
        const totalItems = await Product.countDocuments(
            {
                $and: [
                    { $text: { $search: query } },
                    { stockAmount: { $gt: 0 } },
                    { isActive: { $eq: true } },
                    { vendorRequest: { $eq: "Approved" } }
                ]
            }
        ).exec()

        // Find products using text search
        let results = await Product.find(
            {
                $and: [
                    { $text: { $search: query } },
                    { stockAmount: { $gt: 0 } },
                    { isActive: { $eq: true } },
                    { vendorRequest: { $eq: "Approved" } }
                ]
            },
            {
                name: 1,
                slug: 1,
                "images.small": 1
            }
        )
            .sort({ _id: -1 })
            .skip((parseInt(page) * limit) - limit)
            .limit(limit)
            .exec()

        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: 'Result not found.'
            })
        }

        // Modify results
        results = await results.map(item => {
            return {
                _id: item._id,
                slug: item.slug,
                name: item.name,
                image: item.images.small ? Host(req) + "uploads/product/small/" + item.images.small : null
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
    Suggestion,
    Results
}
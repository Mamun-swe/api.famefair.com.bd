const Product = require("../../../Models/Product")
const { RedisClient } = require("../../Cache/Index")
const { Host } = require("../../Helpers/Index")

// Show specific product
const Show = async (req, res, next) => {
    try {
        const { slug } = req.params

        // Find product
        let result = await Product.findOne(
            {
                $and: [
                    { slug: slug },
                    { isActive: true },
                    { vendorRequest: "Approved" },
                    { stockAmount: { $gt: 0 } }
                ]
            },
            {
                isActive: 0,
                purchasePrice: 0,
                vendorRequest: 0,
                createdAt: 0,
                updatedAt: 0
            }
        )
            .populate("vendor", "name slug")
            .populate("brand", "name slug")
            .populate("category", "name slug")
            .exec()

        if (!result) {
            return res.status(404).json({
                status: false,
                message: "No product available."
            })
        }

        result.images.small = Host(req) + "uploads/product/small/" + result.images.small
        result.images.large = Host(req) + "uploads/product/large/" + result.images.large

        let additional = []
        if (result.images.additional && result.images.additional.length) {
            for (let i = 0; i < result.images.additional.length; i++) {
                const item = Host(req) + "uploads/product/additional/" + result.images.additional[i]
                additional.push(item)
            }
        }
        result.images.additional = additional

        // set data to cache
        RedisClient.setex(slug, 600, JSON.stringify(result))

        res.status(200).json({
            status: true,
            data: result
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Show
}
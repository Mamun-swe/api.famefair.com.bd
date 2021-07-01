const RatingReview = require("../../../Models/RatingReview")
const Validator = require("../../Validator/RatingReview")
const CheckId = require("../../Middleware/CheckId")
const { Host } = require("../../Helpers/Index")
const { Paginate } = require("../../Helpers/Pagination")

// List of ratings & reviews
const Index = async (req, res, next) => {
    try {
        const limit = 30
        let { page } = req.query
        if (!parseInt(page)) page = 1
        if (page && parseInt(page) <= 0) page = 1

        const totalItems = await RatingReview.countDocuments().exec()
        let results = await RatingReview.find({}, { updatedAt: 0 })
            .populate("customer", "name")
            .populate("product", "name slug images.small")
            .sort({ _id: -1 })
            .skip((parseInt(page) * limit) - limit)
            .limit(limit)
            .exec()

        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: 'No review found.'
            })
        }

        results = await results.map(result => {
            return {
                _id: result._id,
                rating: result.rating,
                review: result.review,
                status: result.status,
                type: result.type,
                createdAt: result.createdAt,
                customer: result.customer,
                product: {
                    name: result.product.name,
                    slug: result.product.slug,
                    thumbnail: Host(req) + "uploads/product/small/" + result.product.images.small
                }
            }
        })

        res.status(200).json({
            status: true,
            ratingReviews: results,
            pagination: Paginate({ page, limit, totalItems })
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Update status
const Update = async (req, res, next) => {
    try {
        const { id } = req.params
        const { status } = req.body
        await CheckId(id)

        // validate check
        const validate = await Validator.Update({ status })
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.errors
            })
        }

        const updateStatus = await RatingReview.findByIdAndUpdate(
            { _id: id },
            { $set: { status: status } }
        ).exec()

        if (!updateStatus) {
            return res.status(501).json({
                status: false,
                message: 'Failed to approve review, try again!'
            })
        }

        res.status(201).json({
            status: true,
            message: `Successfully ${status}.`
        })

    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index,
    Update
}
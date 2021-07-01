const { Schema, model } = require("mongoose")

const ratingReviewSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    rating: {
        type: Number,
        trim: true,
        required: true
    },
    review: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        trim: true,
        default: "Pending",
        enum: ["Pending", "Canceled", "Approved"]
    }
}, {
    timestamps: true
})


const RatingReview = model("RatingReview", ratingReviewSchema)
module.exports = RatingReview

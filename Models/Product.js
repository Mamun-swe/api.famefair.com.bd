const { Schema, model } = require("mongoose")

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 250
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        require: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        default: null
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    tags: [{
        type: String,
        required: true,
        trim: true
    }],
    sku: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    stockAmount: {
        type: Number,
        required: true,
        trim: true
    },
    purchasePrice: {
        type: Number,
        required: true,
        trim: true
    },
    salePrice: {
        type: Number,
        required: true,
        trim: true
    },
    additionalInfo: [{
        title: {
            type: String,
            trim: true,
            default: null
        },
        value: {
            type: String,
            trim: true,
            default: null
        }
    }],
    description: {
        type: String,
        trim: true,
        required: true
    },
    ratingReview: [{
        type: Schema.Types.ObjectId,
        ref: 'RatingReview',
        default: null
    }],
    video: {
        type: String,
        trim: true,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true,
        enum: [true, false]
    },
    vendorRequest: {
        type: String,
        default: "Approved",
        enum: ["Approved", "Pending"]
    },
    images: {
        small: {
            type: String,
            trim: true,
            required: true
        },
        large: {
            type: String,
            trim: true,
            required: true
        },
        additional: [
            {
                type: String,
                trim: true,
                required: true
            }
        ]
    },
}, {
    timestamps: true
})

productSchema.index({
    name: "text",
    tags: "text",
    sku: "text",
    description: "text"
})

const Product = model('Product', productSchema)
module.exports = Product;

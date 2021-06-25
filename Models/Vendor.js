const { Schema, model } = require("mongoose")

const validateEmail = function (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}

const vendorSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        default: null,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validateEmail, "Please provide a valid email address"],
    },
    phone: {
        type: String,
        trim: true,
        require: true
    },
    address: {
        type: String,
        trim: true,
        require: true
    },
    bank: {
        accountName: {
            type: String,
            trim: true,
            default: null
        },
        accountNumber: {
            type: String,
            trim: true,
            default: null
        },
        branchName: {
            type: String,
            trim: true,
            default: null
        },
        routingNumber: {
            type: String,
            trim: true,
            default: null
        }
    },
    tradeLicence: {
        type: String,
        trim: true,
        require: true
    },
    pickupLocation: {
        type: String,
        trim: true,
        require: true
    },
    paymentSystem: {
        type: String,
        trim: true,
        default: 'Cash',
        enum: ['Cash', 'Credit']
    },
    payPeriod: {
        type: String,
        trim: true,
        default: null,
        enum: [null, "10 Days", "15 Days", "20 Days", "30 Days"]
    },
    contactPersonOne: {
        name: {
            type: String,
            trim: true,
            require: true
        },
        phone: {
            type: String,
            trim: true,
            require: true
        },
        email: {
            type: String,
            trim: true,
            default: null
        }
    },
    contactPersonTwo: {
        name: {
            type: String,
            trim: true,
            require: true
        },
        phone: {
            type: String,
            trim: true,
            require: true
        },
        email: {
            type: String,
            trim: true,
            default: null
        }
    },
    keyAccountManager: {
        type: String,
        trim: true,
        require: true
    },
    secondaryKeyAccountManager: {
        type: String,
        trim: true,
        require: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    }],
    isActive: {
        type: Boolean,
        trim: true,
        default: true,
        enum: [true, false]
    },
    role: {
        type: String,
        trim: true,
        default: 'vendor',
        enum: ['vendor']
    },
    password: {
        type: String,
        trim: true,
        required: true
    }
}, {
    timestamps: true
})


const Vendor = model("Vendor", vendorSchema)
module.exports = Vendor

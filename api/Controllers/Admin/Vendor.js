const bcrypt = require("bcryptjs")
const Vendor = require("../../../Models/Vendor")
const CheckId = require("../../Middleware/CheckId")
const Validator = require("../../Validator/Vendor")
const { Paginate } = require("../../Helpers/Pagination")
const { Host, Slug } = require("../../Helpers/Index")

// List of vendors
const Index = async (req, res, next) => {
    try {
        const limit = 30
        let { page } = req.query
        if (!parseInt(page)) page = 1
        if (page && parseInt(page) <= 0) page = 1

        const totalItems = await Vendor.countDocuments().exec()
        const results = await Vendor.find({}, { name: 1, email: 1, phone: 1, address: 1 })
            .skip((parseInt(page) * limit) - limit)
            .limit(limit)
            .exec()

        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: 'Vendors not found.'
            })
        }

        res.status(200).json({
            status: true,
            vendors: results,
            pagination: Paginate({ page, limit, totalItems })
        })
    } catch (error) {
        if (error) next(error)
    }
}

// List of all vendor as options
const IndexAsOption = async (req, res, next) => {
    try {
        let vendors = []
        const results = await Vendor.find({}, { name: 1, address: 1 }).exec()

        if (!results) {
            return res.status(404).json({
                status: false,
                message: 'Vendor not found'
            })
        }

        for (let i = 0; i < results.length; i++) {
            const element = results[i]
            vendors.push({
                label: `${element.name} - ${element.address}`,
                value: element._id
            })
        }

        res.status(200).json({
            status: true,
            vendors
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Show specific vendor
const Show = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        let result = await Vendor.findById({ _id: id })
            .populate('products', '_id sku name thumbnail.small stockAmount purchasePrice salePrice')
            .exec()

        if (!result) {
            return res.status(404).json({
                status: false,
                message: 'Vendor not found.'
            })
        }

        const finalVendor = {
            _id: result._id,
            name: result.name,
            email: result.email,
            phone: result.phone,
            address: result.address,
            bank: {
                accountName: result.bank ? result.bank.accountName : null,
                accountNumber: result.bank ? result.bank.accountNumber : null,
                branchName: result.bank ? result.bank.branchName : null,
                routingNumber: result.bank ? result.bank.routingNumber : null
            },
            tradeLicence: result.tradeLicence,
            pickupLocation: result.pickupLocation,
            paymentSystem: result.paymentSystem,
            payPeriod: result.payPeriod,

            contactPersonOne: {
                name: result.contactPersonOne ? result.contactPersonOne.name : null,
                phone: result.contactPersonOne ? result.contactPersonOne.phone : null,
                email: result.contactPersonOne ? result.contactPersonOne.email : null
            },
            contactPersonTwo: {
                name: result.contactPersonTwo ? result.contactPersonTwo.name : null,
                phone: result.contactPersonTwo ? result.contactPersonTwo.phone : null,
                email: result.contactPersonTwo ? result.contactPersonTwo.email : null
            },
            keyAccountManager: result.keyAccountManager,
            secondaryKeyAccountManager: result.secondaryKeyAccountManager,
            products: result.products ? result.products.map(product => {
                return {
                    _id: product._id,
                    name: product.name,
                    sku: product.sku,
                    stockAmount: product.stockAmount,
                    purchasePrice: product.purchasePrice,
                    salePrice: product.salePrice,
                    image: Host(req) + "uploads/products/small/" + product.thumbnail.small
                }
            }) : null
        }

        res.status(200).json({
            status: true,
            vendor: finalVendor
        })

    } catch (error) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}

// Create vendor
const Create = async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            accountName,
            accountNumber,
            branchName,
            routingNumber,
            tradeLicence,
            pickupLocation,
            paymentSystem,
            personOneName,
            personOnePhone,
            personOneEmail,
            personTwoName,
            personTwoPhone,
            personTwoEmail,
            keyAccountManager,
            secondaryKeyAccountManager,
            payPeriod
        } = req.body

        // Validation
        const validate = await Validator.Create(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // Exist email
        const existEmail = await Vendor.findOne({ email: email }, { email: 1 })
        if (existEmail) {
            return res.status(409).json({
                status: false,
                message: 'E-mail already exist.'
            })
        }

        // Exist phone
        const existPhone = await Vendor.findOne({ phone: phone })
        if (existPhone) {
            return res.status(409).json({
                status: false,
                message: 'Phone number already exist.'
            })
        }

        // Password Hash
        const hashPassword = await bcrypt.hash('12345678', 10)

        const newVendor = new Vendor({
            name,
            slug: Slug(name),
            email,
            phone,
            address,
            bank: {
                accountName,
                accountNumber,
                branchName,
                routingNumber
            },
            tradeLicence,
            pickupLocation,
            paymentSystem,
            payPeriod,
            contactPersonOne: {
                name: personOneName,
                phone: personOnePhone,
                email: personOneEmail
            },
            contactPersonTwo: {
                name: personTwoName,
                phone: personTwoPhone,
                email: personTwoEmail
            },
            keyAccountManager,
            secondaryKeyAccountManager,
            password: hashPassword
        })

        // Save vendor
        const saveVendor = await newVendor.save()
        if (!saveVendor) {
            return res.status(501).json({
                status: false,
                message: 'Failed to create vendor'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully vendor created.'
        })

    } catch (error) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}

// Update vendor
const Update = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        const {
            name,
            email,
            phone,
            address,
            accountName,
            accountNumber,
            branchName,
            routingNumber,
            tradeLicence,
            pickupLocation,
            paymentSystem,
            personOneName,
            personOnePhone,
            personOneEmail,
            personTwoName,
            personTwoPhone,
            personTwoEmail,
            keyAccountManager,
            secondaryKeyAccountManager,
            payPeriod
        } = req.body

        // Validation
        const validate = await Validator.Create(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // find vendor
        const findVendor = await Vendor.findById({ _id: id }).exec()
        if (!findVendor) {
            return res.status(404).json({
                status: false,
                message: 'Vendor not found.'
            })
        }

        // Update vendor
        const updateVendor = await Vendor.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    name,
                    address,
                    email,
                    phone,
                    bank: {
                        accountName,
                        accountNumber,
                        branchName,
                        routingNumber
                    },
                    tradeLicence,
                    pickupLocation,
                    paymentSystem,
                    payPeriod,
                    contactPersonOne: {
                        name: personOneName,
                        phone: personOnePhone,
                        email: personOneEmail
                    },
                    contactPersonTwo: {
                        name: personTwoName,
                        phone: personTwoPhone,
                        email: personTwoEmail
                    },
                    keyAccountManager,
                    secondaryKeyAccountManager
                }
            }
        ).exec()

        if (!updateVendor) {
            return res.status(501).json({
                status: false,
                message: 'Failed to update vendor.'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully vendor updated.'
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Search
const Search = async (req, res, next) => {
    try {
        const { query } = req.body

        if (!query) {
            return res.status(422).json({
                status: false,
                query: 'Query is required'
            })
        }

        let queryValue = new RegExp(query, 'i')
        let results = await Vendor.find(
            { $or: [{ name: queryValue }, { email: queryValue }, { phone: queryValue }, { address: queryValue }] },
            { name: 1, email: 1, phone: 1, address: 1 }
        )
            .sort({ _id: 1 })
            .exec()

        if (!results.length) {
            return res.status(501).json({
                status: false,
                message: 'Vendor not found.'
            })
        }

        res.status(200).json({
            status: true,
            vendors: results
        })

    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    Index,
    IndexAsOption,
    Show,
    Create,
    Update,
    Search
}

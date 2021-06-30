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
            .sort({ _id: -1 })
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
                thumbnail: Host(req) + "uploads/product/small/" + product.images.small
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

// Store a product
const Store = async (req, res, next) => {
    try {
        let uploadedAdditional = []

        const {
            name,
            vendor,
            brand,
            category,
            tags,
            sku,
            stockAmount,
            purchasePrice,
            salePrice,
            additionalInfo,
            description,
            video
        } = req.body

        const reqObj = {
            ...req.body,
            image: req.files && req.files.image ? req.files.image : null,
            images: req.files && req.files.images ? req.files.images : null
        }

        // validate check
        const validate = await Validator.Store(reqObj)
        if (!validate.isValid) return res.status(422).json(validate.errors)

        const image = req.files.image
        const images = req.files.images

        // Find with SKU
        const existSKU = await Product.findOne({ sku: sku }).exec()
        if (existSKU) {
            return res.status(422).json({
                status: false,
                message: 'This SKU already exist'
            })
        }

        // Upload small & large thumbnail
        const uploadSmallThumb = await SmFileUpload(image, 'uploads/product/small')
        const uploadLargeThumb = await LgFileUpload(image, 'uploads/product/large')

        // Upload multiple thumbnail
        if (images && images.length) {
            for (let i = 0; i < images.length; i++) {
                const fileName = await LgFileUpload(images[i], 'uploads/product/additional')
                uploadedAdditional.push(fileName)
            }
        }

        const newProduct = new Product({
            name,
            vendor,
            brand,
            category,
            tags,
            sku,
            stockAmount,
            purchasePrice,
            salePrice,
            additionalInfo,
            description,
            video,
            slug: Slug(name),
            images: {
                small: uploadSmallThumb,
                large: uploadLargeThumb,
                additional: [...uploadedAdditional]
            }
        })

        if (uploadSmallThumb && uploadLargeThumb) {

            // Add to vendor
            await Vendor.findOneAndUpdate(
                { _id: vendor },
                { $push: { products: newProduct._id } },
                { new: true }
            ).exec()

            // Add to brand
            if (brand) {
                await Brand.findOneAndUpdate(
                    { _id: brand },
                    { $push: { products: newProduct._id } },
                    { new: true }
                ).exec()
            }

            // Add to category
            await Category.findOneAndUpdate(
                { _id: category },
                { $push: { products: newProduct._id } },
                { new: true }
            ).exec()

            // Store product
            const storeProduct = await newProduct.save()

            if (storeProduct) {
                return res.status(201).json({
                    status: true,
                    message: "Successfully product stored"
                })
            }
        }
    } catch (error) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}

// Show specific product
const Show = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        let product = await Product.findById({ _id: id })
            .populate('vendor', 'name email phone address')
            .populate('brand', 'name slug')
            .populate('category', 'name slug')

        if (!product) {
            return res.status(404).json({
                status: false,
                message: 'Product not found'
            })
        }

        product.images.small = Host(req) + "uploads/product/small/" + product.images.small
        product.images.large = Host(req) + "uploads/product/large/" + product.images.large

        let additionalImages = []
        if (product.images.additional && product.images.additional.length) {
            for (let i = 0; i < product.images.additional.length; i++) {
                const item = Host(req) + "uploads/product/additional/" + product.images.additional[i]
                additionalImages.push(item)
            }
        }
        product.images.additional = additionalImages

        res.status(200).json({
            status: true,
            product
        })

    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index,
    Store,
    Show
}
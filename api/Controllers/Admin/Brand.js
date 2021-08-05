const Brand = require("../../../Models/Brand")
const Validator = require("../../Validator/Brand")
const CheckId = require("../../Middleware/CheckId")
const { PaginateQueryParams, Paginate } = require("../../Helpers/Pagination")
const { Slug, Host, DeleteFile, FileUpload } = require("../../Helpers/Index")

// List of brands
const Index = async (req, res, next) => {
    try {
        const { limit, page } = PaginateQueryParams(req.query)

        const totalItems = await Brand.countDocuments().exec()
        let results = await Brand.find({}, { name: 1, image: 1, products: 1 })
            .sort({ _id: -1 })
            .skip((parseInt(page) * limit) - limit)
            .limit(limit)
            .exec()

        if (results && results.length) {
            results = await results.map(brand => {
                return {
                    _id: brand._id,
                    name: brand.name,
                    products: brand.products.length,
                    image: brand.image ? Host(req) + "uploads/brand/" + brand.image : null
                }
            })
        }

        res.status(200).json({
            status: true,
            data: results,
            pagination: Paginate({ page, limit, totalItems })
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Create new brand
const Store = async (req, res, next) => {
    try {
        const { name } = req.body
        const file = req.files

        // validate check
        const validate = await Validator.Store({ name, file })
        if (!validate.isValid) return res.status(422).json(validate.errors)

        let brand = await Brand.findOne({ name }, { name: 1 }).exec()
        if (brand) {
            return res.status(409).json({
                status: false,
                message: 'This brand already exist'
            })
        }

        // Upload file
        const uploadFile = await FileUpload(file.image, './uploads/brand/')
        if (!uploadFile) {
            return res.status(501).json({
                status: false,
                message: 'Failed to upload image, Internat server error'
            })
        }

        const newBrand = new Brand({
            name: name,
            image: uploadFile,
            slug: Slug(name)
        })

        const saveBrand = await newBrand.save()
        if (!saveBrand) {
            return res.status(501).json({
                status: false,
                message: 'Failed to create brand'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully brand cretaed'
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Fetch single brand
const Show = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        let brand = await Brand.findById({ _id: id }, { name: 1, image: 1 })
        if (!brand) {
            return res.status(204).json({
                status: false,
                message: 'Brand not found'
            })
        }

        brand.image = brand.image ? Host(req) + "uploads/brand/" + brand.image : null

        res.status(200).json({
            status: true,
            data: brand
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Update brand
const Update = async (req, res, next) => {
    try {
        let uploadFile
        const { id } = req.params
        const { name } = req.body
        await CheckId(id)

        // validate check
        const validate = await Validator.UpdateName({ name })
        if (!validate.isValid) return res.status(422).json(validate.errors)

        // Check available
        const brand = await Brand.findOne({ _id: id }).exec()
        if (!brand) {
            return res.status(404).json({
                status: false,
                message: 'Brand not found'
            })
        }

        // Check name exist
        let exist = await Brand.findOne({ $and: [{ _id: { $ne: id } }, { name: name }] })
        if (exist) {
            return res.status(409).json({
                status: false,
                message: 'This brand already exist'
            })
        }

        // if file available
        if (req.files && req.files.image) {

            // Delete old file
            await DeleteFile('./uploads/brand/', brand.image)

            // Upload new file
            uploadFile = await FileUpload(req.files.image, './uploads/brand/')
            if (!uploadFile) {
                return res.status(501).json({
                    status: false,
                    message: 'Failed to upload image, Internat server error'
                })
            }
        }

        // Update brand
        const updateBrand = await Brand.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    name: name,
                    image: req.files ? uploadFile : brand.image
                }
            },
            { new: true }).exec()

        if (!updateBrand) {
            return res.status(422).json({
                status: false,
                message: 'Failed to update'
            })
        }

        return res.status(201).json({
            status: true,
            message: "Successfully brand updated"
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Delete brand
const Delete = async (req, res, next) => {
    let { id } = req.params
    await CheckId(id)

    try {
        const findBrand = await Brand.findOne({ _id: id }, { image: 1 })
        if (!findBrand) {
            return res.status(404).json({
                status: false,
                message: 'Brand not found'
            })
        }

        // Delete old file
        await DeleteFile('./uploads/brand/', findBrand.image)

        // Delete brand form DB
        const result = await Brand.findOneAndDelete({ _id: id })
        if (!result) {
            return res.status(501).json({
                status: false,
                message: 'Failed to delete brand'
            })
        }

        res.status(200).json({
            status: true,
            message: 'Successfully brand deleted'
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Search brand
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
        let results = await Brand.find(
            { name: queryValue },
            { name: 1, image: 1, products: 1 }
        )
            .sort({ _id: -1 })
            .exec()

        if (results && results.length) {
            results = await results.map(brand => {
                return {
                    _id: brand._id,
                    name: brand.name,
                    products: brand.products.length,
                    image: brand.image ? Host(req) + "uploads/brand/" + brand.image : null
                }
            })
        }

        res.status(200).json({
            status: true,
            data: results
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index,
    Store,
    Show,
    Update,
    Delete,
    Search
}
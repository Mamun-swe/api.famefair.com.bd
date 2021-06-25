const Brand = require("../../../Models/Brand")
const Validator = require("../../Validator/Brand")
const CheckId = require("../../Middleware/CheckId")
const { Paginate } = require("../../Helpers/Pagination")
const { Slug, Host, DeleteFile, FileUpload } = require("../../Helpers/Index")

// List of brands
const Index = async (req, res, next) => {
    try {
        const limit = 30
        let { page } = req.query
        if (!parseInt(page)) page = 1
        if (page && parseInt(page) <= 0) page = 1

        const totalItems = await Brand.countDocuments().exec()
        let results = await Brand.find({}, { name: 1, image: 1, products: 1 })
            .skip((parseInt(page) * limit) - limit)
            .limit(limit)
            .exec()

        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: 'Brand not available'
            })
        }

        results = await results.map(brand => {
            return {
                _id: brand._id,
                name: brand.name,
                products: brand.products.length,
                image: brand.image ? Host(req) + "uploads/brand/" + brand.image : null
            }
        })

        res.status(200).json({
            status: true,
            brands: results,
            pagination: Paginate({ page, limit, totalItems })
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Index as options
const IndexAsOption = async (req, res, next) => {
    try {
        let options = []
        const results = await Brand.find({}, { name: 1 }).sort({ name: 1 }).exec()

        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: 'Brand not available'
            })
        }

        for (let i = 0; i < results.length; i++) {
            const element = results[i]
            options.push({
                label: element.name,
                value: element._id
            })
        }

        res.status(200).json({
            status: true,
            brands: options
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
            brand
        })

    } catch (error) {
        if (error) next(error)
    }
}


// Update brand name
const UpdateName = async (req, res, next) => {
    try {
        const { id } = req.params
        const { name } = req.body
        await CheckId(id)

        // validate check
        const validate = await Validator.UpdateName({ name })
        if (!validate.isValid) return res.status(422).json(validate.errors)

        const brand = await Brand.findOne({ _id: id }, { name: 1 }).exec()
        if (!brand) {
            return res.status(404).json({
                status: false,
                message: 'Brand not found'
            })
        }

        let exist = await Brand.findOne({ name })
        if (exist) {
            return res.status(409).json({
                status: false,
                message: 'This brand already exist'
            })
        }

        const updateBrand = await Brand.findOneAndUpdate(
            { _id: id },
            { $set: { name: name, slug: Slug(name) } },
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


// Update image
const UpdateImage = async (req, res, next) => {
    try {
        const { id } = req.params
        const file = req.files
        await CheckId(id)

        // validate check
        const validate = await Validator.UpdateImage({ file })
        if (!validate.isValid) return res.status(422).json(validate.errors)

        const brand = await Brand.findOne({ _id: id }).exec()
        if (!brand) {
            return res.status(404).json({
                status: false,
                message: 'Brand not found'
            })
        }

        // Delete old file
        await DeleteFile('./uploads/brand/', brand.image)

        // Upload new file
        const uploadFile = await FileUpload(file.image, './uploads/brand/')
        if (!uploadFile) {
            return res.status(501).json({
                status: false,
                message: 'Failed to upload image, Internat server error'
            })
        }

        const updateImage = await Brand.findByIdAndUpdate(
            { _id: id },
            { $set: { image: uploadFile } }
        ).exec()

        if (!updateImage) {
            return res.status(501).json({
                status: false,
                message: 'Failed to update image.'
            })
        }

        return res.status(201).json({
            status: true,
            message: 'Successfully image updated.'
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


module.exports = {
    Index,
    IndexAsOption,
    Store,
    Show,
    UpdateName,
    UpdateImage,
    Delete
}
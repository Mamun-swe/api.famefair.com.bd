const Category = require("../../../Models/Category")
const Validator = require("../../Validator/Category")
const CheckId = require("../../Middleware/CheckId")
const { Slug, Host, FileUpload, DeleteFile } = require("../../Helpers/Index")

// Index of categories
const Index = async (req, res, next) => {
    try {
        let results = await Category.find({}, { name: 1, image: 1, products: 1 }).sort({ _id: -1 }).exec()

        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: 'Category not available'
            })
        }

        // Modify category
        results = await results.map(item => {
            return {
                _id: item._id,
                name: item.name,
                products: item.products.length,
                image: item.image ? Host(req) + "uploads/category/" + item.image : null
            }
        })

        res.status(200).json({
            status: true,
            categories: results
        })

    } catch (error) {
        if (error) next(error)
    }
}


// Index as options
const IndexAsOption = async (req, res, next) => {
    try {
        let options = []
        const results = await Category.find({}, { name: 1 }).sort({ name: 1 }).exec()

        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: 'Category not available'
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
            categories: options
        })
    } catch (error) {
        if (error) next(error)
    }
}


// Store new category
const Store = async (req, res, next) => {
    try {
        const { name } = req.body
        const file = req.files

        // validate check
        const validate = await Validator.Store({ name, file })
        if (!validate.isValid) return res.status(422).json(validate.errors)

        let category = await Category.findOne({ name }).exec()
        if (category) {
            return res.status(409).json({
                status: false,
                message: 'This category already exist'
            })
        }

        const uploadFile = await FileUpload(file.image, './uploads/category/')
        const newCategory = new Category({
            name: name,
            slug: Slug(name),
            image: uploadFile
        })

        await newCategory.save()
        res.status(201).json({
            status: true,
            message: 'Successfully category cretaed'
        })

    } catch (error) {
        if (error) next(error)
    }
}


// Show a category
const Show = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        let item = await Category.findById({ _id: id }, { slug: 0, createdAt: 0, updatedAt: 0 })

        if (!item) {
            return res.status(204).json({
                status: false,
                message: 'Category not found'
            })
        }

        if (item.image) item.image = Host(req) + "uploads/category/" + item.image

        res.status(200).json({
            status: true,
            category: item
        })

    } catch (error) {
        if (error) next(error)
    }
}


// Update Category
const Update = async (req, res, next) => {
    try {
        const { id } = req.params
        const { name } = req.body
        await CheckId(id)

        const category = await Category.findOne({ name: name }).exec()
        if (category) {
            return res.status(404).json({
                status: false,
                message: 'This name already exist'
            })
        }

        const updateCategory = await Category.findOneAndUpdate(
            { _id: id },
            { $set: { name: name, slug: Slug(name) } },
            { new: true }).exec()

        if (!updateCategory) {
            return res.status(422).json({
                status: false,
                message: 'Failed to update'
            })
        }

        return res.status(201).json({
            status: false,
            message: 'Successfully category updated'
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
        const validate = await Validator.Image({ file })
        if (!validate.isValid) {
            return res.status(422).json(validate.errors)
        }

        const category = await Category.findById({ _id: id }, { products: 0 }).exec()
        if (!category) {
            return res.status(409).json({
                status: false,
                message: 'Category not found'
            })
        }

        if (category.image) await DeleteFile('./uploads/category/', category.image)

        const uploadFile = await FileUpload(file.image, './uploads/category/')
        if (uploadFile) {
            const updateImage = await Category.findByIdAndUpdate({ _id: id }, { $set: { image: uploadFile } }).exec()
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
        }

    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    Index,
    IndexAsOption,
    Store,
    Show,
    Update,
    UpdateImage
}
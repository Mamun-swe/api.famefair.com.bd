const Brand = require("../../../Models/Brand")
const Vendor = require("../../../Models/Vendor")
const Category = require("../../../Models/Category")

const Index = async (req, res, next) => {
    try {
        let brands = []
        let vendors = []
        let categories = []

        const brandResult = await Brand.find({}, { name: 1 }).sort({ name: 1 })
        const vendorResult = await Vendor.find({}, { name: 1, address: 1 }).sort({ name: 1 })
        const categoryResult = await Category.find({}, { name: 1 }).sort({ name: 1 })

        // Generate brand options
        if (brandResult && brandResult.length) {
            for (let i = 0; i < brandResult.length; i++) {
                const element = brandResult[i]
                brands.push({
                    value: element._id,
                    label: element.name
                })
            }
        }

        // Generate vendor options
        if (vendorResult && vendorResult.length) {
            for (let i = 0; i < vendorResult.length; i++) {
                const element = vendorResult[i]
                vendors.push({
                    value: element._id,
                    label: element.name + " - " + element.address
                })
            }
        }

        // Generate category options
        if (categoryResult && categoryResult.length) {
            for (let i = 0; i < categoryResult.length; i++) {
                const element = categoryResult[i]
                categories.push({
                    value: element._id,
                    label: element.name
                })
            }
        }


        res.status(200).json({
            status: true,
            brands,
            vendors,
            categories
        })
    } catch (error) {
        if (error) next(error)
    }
}


module.exports = { Index }
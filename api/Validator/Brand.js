
const Store = brand => {
    let errors = {}

    if (!brand.name) errors.name = "Name is required"
    if (!brand.file) errors.image = "Image/Logo is required"

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

const UpdateName = brand => {
    let errors = {}

    if (!brand.name) errors.name = "Name is required"

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

const UpdateImage = brand => {
    let errors = {}

    if (!brand.file) errors.image = "Image is required"

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

module.exports = {
    Store,
    UpdateName,
    UpdateImage
}

const Store = data => {
    let errors = {}

    if (!data.customer) errors.customer = "Customer ID is required"
    if (!data.product) errors.product = "Product is required"
    if (!data.rating) errors.rating = "Rating is required"
    if (!data.review) errors.review = "Review is required"

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}


const Update = data => {
    let errors = {}

    if (!data.status) errors.status = "Status is required"

    const match = ["Pending", "Canceled", "Approved"].find(item => item === data.status)
    if (data.status && !match) errors.status = `${data.status} is not valid`

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

module.exports = { Store, Update }
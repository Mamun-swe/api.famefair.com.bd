const validateEmail = function (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}

const Create = data => {
    let error = {}

    if (!data.name) error.name = "Name is required"
    if (data.name && data.name.length < 5) error.name = "Name must be greater than 5 character"

    if (data.email && !validateEmail(data.email)) error.email = "Address is not valid"

    if (!data.phone) error.phone = "Phone number is required"
    if (!data.address) error.address = "Address is required"
    if (!data.tradeLicence) error.tradeLicence = "Trade licence is required"
    if (!data.pickupLocation) error.pickupLocation = "Pick Up location is required"


    if (!data.paymentSystem) error.paymentSystem = "Payment system is required"
    if (!data.paymentSystem == 'Cash' || !data.paymentSystem == 'Credit') error.paymentSystem = "Payment system is not valid"
    if (data.paymentSystem === 'Credit' && !data.payPeriod) error.payPeriod = "Pay period is required"

    if (data.paymentSystem && data.paymentSystem === "Credit") {
        if (!data.payPeriod) {
            error.payPeriod = "Pay period is required."
        } else {
            const matchPeriod = ["10 Days", "15 Days", "20 Days", "30 Days"].find(item => item === data.payPeriod)
            if (!matchPeriod) error.payPeriod = `${data.payPeriod} is not valid`
        }
    }

    if (!data.personOneName) error.personOneName = "Contact person one name is required"
    if (!data.personOnePhone) error.personOnePhone = "Contact person one phone is required"
    if (!data.personTwoName) error.personTwoName = "Contact person two name is required"
    if (!data.personTwoPhone) error.personTwoPhone = "Contact person two phone is required"
    if (!data.keyAccountManager) error.keyAccountManager = "Key account manager is required"
    if (!data.secondaryKeyAccountManager) error.secondaryKeyAccountManager = "Secondary key account manager is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = { Create }

const Login = user => {
    let error = {}

    if (!user.email) error.email = "Email is required"
    if (!user.password) error.password = "Password is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}


const Create = user => {
    let error = {}

    if (!user.name) error.name = "Name is required"
    if (user.name && user.name.length < 5) error.name = "Name must be greater than 5 character"
    if (!user.email) error.email = "Email is required"
    if (!user.phone) error.phone = "Phone Number is Required"
    if (!user.presentAddress) error.presentAddress = "Present address is required"
    if (!user.permanentAddress) error.permanentAddress = "Permanent address is required"

    if (!user.role) error.role = "Role is required"
    const rolesType = ['Super admin', 'Admin', 'Manager', 'Accountent', 'Content Officer'].find(item => item === user.role)
    if (user.role && !rolesType) error.role = `${user.role} is not valid`

    if (!user.password) error.password = "Password is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

const Update = user => {
    let error = {}

    if (!user.name) error.name = "Name is required"
    if (user.name && user.name.length < 5) error.name = "Name must be greater than 5 character"
    if (!user.presentAddress) error.presentAddress = "Present address is required"
    if (!user.permanentAddress) error.permanentAddress = "Permanent address is required"

    if (!user.role) error.role = "Role is required"
    const rolesType = ['Super admin', 'Admin', 'Manager', 'Accountent', 'Content Officer'].find(item => item === user.role)
    if (user.role && !rolesType) error.role = `${user.role} is not valid`

    if (!user.accountStatus) error.accountStatus = "Account status is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}


module.exports = {
    Login,
    Create,
    Update
}
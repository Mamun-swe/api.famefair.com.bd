const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Admin = require("../../../Models/Admin")
const Validator = require('../../Validator/Admin')

// Login to account
const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // validate check
        const validate = await Validator.Login({ email, password })
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // Account find using email 
        const account = await Admin.findOne({ email: email }).exec()
        if (!account) {
            return res.status(404).json({
                status: false,
                message: 'Invalid e-mail or password'
            })
        }

        // Check blocked
        if (account.accountStatus === 'Deactive') {
            return res.status(422).json({
                status: false,
                message: 'Your account has been blocked from authority.'
            })
        }

        // Compare with password
        const result = await bcrypt.compare(password, account.password)
        if (!result) {
            return res.status(404).json({
                status: false,
                message: 'Invalid e-mail or password'
            })
        }

        // Generate JWT token
        const token = await jwt.sign(
            {
                id: account._id,
                role: account.role
            }, process.env.JWT_SECRET, { expiresIn: '1d' }
        )

        return res.status(200).json({
            status: true,
            token
        })

    } catch (error) {
        if (error) next(error)
    }
}

// List of all Admin
const Index = async (req, res, next) => {
    try {
        const admins = await Admin.find(
            { _id: { $ne: req.user.id } },
            { name: 1, email: 1, phone: 1, role: 1, status: 1, accountStatus: 1 }
        )

        if (!admins.length) {
            return res.status(404).json({
                status: false,
                message: 'Admin not found.'
            })
        }

        res.status(200).json({
            status: true,
            admins
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Show specific admin
const Show = async (req, res, next) => {
    try {
        const { id } = req.params

        const admin = await Admin.findById(
            { _id: id },
            { password: 0, status: 0, createdAt: 0, updatedAt: 0 }
        )

        if (!admin) {
            return res.status(404).json({
                status: false,
                message: 'Admin not found.'
            })
        }

        res.status(200).json({
            status: true,
            admin
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Create account
const Create = async (req, res, next) => {
    try {
        const { name, email, phone, presentAddress, permanentAddress, role, password } = req.body

        // validate check
        const validate = await Validator.Create(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // Check email
        const existEmail = await Admin.findOne({ email: email })
        if (existEmail)
            return res.status(422).json({
                status: false,
                message: 'Email already used.'
            })

        // Check phone
        const existPhone = await Admin.findOne({ phone: phone })
        if (existPhone)
            return res.status(422).json({
                status: false,
                message: 'Phone already used.'
            })

        // Password Hash
        const hashPassword = await bcrypt.hash(password, 10)

        const newAdmin = new Admin({
            name,
            email,
            phone,
            address: { presentAddress, permanentAddress },
            role: role,
            password: hashPassword
        })

        const saveAdmin = await newAdmin.save()
        if (!saveAdmin)
            return res.status(501).json({
                status: false,
                message: 'Failed to create admin.'
            })

        res.status(201).json({
            status: true,
            message: 'Successfully admin created.'
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Update account
const Update = async (req, res, next) => {
    try {
        const { id } = req.params
        const { name, presentAddress, permanentAddress, role, accountStatus } = req.body

        // validate check
        const validate = await Validator.Update(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        const findAdmin = await Admin.findById({ _id: id })

        if (!findAdmin) {
            return res.status(404).json({
                status: false,
                message: 'Admin not found.'
            })
        }

        const updateAdmin = await Admin.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    name,
                    "address.presentAddress": presentAddress,
                    "address.permanentAddress": permanentAddress,
                    role,
                    accountStatus
                }
            }
        )

        if (!updateAdmin) {
            return res.status(501).json({
                status: false,
                message: 'Failed to update profile.'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully account updated.'
        })

    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Login,
    Index,
    Show,
    Create,
    Update
}
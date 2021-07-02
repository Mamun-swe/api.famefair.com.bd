const express = require('express')
const authRouter = express.Router()
const AdminAuth = require("../Controllers/Admin/Auth")

authRouter.post("/admin/login", AdminAuth.Login)

module.exports = { authRouter }

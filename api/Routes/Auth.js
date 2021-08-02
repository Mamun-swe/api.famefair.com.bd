const express = require('express')
const authRouter = express.Router()
const AdminAuth = require("../Controllers/Auth/Admin")

authRouter.post("/admin/login", AdminAuth.Login)
authRouter.post("/admin/reset", AdminAuth.Reset)

module.exports = { authRouter }

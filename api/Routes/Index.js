const express = require('express')
const router = express.Router()
const { SuperAdmin } = require("../Middleware/Permission")

const { authRouter } = require("./Auth")
const { adminRouter } = require("./Admin")
const { customerRouter } = require("./Customer")
const { websiteRouter } = require("./Website")

router.use("/auth", authRouter)
router.use("/admin", SuperAdmin, adminRouter)
router.use("/customer", customerRouter)
router.use("/website", websiteRouter)

module.exports = router
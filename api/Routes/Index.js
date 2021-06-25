const express = require('express')
const router = express.Router()

const { adminRouter } = require("./Admin")
const { customerRouter } = require("./Customer")
const { websiteRouter } = require("./Website")

router.use("/admin", adminRouter)
router.use("/customer", customerRouter)
router.use("/website", websiteRouter)

module.exports = router
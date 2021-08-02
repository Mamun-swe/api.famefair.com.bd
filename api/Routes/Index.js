const express = require('express')
const router = express.Router()

const { webRouter } = require("./Web")
const { authRouter } = require("./Auth")
const { adminRouter } = require("./Admin")
const { customerRouter } = require("./Customer")
const { aclRouter } = require("./ACL")

router.use("/web", webRouter)
router.use("/auth", authRouter)

router.use("/admin", adminRouter)
router.use("/customer", customerRouter)

router.use("/acl", aclRouter)

module.exports = router
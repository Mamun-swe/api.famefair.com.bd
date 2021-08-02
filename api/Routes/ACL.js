const express = require("express")
const aclRouter = express.Router()
const Routes = require("../Controllers/ACL/Routes")
const Role = require("../Controllers/ACL/Role")

aclRouter.get("/routes", Routes.Index)

//  --- Role ---
aclRouter.get("/role", Role.Index)
aclRouter.post("/role", Role.Store)
aclRouter.get("/role/:id", Role.Show)
aclRouter.put("/role/:id", Role.Update)
aclRouter.delete("/role/:id", Role.Delete)

module.exports = { aclRouter }
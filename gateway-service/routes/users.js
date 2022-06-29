var express = require("express");
var router = express.Router();
var userController = require("../app/controller/UserController");
/* GET users listing. */
router.get("/:userId/balance", userController.getUserBalance);

module.exports = router;

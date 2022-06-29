var express = require("express");

var router = express.Router();
var productController = require("../app/controller/ProductController");

router.get("/", productController.getAllProducts);

module.exports = router;

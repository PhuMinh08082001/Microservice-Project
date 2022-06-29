var express = require("express");

var router = express.Router();
var orderController = require("../app/controller/OrderController");

router.get("/:orderId", orderController.getOrderById);
router.post("/make-order", orderController.makeOrder);
router.get("/:userId/proceeding", orderController.getOrderProceeding);
router.get("/:userId/previous", orderController.getOrderPrevious);
router.post("/:orderId/payment", orderController.handlePayment);
module.exports = router;

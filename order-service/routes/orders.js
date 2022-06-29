const express = require("express");

const router = express.Router();

const DB = require("../config/knexDB");
const orderController = require("../app/controller/OrderController");
router.post("/make-order", orderController.makeOrder);
router.post("/make-order-detail", orderController.makeOrderDetail);
router.get("/:orderId", orderController.getOrderById);
router.get("/:userId/get-list-order-id", orderController.getOrderIds);
router.get("/:orderId/complete-payment", orderController.changeStatusPayment);
router.get("/:orderId/rollback-payment", orderController.rollbackPayment);
module.exports = router;

const axios = require("axios");
var orderService = require("../service/OrderService");

class OrderController {
  async makeOrder(req, res) {
    try {
      let userId = req.body.userId;
      let orderId = await orderService.makeOrder(userId);
      res.send(orderId[0]);
    } catch (err) {
      console.log(err);
    }
  }
  async makeOrderDetail(req, res) {
    try {
      let orderDetail = req.body;
      let orderId = await orderService.makeOrderDetail(orderDetail);
      res.send(orderId);
    } catch (err) {
      console.log(err);
    }
  }
  async getOrderById(req, res) {
    try {
      let orderId = req.params.orderId;
      let orders = await orderService.getOrderById(orderId);
      res.send(orders);
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  }
  async getOrderIds(req, res) {
    try {
      let status = req.query.status;
      let userId = req.params.userId;
      let orderIds = await orderService.getOrderIds(userId, status);
      return res.send(orderIds);
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  }
  async changeStatusPayment(req, res) {
    try {
      let orderId = req.params.orderId;
      let status = req.params.status;
      let payment = await orderService.changeStatusPayment(orderId);

      return res.send(payment);
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  }

  async rollbackPayment(req, res) {
    try {
      let orderId = req.params.orderId;
      let payment = await orderService.rollbackPayment(orderId);
      return res.send(payment);
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  }
}

module.exports = new OrderController();

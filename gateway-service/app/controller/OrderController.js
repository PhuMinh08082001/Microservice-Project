const orderService = require("../service/OrderService");
const orderServiceGrpc = require("../service/OrderServiceGrpc");
class OrderController {
  async makeOrder(req, res) {
    try {
      // let orderBill = await orderService.makeOrder(req.body);
      let orderBill = await orderServiceGrpc.makeOrder(req.body);
      res.send(orderBill);
    } catch (err) {
      console.log(err);
      // res.send({ statusCode: 404, error: err.message });
      res.status(404).send({ message: err.message });
    }
  }

  async getOrderById(req, res) {
    try {
      // let orderBill = await orderService.getOrderById(req.params.orderId);
      let orderBill = await orderServiceGrpc.getOrderById(req.params.orderId);

      res.send(orderBill);
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  }

  async getOrderPrevious(req, res) {
    try {
      let orders = await orderService.getOrderWithStatus(
        req.params.userId,
        "paid"
      );
      res.send(orders);
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  }
  async getOrderProceeding(req, res) {
    try {
      let orders = await orderService.getOrderWithStatus(
        req.params.userId,
        "unpaid"
      );
      res.send(orders);
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  }

  async handlePayment(req, res) {
    try {
      let payment = await orderServiceGrpc.handlePayment(
        req.body.userId,
        req.params.orderId
      );
      res.send(payment);
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  }
}

module.exports = new OrderController();

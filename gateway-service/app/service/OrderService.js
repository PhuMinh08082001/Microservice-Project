const userAPI = require("../api/UserAPI");
const productAPI = require("../api/ProductAPI");
const orderAPI = require("../api/OrderAPI");
const productService = require("./ProductService");
const userService = require("./UserService");
var TaskScheduler = require("../ultils/TaskScheduler");
var {
  DeductCommand,
  RefundCommand,
  CalInventoryCommand,
  RollbackInventoryCommand,
  CompletePaymentCommand,
  RollbackPaymentCommand,
} = require("../ultils/Command");
class OrderService {
  async makeOrder(orderDetail) {
    await userAPI.getUser(orderDetail.userId);
    let products = await productAPI.getListProductsOrder(orderDetail.products);

    let order = await orderAPI.createNewOrder(orderDetail.userId);

    let orderDetailRequest = products.map((element) =>
      Object.assign({ order_id: order.id }, element)
    );

    await orderAPI.createOrderDetail(orderDetailRequest);

    console.log("successfully");
    return { message: "Order " + order.id + " .You ordered succeed." };
  }

  async getOrderById(orderId) {
    let orderBill = await orderAPI.getOrderById(orderId);
    let productIds = orderBill.products;

    //assign product's name
    if (productIds.length > 0) {
      productIds = productIds.map((item) => item.product_id);
      let productsName = await productService.getListProductsName(productIds);
      orderBill.products = orderBill.products.map((x, i) =>
        Object.assign({ name: productsName[i] }, x)
      );
    }

    return orderBill;
  }

  async getOrderWithStatus(userId, status) {
    let user = await userService.getUser(userId);
    let orderIds = await orderAPI.getOrderIds(userId, status);

    orderIds = orderIds.map((item) => parseInt(item.id));

    let orders = [];
    for (const i in orderIds) {
      let order = await this.getOrderById(orderIds[i]);
      orders.push(order);
    }

    return orders;
  }

  async handlePayment(userId, orderId) {
    let user = await userAPI.getUser(userId);
    let orderBill = await this.getOrderById(orderId);
    if (orderBill.user_id != userId)
      throw new Error(
        "User " + userId + " are not allowed to pay for this order"
      );

    if (orderBill.status == "paid")
      throw new Error("You have paid for this order before");

    let totalCost = orderBill.total;

    let productOrderReq = orderBill.products.map((item) => ({
      productId: parseInt(item.product_id),
      quantity: item.quantity,
    }));

    // let completePayment;
    let taskScheduler = new TaskScheduler();
    try {
      await taskScheduler.execute(new DeductCommand(userId, totalCost));
      await taskScheduler.execute(new CalInventoryCommand(productOrderReq));
      await taskScheduler.execute(new CompletePaymentCommand(orderId));
    } catch (error) {
      while (taskScheduler.getCommands().length > 0) {
        await taskScheduler.rollback();
      }
      throw new Error(error.message);
    }
    return { status: "Order " + orderId + " are paid successfully" };
  }
}

module.exports = new OrderService();

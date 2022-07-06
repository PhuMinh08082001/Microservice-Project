const orderGrpcAPI = require("../api/OrderGrpcApi");
const productServiceGrpc = require("../service/ProductServiceGrpc");
const userGrpcAPI = require("../api/grpc/UserGrpcApi");
const productGrpcAPI = require("../api/ProductGrpcApi");
var {
  DeductCommand,
  CalInventoryCommand,
  CompletePaymentCommand,
  DeductCommandGrpc,
  CalInventoryCommandGrpc,
  CompletePaymentCommandGrpc,
} = require("../ultils/Command");
var TaskScheduler = require("../ultils/TaskScheduler");
class OrderServiceGrpc {
  async makeOrder(orderDetail) {
    await userGrpcAPI.getUser(orderDetail.userId);
    let products = await productGrpcAPI.getListProductsOrder(
      orderDetail.products
    );

    let order = await orderGrpcAPI.createNewOrder(orderDetail.userId);

    let orderDetailRequest = products.map((element) =>
      Object.assign({ order_id: order.id }, element)
    );

    await orderGrpcAPI.createOrderDetail(orderDetailRequest);

    console.log("successfully");
    return { message: "Order " + order.id + " .You ordered succeed." };
  }

  async getOrderById(orderId) {
    let orderBill = await orderGrpcAPI.getOrderById(orderId);
    let productIds = orderBill.products;

    if (productIds.length > 0) {
      productIds = productIds.map((item) => item.product_id);
      let productsName = await productServiceGrpc.getListProductsName(
        productIds
      );
      orderBill.products = orderBill.products.map((x, i) =>
        Object.assign({ name: productsName.name[i] }, x)
      );
    }

    return orderBill;
  }

  async handlePayment(userId, orderId) {
    let user = await userGrpcAPI.getUser(userId);
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
      await taskScheduler.execute(new DeductCommandGrpc(userId, totalCost));
      await taskScheduler.execute(new CalInventoryCommandGrpc(productOrderReq));
      await taskScheduler.execute(new CompletePaymentCommandGrpc(orderId));
    } catch (error) {
      while (taskScheduler.getCommands().length > 0) {
        await taskScheduler.rollback();
      }
      throw new Error(error.message);
    }
    return { status: "Order " + orderId + " are paid successfully" };
  }
}

module.exports = new OrderServiceGrpc();

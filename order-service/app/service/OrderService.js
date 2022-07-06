const DB = require("../../config/knexDB");

class OrderService {
  async makeOrder(userId) {
    try {
      let order = await DB("ordertable")
        .returning("id")
        .insert({ user_id: userId });

      if (typeof order == "undefined")
        throw new Error("Order " + orderId + " not found");

      let orderDetail = await DB("order_detail")
        .select("product_id", "quantity", "price")
        .where({ order_id: orderId });

      order["products"] = orderDetail;

      return order;
    } catch (e) {
      throw new Error(error.message);
    }
  }

  async makeOrderDetail(orderDetail) {
    try {
      const orderDetailToInsert = orderDetail.map((detail) => ({
        order_id: detail.order_id,
        product_id: detail.product_id,
        price: detail.price,
        quantity: detail.quantity,
      }));
      let order = await DB("order_detail").insert(orderDetailToInsert);
      return order;
    } catch (e) {
      throw new Error(error.message);
    }
  }

  async getOrderById(orderId) {
    let order = await DB("ordertable")
      .select("id", "user_id", "total", "status")
      .where({ id: orderId })
      .first();

    if (typeof order == "undefined")
      throw new Error("Order " + orderId + " not found");

    let orderDetail = await DB("order_detail")
      .select("product_id", "quantity", "price")
      .where({ order_id: orderId });

    order["products"] = orderDetail;

    return order;
  }

  async getOrderIds(userId, status) {
    let orderIds = await DB("ordertable")
      .select("id")
      .where({ user_id: userId, status: status });
    return orderIds;
  }

  async changeStatusPayment(orderId) {
    let status = await DB("ordertable")
      .where({ id: orderId })
      .update({ status: "paid" })
      .then(function (response) {
        return { status: "Order " + orderId + " are paid successfully" };
      });
    return status;
  }

  async rollbackPayment(orderId) {
    let status = await DB("ordertable")
      .where({ id: orderId })
      .update({ status: "unpaid" })
      .then(function (response) {
        return { status: "Order " + orderId + " rollback sucessfully" };
      });
    return status;
  }
}

module.exports = new OrderService();

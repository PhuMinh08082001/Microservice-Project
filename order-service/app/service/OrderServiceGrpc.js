const DB = require("../../config/knexDB");
var grpc = require("@grpc/grpc-js");
class OrderServiceGrpc {
  async makeOrder(call, callback) {
    let orderArray = await DB("ordertable")
      .returning("id")
      .insert({ user_id: call.request.userId });

    callback(null, orderArray[0]);
  }

  async makeOrderDetail(call, callback) {
    const orderDetailToInsert = call.request.orderdetails.map((detail) => ({
      order_id: detail.order_id,
      product_id: detail.productId,
      price: detail.price,
      quantity: detail.quantity,
    }));

    let order = await DB("order_detail")
      .returning("id")
      .insert(orderDetailToInsert);

    callback(null, { ids: order });
  }

  async getOrderById(call, callback) {
    let order = await DB("ordertable")
      .select("id", "user_id", "total", "status")
      .where({ id: call.request.id })
      .first();

    if (typeof order == "undefined")
      return callback({
        code: 400,
        message: "Order " + call.request.id + " not found",
        status: grpc.status.INTERNAL,
      });

    let orderDetail = await DB("order_detail")
      .select("product_id", "quantity", "price")
      .where({ order_id: call.request.id });

    order["products"] = orderDetail;
    callback(null, order);
  }

  //   async getOrderIds(userId, status) {
  //     let orderIds = await DB("ordertable")
  //       .select("id")
  //       .where({ user_id: userId, status: status });
  //     return orderIds;
  //   }

  async changeStatusPayment(call, callback) {
    let status = await DB("ordertable")
      .where({ id: call.request.id })
      .update({ status: "paid" })
      .then(function (response) {
        return {
          status: "Order " + call.request.id + " are paid successfully",
        };
      });
    callback(null, status);
  }

  async rollbackPayment(call, callback) {
    let status = await DB("ordertable")
      .where({ id: call.request.id })
      .update({ status: "unpaid" })
      .then(function (response) {
        return {
          status: "Order " + call.request.id + " rollback successfully",
        };
      });
    callback(null, status);
  }
}

module.exports = new OrderServiceGrpc();

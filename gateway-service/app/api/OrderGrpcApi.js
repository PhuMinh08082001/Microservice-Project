const client = require("../../config/client/OrderClient");

async function getOrderById(orderId) {
  let order = await new Promise((resolve, reject) =>
    client.getOrderById({ id: parseInt(orderId) }, function (err, response) {
      if (err) {
        reject({ message: err.details });
      }
      resolve(response);
    })
  );

  return order;
}

async function createNewOrder(userId) {
  let order = await new Promise((resolve, reject) =>
    client.makeOrder({ userId: parseInt(userId) }, function (err, response) {
      if (err) {
        reject({ message: err.details });
      }
      resolve(response);
    })
  );

  return order;
}

async function createOrderDetail(orderDetailRequest) {
  let orderDetail = await new Promise((resolve, reject) =>
    client.makeOrderDetail(
      { orderdetails: orderDetailRequest },
      function (err, response) {
        if (err) {
          reject({ message: err.details });
        }
        resolve(response);
      }
    )
  );

  return orderDetail;
}

async function completePayment(request) {
  let status = await new Promise((resolve, reject) =>
    client.changeStatusPayment(
      { id: parseInt(request.orderId) },
      function (err, response) {
        if (err) {
          reject({ message: err.details });
        }
        resolve(response);
      }
    )
  );

  return status;
}

async function rollbackPayment(request) {
  let status = await new Promise((resolve, reject) =>
    client.rollbackPayment(
      { id: parseInt(request.orderId) },
      function (err, response) {
        if (err) {
          reject({ message: err.details });
        }
        resolve(response);
      }
    )
  );

  return status;
}

const orderGrpcAPI = {
  getOrderById,
  createNewOrder,
  createOrderDetail,
  completePayment,
  rollbackPayment,
};

module.exports = orderGrpcAPI;

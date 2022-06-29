const axios = require("axios");
require("dotenv").config();

async function createNewOrder(userID) {
  try {
    let orderId = await axios({
      method: "post",
      url: `${process.env.ORDER_URL}/orders/make-order`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ userId: userID }),
    }).then(function (response) {
      return response.data;
    });
    return orderId;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function createOrderDetail(orderDetailRequest) {
  try {
    let orderId = await axios({
      method: "post",
      url: `${process.env.ORDER_URL}/orders/make-order-detail`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(orderDetailRequest),
    }).then(function (response) {
      return response.data;
    });
    return orderId;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function getOrderById(orderId) {
  try {
    let order = await axios
      .get(`${process.env.ORDER_URL}/orders/${orderId}`)
      .then((response) => {
        return response.data;
      });
    return order;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function getOrderIds(userId, status) {
  try {
    let orderIds = await axios
      .get(`${process.env.ORDER_URL}/orders/${userId}/get-list-order-id`, {
        params: { status: status },
      })
      .then((response) => {
        return response.data;
      });
    return orderIds;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function completePayment(request) {
  try {
    let status = await axios
      .get(
        `${process.env.ORDER_URL}/orders/${request.orderId}/complete-payment`
      )
      .then((response) => {
        return response.data;
      });
    return status;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function rollbackPayment(request) {
  try {
    let status = await axios
      .get(
        `${process.env.ORDER_URL}/orders/${request.orderId}/rollback-payment`
      )
      .then((response) => {
        return response.data;
      });
    return status;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

const orderAPI = {
  createNewOrder,
  createOrderDetail,
  getOrderById,
  getOrderIds,
  completePayment,
  rollbackPayment,
};

module.exports = orderAPI;

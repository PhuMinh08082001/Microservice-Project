const axios = require("axios");
require("dotenv").config();

async function getBalanceUser(userId) {
  try {
    let response = await axios
      .get(`${process.env.ACCOUNT_URL}/users/${userId}/balance`)
      .then((response) => {
        return response.data;
      });
    return response;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function getUser(userId) {
  try {
    let user = await axios
      .get(`${process.env.ACCOUNT_URL}/users/${userId}`)
      .then((response) => {
        return response.data;
      });
    return user;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function deductMoney(request) {
  try {
    let status = await axios({
      method: "post",
      url: `${process.env.ACCOUNT_URL}/users/${request.userId}/deduct-money`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ amount: request.amount }),
    }).then(function (response) {
      return response.data;
    });
    return status;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function refundMoney(request) {
  try {
    let status = await axios({
      method: "post",
      url: `${process.env.ACCOUNT_URL}/users/${request.userId}/refund-money`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ amount: request.amount }),
    }).then(function (response) {
      return response.data;
    });
    return status;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

const userAPI = {
  getBalanceUser,
  getUser,
  deductMoney,
  refundMoney,
};

module.exports = userAPI;

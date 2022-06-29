const axios = require("axios");
require("dotenv").config();
async function getAllProducts(params) {
  let product = await axios
    .get(`${process.env.PRODUCT_URL}/products`, { params: params })
    .then((response) => {
      return response.data;
    });
  return product;
}

async function getListProductsOrder(products) {
  try {
    let productList = await axios({
      method: "post",
      url: `${process.env.PRODUCT_URL}/products/products-order`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(products),
    }).then(function (response) {
      return response.data;
    });
    return productList;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function getListProductsName(productIds) {
  let product = await axios
    .get(
      `${process.env.PRODUCT_URL}/products/get-list-product-name/${productIds}`
    )
    .then((response) => {
      return response.data;
    });
  return product;
}

async function checkAndCalculateInventory(request) {
  try {
    let productList = await axios({
      method: "post",
      url: `${process.env.PRODUCT_URL}/products/check-calculate-inventory`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(request.productOrderReq),
    }).then(function (response) {
      return response.data;
    });
    return productList;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

async function rollbackInventory(request) {
  try {
    let productList = await axios({
      method: "post",
      url: `${process.env.PRODUCT_URL}/products/rollback-inventory`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(request.productOrderReq),
    }).then(function (response) {
      return response.data;
    });
    return productList;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
const productAPI = {
  getAllProducts,
  getListProductsOrder,
  getListProductsName,
  checkAndCalculateInventory,
  rollbackInventory,
};

module.exports = productAPI;

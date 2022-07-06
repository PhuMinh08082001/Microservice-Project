const client = require("../../config/client/ProductClient");

async function getListProductsName(productIds) {
  let productNames = await new Promise((resolve, reject) =>
    client.getNameProducts({ id: productIds }, function (err, response) {
      if (err) {
        return reject({ message: err.details });
      }
      resolve(response);
    })
  );

  return productNames;
}

async function getListProductsOrder(products) {
  let productOrder = await new Promise((resolve, reject) =>
    client.getListProductsInOrder(
      { products: products },
      function (err, response) {
        if (err) {
          return reject({ message: err.details });
        }
        resolve(response.products);
      }
    )
  );

  return productOrder;
}

async function checkAndCalculateInventory(request) {
  let status = await new Promise((resolve, reject) =>
    client.checkAndCalculateInventory(
      { products: request.productOrderReq },
      function (err, response) {
        if (err) {
          return reject({ message: err.details });
        }
        resolve(response);
      }
    )
  );

  return status;
}

async function rollbackInventory(request) {
  let status = await new Promise((resolve, reject) =>
    client.rollbackInventory(
      { products: request.productOrderReq },
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

const productGrpcAPI = {
  getListProductsName,
  getListProductsOrder,
  checkAndCalculateInventory,
  rollbackInventory,
};

module.exports = productGrpcAPI;

const userAPI = require("../api/UserAPI");
const productAPI = require("../api/ProductAPI");
const orderAPI = require("../api/OrderAPI");
const userGrpcAPI = require("../api/grpc/UserGrpcApi");
const productGrpcAPI = require("../api/ProductGrpcApi");
const orderGrpcAPI = require("../api/OrderGrpcApi");
var Command = function (execute, rollback, argument) {
  this.execute = execute;
  this.rollback = rollback;
  this.argument = argument;
};

var DeductCommand = function (userId, totalCost) {
  return new Command(userAPI.deductMoney, userAPI.refundMoney, {
    userId: userId,
    amount: totalCost,
  });
};

var DeductCommandGrpc = function (userId, totalCost) {
  return new Command(userGrpcAPI.deductMoney, userGrpcAPI.refundMoney, {
    userId: userId,
    amount: totalCost,
  });
};

var CalInventoryCommand = function (productOrderReq) {
  return new Command(
    productAPI.checkAndCalculateInventory,
    productAPI.rollbackInventory,
    { productOrderReq: productOrderReq }
  );
};

var CalInventoryCommandGrpc = function (productOrderReq) {
  return new Command(
    productGrpcAPI.checkAndCalculateInventory,
    productGrpcAPI.rollbackInventory,
    { productOrderReq: productOrderReq }
  );
};

var CompletePaymentCommand = function (orderId) {
  return new Command(orderAPI.completePayment, orderAPI.rollbackPayment, {
    orderId: orderId,
  });
};

var CompletePaymentCommandGrpc = function (orderId) {
  return new Command(
    orderGrpcAPI.completePayment,
    orderGrpcAPI.rollbackPayment,
    {
      orderId: orderId,
    }
  );
};

module.exports = {
  DeductCommand,
  CalInventoryCommand,
  CompletePaymentCommand,
  DeductCommandGrpc,
  CalInventoryCommandGrpc,
  CompletePaymentCommandGrpc,
};

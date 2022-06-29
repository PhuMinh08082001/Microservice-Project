const userAPI = require("../api/UserAPI");
const productAPI = require("../api/ProductAPI");
const orderAPI = require("../api/OrderAPI");

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

var RefundCommand = function (userId, totalCost) {
  return new Command(userAPI.refundMoney, userAPI.deductMoney, {
    userId: userId,
    amount: totalCost,
  });
};

var CalInventoryCommand = function (productOrderReq) {
  return new Command(
    productAPI.checkAndCalculateInventory,
    productAPI.checkAndCalculateInventory,
    { productOrderReq: productOrderReq }
  );
};

var RollbackInventoryCommand = function (productOrderReq) {
  return new Command(
    productAPI.rollbackInventory,
    productAPI.checkAndCalculateInventory,
    { productOrderReq: productOrderReq }
  );
};

var CompletePaymentCommand = function (orderId) {
  return new Command(orderAPI.completePayment, orderAPI.rollbackPayment, {
    orderId: orderId,
  });
};

var RollbackPaymentCommand = function (orderId) {
  return new Command(orderAPI.rollbackPayment, orderAPI.completePayment, {
    orderId: orderId,
  });
};
module.exports = {
  DeductCommand,
  RefundCommand,
  CalInventoryCommand,
  RollbackInventoryCommand,
  CompletePaymentCommand,
  RollbackPaymentCommand,
};

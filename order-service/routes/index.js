const orders = require("./orders");
function route(app) {
  app.use("/orders", orders);
}
module.exports = route;

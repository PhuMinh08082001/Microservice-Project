const products = require("./product");
const users = require("./users");
const orders = require("./orders");
function route(app) {
  app.use("/products", products);
  app.use("/users", users);
  app.use("/orders", orders);
}
module.exports = route;

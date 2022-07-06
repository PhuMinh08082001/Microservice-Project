const grpc = require("grpc");
const PROTO_PATH = "../order-service/proto/orders.proto";
const OrderService = grpc.load(PROTO_PATH).OrderService;
const client = new OrderService(
  "localhost:9910",
  grpc.credentials.createInsecure()
);

module.exports = client;

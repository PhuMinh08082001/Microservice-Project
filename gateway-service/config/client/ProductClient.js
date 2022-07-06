var PROTO_PATH =
  __dirname + "../../../../product-service/src/main/proto/product.proto";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var protoDescriptor =
  grpc.loadPackageDefinition(packageDefinition).com.banvien.training;
var productService = protoDescriptor;

const client = new productService.ProductService(
  "localhost:9920",
  grpc.credentials.createInsecure()
);

module.exports = client;

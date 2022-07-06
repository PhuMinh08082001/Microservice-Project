var PROTO_PATH =
  __dirname + "../../../../account-service/src/main/proto/users.proto";

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
var userService = protoDescriptor;

const client = new userService.UserService(
  "localhost:9950",
  grpc.credentials.createInsecure()
);

module.exports = client;

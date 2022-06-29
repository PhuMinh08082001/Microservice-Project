const client = require("cloud-config-client");
require("dotenv").config();

async function getConfig() {
  port = await client
    .load({
      endpoint: "http://localhost:8900",
      name: "order-service",
      profiles: "local",
    })
    .then((config) => {
      return config.properties;
    });
  return port;
}
const configAPI = {
  getConfig,
};

module.exports = configAPI;

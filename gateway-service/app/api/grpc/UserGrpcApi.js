const client = require("../../../config/client/UserClient");

async function getUser(userId) {
  let user = await new Promise((resolve, reject) =>
    client.getUser({ id: parseInt(userId) }, function (err, response) {
      if (err) {
        reject({ message: err.details });
      }
      resolve(response);
    })
  );

  return user;
}

async function deductMoney(request) {
  let status = await new Promise((resolve, reject) =>
    client.deductMoney(
      { user_id: parseInt(request.userId), amount: parseInt(request.amount) },
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

async function refundMoney(request) {
  let status = await new Promise((resolve, reject) =>
    client.refundMoney(
      { user_id: parseInt(request.userId), amount: parseInt(request.amount) },
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

const userGrpcAPI = {
  getUser,
  deductMoney,
  refundMoney,
};

module.exports = userGrpcAPI;

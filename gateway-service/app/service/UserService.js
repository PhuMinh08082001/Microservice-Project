const userAPI = require("../api/UserAPI");

class UserService {
  async getUserBalance(userId) {
    return await userAPI.getBalanceUser(userId);
  }

  async getUser(userId) {
    return await userAPI.getUser(userId);
  }
}

module.exports = new UserService();

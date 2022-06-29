const axios = require("axios");
var userService = require("../service/UserService");

class UserController {
  async getUserBalance(req, res) {
    try {
      let balance = await userService.getUserBalance(req.params.userId);
      res.send(balance);
    } catch (err) {
      throw new Error(error.response.data.message);
    }
  }

  async getUser(req, res) {
    try {
      let user = await userService.getUser(req.params.userId);
      res.send(user);
    } catch (err) {
      throw new Error(error.response.data.message);
    }
  }
}

module.exports = new UserController();

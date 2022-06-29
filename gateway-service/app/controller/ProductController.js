var productService = require("../service/ProductService");

class ProductController {
  async getAllProducts(req, res) {
    try {
      let bunchOfProducts = await productService.getAllProducts(req.query);
      res.send(bunchOfProducts);
    } catch (err) {}
  }
}

module.exports = new ProductController();

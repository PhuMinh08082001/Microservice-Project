const productAPI = require("../api/ProductAPI");
class ProductService {
  async getAllProducts(params) {
    let bunchOfProducts;
    try {
      bunchOfProducts = await productAPI.getAllProducts(params);
    } catch (e) {}
    return bunchOfProducts;
  }

  async getListProductsName(productIds) {
    let productsName = await productAPI.getListProductsName(productIds);
    return productsName;
  }
}

module.exports = new ProductService();

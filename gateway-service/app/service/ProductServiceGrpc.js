const productGrpcAPI = require("../api/ProductGrpcApi");
class ProductService {
  //   async getAllProducts(params) {
  //     let bunchOfProducts;
  //     try {
  //       bunchOfProducts = await productAPI.getAllProducts(params);
  //     } catch (e) {}
  //     return bunchOfProducts;
  //   }

  async getListProductsName(productIds) {
    let productsName = await productGrpcAPI.getListProductsName(productIds);
    return productsName;
  }
}

module.exports = new ProductService();

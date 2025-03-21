const ProductoModel = import ('../models/producto.model.js');

class ProductsService {
  static async getPaginateProducts(page, limit) {
    const options = {
      page,
      limit,
    };
    const products = await ProductoModel.paginate({}, options);
    return { products: products.docs, totalProducts: products.totalDocs };
  }
}

export default new ProductsService();

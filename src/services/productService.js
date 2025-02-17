const ProductoModel = require('../models/Product'); // Asegúrate de tener tu modelo de producto  

class ProductsService {  
    static async getPaginatedProducts(page, limit) {  
        const options = {  
            page,  
            limit,  
        };  

        const products = await ProductoModel.paginate({}, options); // Suponiendo que usas Mongoose y `paginate`  
        return {  
            products: products.docs,  
            totalProducts: products.totalDocs,  
        };  
    }  
}  

module.exports = ProductsService;
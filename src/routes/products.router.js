import { Router } from "express";
import ProductsManager from "../controllers/ProductsManager.js";
import __dirname from "../utils.js";
import productModel  from "../models/product.model.js";

const router = Router();

const PM = new ProductsManager(__dirname + '/files/products.json');

router.get('/products', async (req, res) => {  
  const { limit = 10, page = 1, query = '', sort } = req.query;  

  const options = {
       page: Number(page),
       limit: Number(limit),
       sort: sort === 'desc' ? { precio: -1 } : { precio: 1 },  
  };

  let filter = {};

  if (query) {
    filter.category = query;  
  }  

  let sortOptions = {};  
  if (sort) {  
      sortOptions.price = sort === 'asc' ? 1 : -1; 
  }  
      try{
    const result = await productModel.paginate(queryOptions, options);
    
    res.json({  
      status: 'success',  
      payload: result.docs,  
      totalPages: result.totalPages,
      prevPage: result.prevPages, 
      nextPage: result.nextPages, 
      page: result.page,
      hasPrevPage: result.hasPrevPage,  
      hasNextPage: result.hasNextPage, 
      prevLink: result.hasPrevtPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort${sort || ''}&query=${query}` : null,   
      nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort${sort || ''}&query=${query}` : null,  
  });  
    } catch (error) {
        res.status(500).json({status: "error", message: error.message });
    }
});

router.get("/:pid", async (req, res) => {
  const productfind = await manager.getProductbyId(req.params);
  res.json({ status: "success", productfind });
});

router.post("/", async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  try {
    await PM.addProduct({
      title: "require",
      description: "require",
      code: "require",
      price: "require",
      status: true,
      stock,
      category,
    });
    res.send({ status: "success", message: "producto agregado" });

  } catch (error) {
    console.error(error);
    res.status(400).send({ status: "error", error: "ha ocurrido un error" });
  }
});

router.put("/:productId", async (req, res) => {
  const productId = +req.params.productId;
  const productData = req.body;

  try {
    await PM.updateProduct(productId, productData);
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: "error", error: "ha ocurrido un error" });
  }

  res.send({ status: "success", message: "producto editado" });
});

router.delete("/:productId", async (req, res) => {  
  const productId = +req.params.productId;  

  try {  
      const result = await PM.deleteProduct(productId);  
 
      if (!result) {  
          return res.status(404).send({ status: "error", error: "Producto no encontrado" });  
      }  
      res.send({ status: "success", message: "Producto eliminado", productId });  
  } catch (error) {  
      console.error(error);  
      res.status(500).send({ status: "error", error: "Ha ocurrido un error al eliminar el producto" });  
  }  
});

export default router;

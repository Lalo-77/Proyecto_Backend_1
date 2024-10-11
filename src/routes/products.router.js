import { Router } from "express";
import ProductsManager from "../controllers/ProductsManager.js";
import __dirname from "../utils.js";

const router = Router();

const PM = new ProductsManager(__dirname+'/files/products.json');

const products = [];
router.get('/products', async (req, res) => {  
  const { limit = 10, page = 1, query = '', sort } = req.query;  

  const queryOptions = {};  
  if (query) {  
      queryOptions.nombre = new RegExp(query, 'i'); // Búsqueda insensible a mayúsculas/minúsculas  
  }  

  const totalProducts = await products.countDocuments(queryOptions);  
  const totalPages = Math.ceil(totalProducts / limit);  
  const products = await products.find(queryOptions)  
      .sort(sort === 'desc' ? { precio: -1 } : { precio: 1 })  
      .skip((page - 1) * limit)  
      .limit(Number(limit));  

  res.json({  
      status: 'success',  
      payload: products,  
      totalPages,  
      prevPage: page > 1 ? page - 1 : null,  
      nextPage: page < totalPages ? page + 1 : null,  
      page: Number(page),  
      hasPrevPage: page > 1,  
      hasNextPage: page < totalPages,  
      prevLink: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null,  
      nextLink: page < totalPages ? `/api/products?page=${page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null,  
  });  
});

router.post("/:pid", (req, res) => {
  const idProduct = +req.params.pid;
  const product = products.find((product) => product.id === idProduct);
  if (!product) {
    res.status(400).send({ status: "error", error: "Producto no encontrado"})
  } else {
    res.send(product);
  }
})

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
    await PM.deleteProduct(productId);
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: "error", error: "ha ocurrido un error" });
  }

  res.send({ status: "success", message: "producto eliminado" + productId });
});

export default router;

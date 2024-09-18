import { Router } from "express";
import express from "express";
import ProductManager from "../managers/ProductsManager.js";

const router = Router();

const PM = new ProductManager();
const products = [];
router.get("/", async (req, res) => {
  let limit = +req.query.limit || null;
  try {
    const products = await PM.getProducts(limit);  
    res.render("products", { products }); 
  } catch (error) {
    console.error(error);  
    res.status(500).send({ status: "error", error: "Error al recuperar productos" });  
  }
});

router.get("/", (req, res) => {
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", { products });
});
router.get("/:pid", (req, res) => {
  const idProduct = +req.params.pid;
  const product = products.find((product) => product.id === idProduct);
  if (!product) {
    res.status(400).send({ status: "error", error: "Producto no encontrado"})
  } else {
    res.send(product);
  }
})
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

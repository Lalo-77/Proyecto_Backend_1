import { Router } from "express";
import CartManager from "../managers/ProductsManager.js";

const router = Router();

const cartManagerInstance = new CartManager("files/carts.json");

router.post("/api/carts", async (req, res) => {
  try {
    const newCart = await cartManagerInstance.addCart();
    res.status(201).send({status: "success", maessage: "Carrito creado", cart: newCart});

  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", error: "ha ocurrido un error al crear el carrito" });
  }
});

router.delete('/carts/:cid/products/:pid', async (req, res) => {  
  const { cid, pid } = req.params;  

  try {  
      const cart = await cart.findById(cid);  
      if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });  
      
      const productIndex = cart.products.findIndex(product => product.id.toString() === pid);  
      if (productIndex !== -1) {  
          cart.products.splice(productIndex, 1);  
          await cart.save();  
          return res.status(200).json({ message: 'Producto eliminado del carrito' });  
      } else {  
          return res.status(404).json({ message: 'Producto no encontrado en el carrito' });  
      }  
  } catch (error) {  
      res.status(500).json({ message: error.message });  
  }  
});  

router.put('/carts/:cid', async (req, res) => {  
  const cid = req.params.cid;  
  const products = req.body.products;  

  try {  
      const cart = await cart.findById(cid);  
      cart.products = products; // Actualiza o crea el carrito  
      await cart.save();  
      return res.status(200).json({ message: 'Carrito actualizado', products });  
  } catch (error) {  
      res.status(500).json({ message: error.message });  
  }  
});  

// PUT api/carts/:cid/products/:pid  
router.put('/carts/:cid/products/:pid', async (req, res) => {  
  const { cid, pid } = req.params;  
  const quantity = req.body.quantity;  

  if (typeof quantity !== 'number' || quantity < 0) {  
      return res.status(400).json({ message: 'Cantidad inválida' });  
  }  

  try {  
      const cart = await cart.findById(cid);  
      const product = cart.products.find(product => product.id.toString() === pid);  
      if (product) {  
          product.quantity = quantity; // Actualiza la cantidad del producto  
          await cart.save();  
          return res.status(200).json({ message: 'Cantidad actualizada', product });  
      } else {  
          return res.status(404).json({ message: 'Producto no encontrado en el carrito' });  
      }  
  } catch (error) {  
      res.status(500).json({ message: error.message });  
  }  
});  
router.get("/:cid", async (req, res) => {
  const cartId = +req.params.cid;

  try {  
    const cart = await cartManagerInstance.getCart(cartId);

    if (!cart) {
      return res.status(404).send({ status: "error", error: "carrito no encontrado" });
    }

    res.send({ cart });
}catch (error) {
console.error("error");
res.status(500).send({ status: "error", error: "Error al obtener el carrito"});
}
});
router.delete('/carts/:cid', async (req, res) => {  
  const cid = req.params.cid;  

  try {  
      const cart = await cart.findById(cid);  
      if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });  
      
      cart.products = []; // Elimina todos los productos del carrito  
      await cart.save();  
      return res.status(200).json({ message: 'Todos los productos eliminados del carrito' });  
  } catch (error) {  
      res.status(500).json({ message: error.message });  
  }  
});  
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = +req.params.cid;
  const productId = req.params.pid;

  try {
    await cartManagerInstance.addProductToCart(cartId, productId);
    res.send({ status: "success", message: "Producto agregado al carrito"});
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: "error", error: "Ha ocurrido un error al agregar el producto"});
  }
});

export default router;
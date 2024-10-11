import { Router } from "express";
import CartManager from "../controllers/ProductsManager.js";

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
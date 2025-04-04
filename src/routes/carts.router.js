import { Router } from "express";
import CartManager from "../managers/ProductsManager.js";
import CartModel from "../models/carts.model.js";
import ProductoModel from "../models/producto.model.js";
import TicketModel from "../models/tickets.model.js";
import { calcularTotal } from "../utils/validar.js";

const router = Router();
const cartManagerInstance = new CartManager("files/carts.json");

router.get("/", async (req, res) => {
  try {
    const carts = await CartModel.find().populate("products.product");
    res.status(200).json({ status: "success", carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener los carritos", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] }); // Crear un carrito vacío
    res.status(201).json({ status: "success", message: "Carrito creado", cart: newCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error al crear el carrito", error: error.message });
  }
});

router.delete('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex(
      item => item.product._id?.toString() === pid || item.product?.toString() === pid
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    for (const item of products) {
      const exists = await ProductModel.findById(item.product);
      if (!exists) {
        return res.status(400).json({ message: `Producto no válido: ${item.product}` });
      }
    }

    cart.products = products;
    await cart.save();

    await cart.populate("products.product", "_id title price");

    res.status(200).json({ message: 'Carrito actualizado', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ message: 'Cantidad inválida' });
  }

  try {
    const cart = await CartModel.findById(cid).populate("products.product");
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const item = cart.products.find(
      item => item.product._id?.toString() === pid || item.product?.toString() === pid
    );

    if (!item) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Cantidad actualizada', product: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await CartModel.findById(cid).populate("products.product");
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    res.json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito" });
  }
});

router.delete('/:cid', async (req, res) => {  
  const { cid } = req.params;

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.status(200).json({ message: 'Todos los productos eliminados del carrito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      console.log("❌ Carrito no encontrado");
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const product = await ProductModel.findById(pid);
    if (!product) {
      console.log("❌ Producto no encontrado");
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    console.log("✅ Producto encontrado:", product);
    console.log("✅ Carrito encontrado:", cart);

    cart.products.push({ product: product._id, quantity: 1 });
    await cart.save();

    res.status(200).json({ message: "Producto agregado al carrito" });
  } catch (error) {
    console.error("❌ Error al agregar el producto:", error.message);
    res.status(400).json({ message: "Error al agregar el producto", error: error.message });
  }
});

router.post("/:cid/purchase", async (req, res) => {
  const { cid } = req.params;
  const { email } = req.body; 

  try {
    const cart = await CartModel.findById(cid).populate("products.product");
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    let totalAmount = 0;
    const outOfStock = [];

    for (const item of cart.products) {
      const product = item.product;
      if (product.stock < item.quantity) {
        outOfStock.push({ product: product.title, available: product.stock });
      } else {
        product.stock -= item.quantity;
        await product.save();
        totalAmount += product.price * item.quantity;
      }
    }

    if (outOfStock.length > 0) {
      return res.status(400).json({
        message: "Algunos productos no tienen stock suficiente",
        outOfStock,
      });
    }

    const newTicket = await TicketModel.create({
      code: `TCK-${Date.now()}`,
      amount: totalAmount,
      purchaser: email,
    });

    cart.products = [];
    await cart.save();

    res.status(200).json({ message: "Compra realizada con éxito", ticket: newTicket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
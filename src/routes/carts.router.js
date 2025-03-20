import { Router } from "express";
import CartManager from "../managers/ProductsManager.js";
import CartModel from "../models/carts.model.js";
import ProductModel from "../models/producto.model.js";
import UsuarioModel from "../models/usuarios.model.js";
import TicketModel from "../models/tickets.model.js";
import { calcularTotal } from "../utils/validar.js";

const router = Router();

const cartManager = new CartManager();

router.post("/api/carts", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.crearCacrrito();
    res.json(nuevoCarrito);
  } catch (error) {
    console.error("Error al crear el carrito", error);
    res.status(500).json({ status: "error", error: "ha ocurrido un error al crear el carrito" });
  }
});
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
      const carrito = await CartModel.findById(cartId)

      if (!carrito) {
          console.log("No existe ese carrito con el id");
          return res.status(404).json({ error: "Carrito no encontrado" });
      }

      return res.json(carrito.products);
  } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
      const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
      res.json(actualizarCarrito.products);
  } catch (error) {
      console.error("Error al agregar producto al carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});
//
router.get("/:cidpurchase", async(req, res) => {
  const carritoId = req.params.cid;
  try {
    const carrito = await CartModel.findById(carritoId);
    const arrayProductos = carrito-products;

    const productosNoDisponibles = [];
    
    for ( const item of arrayProductos) {
      const productId = item.product;
      const product = await ProductModel.findById(productId);
      if(product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
      } else  {
        productosNoDisponibles.push(productId);
      }
    }

    const usuarioDelCarrito = await UsuarioModel.findOne({cart: carritoId});
        
         const ticket = new TicketModel({
             purchase_datetime: new Date(),
             amount: calcularTotal(carrito.products),
             purchaser: usuarioDelCarrito.email
         })

         await ticket.save();

        carrito.products = cart.products.filter(item => productosNoDisponibles.some(productoId => productoId.equals(item.product)));

        await carrito.save();
      
        res.json({ 
          message: "Compra generada",
          ticket: {
            id: ticket._id,
            amount: ticket.amount,
            purchaser: ticket.purchaser
          },
          productosNoDisponibles
        })

    } catch (error) {
        res.status(500).send(" error ")    
  }
})
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
      cart.products = products; 
      await cart.save();  
      return res.status(200).json({ message: 'Carrito actualizado', products });  
  } catch (error) {  
      res.status(500).json({ message: error.message });  
  }  
});  

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
          product.quantity = quantity; 
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
      
      cart.products = [];   
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
/////
router.get("/:cid/purchase", async (req, res) => {
  const carritoId = req.params.cid;
  try {
      const carrito = await CartModel.findById(carritoId);
      const arrayProductos = carrito.products;

      const productosNoDisponibles = [];

      for (const item of arrayProductos) {
          const productId = item.product;
          const product = await ProductModel.findById(productId);
          if (product.stock >= item.quantity) {
              product.stock -= item.quantity;
              await product.save();
          } else {
              productosNoDisponibles.push(productId);
          }
      }

      const usuarioDelCarrito = await UsuarioModel.findOne({cart: carritoId});

      const ticket = new TicketModel({
          purchase_datetime: new Date(), 
          amount: calcularTotal(carrito.products),
          purchaser: usuarioDelCarrito.email
      })

      await ticket.save(); 

      carrito.products = carrito.products.filter(item => productosNoDisponibles.some(productoId => productoId.equals(item.product))); 

      await carrito.save(); 

      res.json({
          message: "Compra generada",
          ticket: {
              id: ticket._id,
              amount: ticket.amount,
              purchaser: ticket.purchaser
          }, 
          productosNoDisponibles
      })

  } catch (error) {
      res.status(500).send("error");
  }
})

export default router;
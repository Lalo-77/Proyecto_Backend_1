import { Router } from "express";
import _dirname from "../utils.js";
import CartController from "../controllers/cart.controller.js";
import ViewsController from "../controllers/views.controller.js";
import ProductoController from "../controllers/producto.Controller.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
//import { Admin, User } from "../middleware/auth.js";
import ProductsManager from "../managers/ProductsManager.js";

const PM = new ProductsManager(_dirname + "/database/products.json");


const router = Router();

router.get("/", ViewsController.renderHome);
router.get("/products", ViewsController.renderProducts);
router.get("/product/:id", ViewsController.renderProductDetail);
router.get("/carts/:id", ViewsController.renderCart);

router.get("/carrito/:cartId", CartController.viewCarrito);

const authenticateJWT = (req, res, next) => {
  const token = req.cookies["coderCookieToken"];
  if (!token) return res.redirect("/login");

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.redirect("/login");
    req.user = user;
    next();
  });
};

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts");
});

router.get("/home", authenticateJWT, async (req, res) => {
  const { page = 1, limit = 10, sort = "asc" } = req.query;

  try {
    const listadeproductos = await PM.getProducts();
    res.render("home", { listadeproductos });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.render("home", {
      productos: [],
      message: "Error al obtener los productos",
      user: req.user,
    });
  }
});

router.get("/home", authenticateJWT, async (req, res) => {
  const { page = 1, limit = 10, sort = "asc" } = req.query;

  try {
    const listadeproductos = await PM.getProducts();
    res.render("home", { listadeproductos });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.render("home", {
      productos: [],
      message: "Error al obtener los productos",
      user: req.user,
    });
  }
});

router.post("/carts/:cid", authenticateJWT, async (req, res) => {
  try {
    const carrito = await CartService.getCarritoById(req.params.cid);
    res.render("carts", { productos: carrito.products, user: req.user });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/errorRegistro", (req, res) => {
  res.render("errorRegistro");
});

router.get("/errorLogin", (req, res) => {
  res.render("errorLogin");
});

router.get("/profile", (req, res) => {
  res.render("profile");
  console.log(req.session);
});

export default router;

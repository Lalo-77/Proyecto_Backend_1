import Router from "express";
import productsRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";
import sessionRouter from "./session.router.js";

const router = Router();

router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/session", sessionRouter);

export default router;
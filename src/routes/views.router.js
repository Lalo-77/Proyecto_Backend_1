import { Router } from "express";
import ProductManager from "../Dao/controllers/ProductManager.js";
import __dirname from "../utils.js";

const PM = new ProductManager(__dirname + `/Dao/database/products.json`);

const router = Router();

router.get("/", async (req, res) => {
    try {
        const listadeproductos = await PM.getProducts();

        res.render("home", { listadeproductos });
    } catch (error) {
        console.error("Error en cargar los productos:", error);
        res.status(500).send("Error interno");
    }
});

router.get("/realTimeProducts", (req, res) => {
    res.render("realTimeProducts");
});

export default router;
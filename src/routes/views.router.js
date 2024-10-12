import { Router } from "express";
import _dirname from "../utils.js";
import ProductsManager from "../controllers/ProductsManager.js";

const PM = new ProductsManager(_dirname + "/files/products.json");  

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

router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/register", (req, res) => {
    res.render("register");
})

router.get("/profile", (req, res)=> {
    res.render("profile");
})

router.get("/realTimeProducts", (req, res) => {
    res.render("realTimeProducts");
})

export default router;
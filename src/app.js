import { Router } from "express"; 
import products from "../src/files/products.json" assert { type: "json"};
import productsRouter from "./routes/products.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import express from "express";

const app = express();
const PORT = 8080;
const HOST = "localhost";

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use("/api/products", productsRouter);
app.get("/", (req, res) => {
    let user = {
        name: "Hilda",
        lastName: "Martinez",
    }
    res.render("index", user);
})

app.listen(PORT, () => {
    console.log(`Ejecutandose en http://${HOST}:${PORT}`);
});




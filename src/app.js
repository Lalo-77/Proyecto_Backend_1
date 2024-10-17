import express from "express"
import { Server } from "socket.io";
import { engine } from "express-handlebars";  
import __dirname from "./utils.js"; 
import viewsRouter from "./routes/views.router.js"; 
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import socketProducts from "./listeners/socketProducts.js";
import path from "path";
import productModel from "./models/product.model.js";
import mongoose from "mongoose";

const app = express();
const PUERTO = 8080;
const HOST = "localhost";

app.use(express.static(__dirname + "/public"));

//Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views")); 


//MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "public"));
app.use(cookieParser());
//Error 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://crisn3682:coderhouse@cluster0.xqijc.mongodb.net/shop-cars?retryWrites=true&w=majority&appName=Cluster0",
    }),
}));

//RUTAS

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const httpServer = app.listen(PUERTO, () => {
    try {
        console.log(`Escuchando en el puerto http://${HOST}:${PUERTO}`);
   
    } catch (error) {
        console.log(error);
    }
})

const environment = async () => {
    await mongoose.connect("mongodb+srv://crisn3682:coderhouse@cluster0.xqijc.mongodb.net/shop-cars?retryWrites=true&w=majority&appName=Cluster0");
    let products = await productModel.paginate({category:"decoracion"}, {limit: 4, page:2});
    console.log(products);
};

environment();
 
const socketServer = new Server(httpServer);

socketProducts(socketServer);
import express from "express"
import { Server } from "socket.io";
import { engine } from "express-handlebars";  
import __dirname from "./utils.js"; 
import viewsRouter from "./routes/views.router.js"; 
import sessionRouter from "./routes/session.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import authRouter from "./routes/auth.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import socketProducts from "./listeners/socketProducts.js";
import path from "path";
import productoModel from "./models/producto.model.js";
import mongoose from "mongoose";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { initMongoDB } from "./config/dbConfig.js";
import nodemailer from "nodemailer";
import "dotenv/config";
import "./database.js";

const app = express();
const PUERTO = 8080;
const HOST = "localhost";

app.use(express.static(__dirname + "/public"));

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "public"));
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

//Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views"); 

//Error 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

app.use("/", viewsRouter);
app.use("api/products", productsRouter);
app.use("api/carts", cartsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/session/auth", authRouter);


const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth:{
        user: "crisn3682@gmail.com",
        pass: "sxyz jlca jywe tqcr"
    }
})

app.get("/mail", async (req, res)=> {
    try {
        await  transport.sendMail({
            from: "crisn3682@gmail.com",
            to: "cristianne97@gmail.com",
            subject: " Testeamos Nodemailer",
            html: `<h1>hOLA !!!</h1>
            <img src="cid:cotorrita1">`,
            attachments:[
                {
                    filename: "cotorrita.jpg",
                    path: "./src/public/img/cotorrita.jpg",
                    cid: "cotorrita1"
                }
            ] 
        })
        res.send("Correo enviado correctamente");
    } catch (error) {
        res.status(500).send("Error al enviar el mail");
    }
})
const httpServer = app.listen(PUERTO, () => {
    try {
        console.log(`Escuchando en el puerto http://${HOST}:${PUERTO}`);
   
    } catch (error) {
        console.log(error);
    }
})
const environment = async () => {
    await mongoose.connect("mongodb+srv://crisn3682:coderhouse@cluster0.xqijc.mongodb.net/shop-cars?retryWrites=true&w=majority&appName=Cluster0");
    let products = await productoModel.paginate({category:"decoracion"}, {limit: 4, page:2});
    console.log(products);
};
environment();
const socketServer = new Server(httpServer);
socketProducts(socketServer);
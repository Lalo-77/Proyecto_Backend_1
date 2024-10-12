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

const app = express();
const PUERTO = 8080;

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

//Error 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});
const httpServer = app.listen(PUERTO, () => {
    try {
        console.log(`Escuchando en el puerto ${PUERTO}`);
   
    } catch (error) {
        console.log(error);
    }
})

const socketServer = new Server(httpServer);

socketProducts(socketServer);
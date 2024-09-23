import express from "express";  
import { Server } from "socket.io";  
import handlebars from "express-handlebars";  
import __dirname from "./utils.js"; 
import viewsRouter from "./routes/views.router.js"; 
import productsRouter from "./routes/products.router.js";
import socketProducts from "./listeners/socketProducts.js";

const app = express();  
const PORT = 8080;  
const HOST = "localhost";

app.use(express.static(`${__dirname}/../public`));  

//habdlebars
app.engine("handlebars", handlebars.engine());  
app.set("views", __dirname+"/views"); 
app.set("view engine", "handlebars");  

app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(__dirname + "/public"));

//rutas

app.use("/", viewsRouter);  
app.use("/api", productsRouter);  

const httpServer = app.listen(PORT, () => {  
    console.log(`Servidor corriendo en localhost:${PORT}`); 
}); 

const socketServer = new Server(httpServer);  

socketProducts(socketServer);


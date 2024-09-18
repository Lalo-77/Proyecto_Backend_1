import productsRouter from "./routes/products.router.js";  
import handlebars from "express-handlebars";  
import __dirname from "./utils.js";  
import express from "express";  
import { Server } from "socket.io";  
import viewsRouter from "./routes/views.router.js"; 
import cartsRouter from "./routes/carts.router.js";

const app = express();  
const PORT = 8080;  
const HOST = "localhost";   

app.engine('handlebars', handlebars.engine());  
app.set('views', `${__dirname}/views`); 
app.set('view engine', 'handlebars');  

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

app.use(express.static(`${__dirname}/../public`));  
app.use("/", viewsRouter);  
app.use("/api/products", productsRouter);  
app.use("/api/carts", cartsRouter);


const httpServer = app.listen(8080, () => {  
    console.log(`Servidor corriendo en localhost:${PORT}`);  
}); 

const socketServer = new Server(httpServer);  

// servidor  
socketServer.on('connection', socket => {  
    console.log('Nuevo cliente conectado');  

    socket.on('eliminarProducto', (id) => {  
        const initialLength = products.length;  
        products = products.filter(p => p.id !== id);  
        if(products.length < initialLength) {  
            socket.emit('productos', products);  
        } else {  
            socket.emit('error', 'Producto no encontrado');  
        }  
    });  
    socket.on('disconnect', () => {  
        console.log('Cliente desconectado');  
    });  
}); 


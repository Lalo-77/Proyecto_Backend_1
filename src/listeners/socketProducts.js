import ProductManager from "../Dao/controllers/ProductManager.js";
import __dirname from "../utils.js";

const PM = new ProductManager(__dirname +'/Dao/database/products.json');

const socketProducts = (socketServer) => {
    // servidor  
    socketServer.on('connection', async socket => {
        console.log('nuevo cliente conectado');
        
        console.log('cliente conectado con ID:', socket.id)
        
        const listadeproductos = await PM.getProducts()

        socketServer.emit("enviodeproductos", listadeproductos)

        socket.on("addProduct", async (obj) => {
            PM.addProduct(obj)
            const listadeproductos = await PM.getProducts()
            socketServer.emit("enviodeproductos", listadeproductos)
        })

        socket.on("deleteProduct", async (id) => {

            PM.deleteProduct(id)
            const listadeproductos = await PM.getProducts()
            socketServer.emit("enviodeproductos", listadeproductos)
        })

    })

};
export default socketProducts;
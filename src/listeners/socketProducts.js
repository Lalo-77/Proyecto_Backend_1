import ProductsManager from "../controllers/ProductsManager.js";
import __dirname from "../utils.js";

const PM = new ProductsManager(__dirname + "/files/products.json");

const socketProducts = (socketServer) => {
    socketServer.on("connection", async(socket) => {
        console.log("cliente conectado con el Id:", socket.id)
        const listadeproductos = await PM.getProducts();
        socket.Server.emit("enviodeproductos", listadeproductos)

        socket.on("addProduct", async (obj) => {
            await PM.addProduct(obj)
            const listadeproductos =await PM.getProducts()
            socketServer.emit("enviodeproductos", listadeproductos)
            console.log(listadeproductos);
            
        })

       socket.on("deleteProduct", async(id) =>{
        await PM.deleteProduct(id)
        const listadeproductos =await PM.getProducts()
        socketServer.emit("enviodeproductos", listadeproductos)
       })
        
    })
};

export default socketProducts;
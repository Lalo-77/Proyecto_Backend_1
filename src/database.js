import mongoose from "mongoose";

mongoose.connect("mongodb+srv://crisn3682:coderhouse@cluster0.xqijc.mongodb.net/shop-cars?retryWrites=true&w=majority&appName=Cluster0", {
userNeTopology: true,
}) 
.then(() => console.log("Conexion exitosa!"))
.catch((err) => console.log("Error de conexion a la base de datos:", err)); 

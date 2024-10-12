import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({  
    name: String,  
    price: Number,  
    category: String,  
    availability: Boolean,  
});  

const ProductoModel = mongoose.model("Producto", productoSchema);
export default ProductoModel;
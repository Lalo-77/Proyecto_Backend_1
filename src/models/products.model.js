import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const productoSchema = new mongoose.Schema({  
    title: {  
        type: String,
        index: true,  
        required: true,  
        unique: true
    },
    description: {
       type: String,
       required: true
    },
    price: {  
        type: Number,  
        required: true,  
        min: 0 
    },  
    category: {  
        type: String,  
        required: true  
    },  
    code: {  
        type: Number,  
        required: true   
    },
});

productoSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, productoSchema);
export default productModel;  
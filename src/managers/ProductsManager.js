import fs from "fs";

class ProductManager {
    constructor() {
        this.products = [];
        this.codeId = 0;
    }
    // agrega un producto
    addProduct ( title, description, price, thumbnail, code, stock ) {

        if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.log(" Error: Ya existe un producto con el mismo código");
            return;
        }

        const product = {
            id: this.codeId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(product);
    }

    getProducts = async (id, title, description, price, thumbnail, code, stock) => {

        const nuevoProducto = {id, title, description, price, thumbnail, code, stock};

        const product = this.addProduct() ?? [];
        product.push(nuevoProducto);

        await this.addProduct(product);
    }
    // obtener producto  por Id
    getProductById(id) {
        const product = this.products.find(product => product.id === id);

        if (product) {
            return product;
        } else {
            console.log("Producto no encontrado");
        }
    }
   //actualiza un producto
    updateProduct(id, product) {
        const products = this.getProducts
        let UpdateProduct = {};
        if (index === -1) {
            products[index] = { ...updateProduct, id };
            fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
        }
        return this.products[index]
    }
    //Elimina un producto
    deleteProduct(id) {
        const arrayIndex = this.products.findIndex(product => product.id !== id)
        if (arrayIndex === -1) throw new Error(`El producto con ID ${id} no existe`)
        this.products.splice(arrayIndex, 1)
}
    }

export default ProductManager;
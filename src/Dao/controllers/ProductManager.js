import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path; // Ruta para el almacenamiento de archivos  
    this.products = [];
    this.codeId = 0;
    this.loadProducts(); // Cargar productos desde el archivo en la inicialización  
  }
  // Obtener todos los productos  
  getProducts = async (info = {}) => {
    try {
      const { limit = null } = info;

      if (fs.existsSync(this.path)) {

        const productlist = await fs.promises.readFile(this.path, "utf-8");
        const productlistJs = JSON.parse(productlist);
        if (limit) {
          const limitProducts = productlistJs.slice(0, parseInt(limit));
          return limitProducts;
        } else {
          return productlistJs;
        }
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw new Error("No se pudo obtener la lista de productos");
    }
  };

  // Cargar productos desde el archivo  
  loadProducts() {
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
      this.codeId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 0;
    }
  }

  // Agregar un producto  
  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || price === undefined || !thumbnail || !code || stock == null) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some(product => product.code === code)) {
      console.log("Error: Ya existe un producto con el mismo código");
      return;
    }

    const product = {
      id: this.codeId++,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock
    };

    this.products.push(product);
    this.saveProducts(); // Guardar productos en archivo después de agregarlos  
  }

  // Obtener producto por Id  
  getProductById(id) {
    try {
      const product = this.products.find(product => product.id === id);
      if (product) {
        return product;
      } else {
        console.log("Producto no encontrado");
      }
    } catch (error) {
      console.log(error);
    }
  }
  // Actualizar un producto  
  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      console.log(`El producto con ID ${id} no existe`);
      return;
    }
    this.products[index] = { ...this.products[index], ...updatedProduct };
    this.saveProducts(); // Guardar productos en archivo después de actualizar  
    return this.products[index];
  }

  // Eliminar un producto  
  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) throw new Error(`El producto con ID ${id} no existe`);
    this.products.splice(index, 1);
    this.saveProducts(); // Guardar productos en archivo después de eliminar  
  }

  // Guardar productos en archivo  
  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }
}

export default ProductManager;
const socketClient = io();

socketClient.on("enviodeproductos", (obj) => {
    uppdateProductList(obj)
})
function  uppdateProductList(productList) {

    const productosHome = document.getElementById("list-products")

    let productosHTML = "";

    productList.forEach((product) => {
        productosHTML += `<div class="card ">
        <div class="cart-header "> code:${product.code}</div>
        <div class="card-body>
            <h4 class="card-title">${product.title}</h4>
            <p class="card-text">
            <ul class="card-text">
            <li>id: ${product.id}</li>
            <li>description: ${product.description}</li>
            <li>price: ${product.price}</li>
            <li>category: ${product.category}</li>
            <li>status: ${product.status}</li>
            <li>stock: ${product.stock}</li>
            thumbnail: <img src="${product.thumbnail}">   </ul>
            </p>
            </div>
            <div class="">
            <button type="button" class="btn btn-danger delete-btn" onclick="deleteProduct(${product.id})">Eliminar</button>
            </div>
        </div>
    </div>`;
           });

           productosHome.innerHTML = productosHTML;
    }

    let form = document.getElementById("formProduct");
  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
  
    let title = form.elements.title.value;
    let description = form.elements.description.value;
    let stock = form.elements.stock.value;
    let thumbnail = form.elements.thumbnail.value;
    let category = form.elements.category.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;
    let status = form.elements.status.checked; // Obtiene el valor del checkbox
  
    socketClient.emit("addProduct", {
      title,
      description,
      stock,
      thumbnail,
      category,
      price,
      code,
      status, // Agrega el campo status al objeto enviado al servidor
  
    });
  
    form.reset();
  });

   //para eliminar por ID
document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleteid = parseInt(deleteidinput.value);
    socketClient.emit("deleteProduct", deleteid);
    deleteidinput.value = "";
  })



//para eliminar el producto directamente 
function deleteProduct(productId) {
  socketClient.emit("deleteProduct", productId);
}
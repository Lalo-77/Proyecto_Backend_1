<!DOCTYPE html>  
<html lang="es">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>Productos en Tiempo Real</title>  
    <script src="/socket.io/socket.io.js"></script>  
    <script> 

    const socket = io();  

// Escuchar eventos de nuevos productos  
socket.on('updateProducts', (products) => {  
    const productList = document.getElementById('productList');  
    productList.innerHTML = ''; // Limpiar la lista  

    products.forEach(product => {  
        const li = document.createElement('li');  
        li.textContent = `${product.name} - $${product.price}`;  
        productList.appendChild(li);  
    });  
});  

function addProduct(event) {  
    event.preventDefault();  
    const name = document.getElementById('productName').value;  
    const price = document.getElementById('productPrice').value;  

    // Emitir evento para agregar producto  
    socket.emit('addProduct', { name, price });  
    document.getElementById('productName').value = '';  
    document.getElementById('productPrice').value = '';  
}  





    </script>  
</head>  
<body>  
    <h1>Productos en Tiempo Real</h1>  
    <ul id="productList">  
        {{#each products}}  
            <li>{{this.name}} - ${{this.price}}</li>  
        {{/each}}  
    </ul>  
    <form onsubmit="addProduct(event)">  
        <input type="text" id="productName" placeholder="Nombre del producto" required>  
        <input type="number" id="productPrice" placeholder="Precio" required>  
        <button type="submit">Agregar Producto</button>  
    </form>  
</body>  
</html>
// cliente

const socket = io();
 
socket.on("productsAnder", data => {
   console.log(data);
   
    });


/*function agregarProducto() {  
    const nombre = document.getElementById('nombreProducto').value;  
    const nuevoProducto = { id: Date.now(), nombre }; 
    socket.emit('agregarProducto', nuevoProducto);  
    document.getElementById('nombreProducto').value = '';   
}  

function eliminarProducto(id) {  
    socket.emit('eliminarProducto', id);  
}  
  
socket.on('productos', (productos) => {  
    const listaProductos = document.getElementById('lista-productos');  
    listaProductos.innerHTML = ''; 

    productos.forEach(producto => {  
        const li = document.createElement('li');  
        li.textContent = producto.nombre;  
        const btn = document.createElement('button');  
        btn.textContent = 'Eliminar';  
        btn.onclick = () => eliminarProducto(producto.id);  
        li.appendChild(btn);  
        listaProductos.appendChild(li);  
    });  
});*/




const customerName = document.getElementById("customerName").value;
const direccionEnvio = document.getElementById("direccionEnvio").value;

let total = 0;

document.addEventListener("DOMContentLoaded", cargarProductos);

function cargarProductos() {
    fetch("/productos")
        .then(response => response.json())
        .then(data => {
            const catalogo = document.getElementById("catalogo");
            catalogo.innerHTML = "";  // Limpia el catálogo
    
            data.forEach(producto => {
                const productoDiv = document.createElement("div");
                productoDiv.classList.add("producto");
                productoDiv.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p>Precio: S/${producto.precio}</p>
                    <button onclick="agregarAlCarrito('${producto.nombre}', '${producto.imagen}', ${producto.precio})">Agregar al carrito</button>
                `;
                catalogo.appendChild(productoDiv);
            });
        })
        .catch(error => console.error("Error al cargar productos:", error));
}

function agregarAlCarrito(nombre, imagen, precio) {
    const listaCarrito = document.getElementById("lista-carrito");
    const item = document.createElement("li");
    item.innerHTML = `
        <img src="${imagen}" alt="${nombre}">
        <span>${nombre} - S/${precio}</span>
        <button onclick="eliminarDelCarrito(this, ${precio})">Eliminar</button>
    `;
    listaCarrito.appendChild(item);

    total += precio;
    actualizarTotal();
}

function eliminarDelCarrito(elemento, precio) {
    const item = elemento.parentElement;
    item.remove();
    total -= precio;
    actualizarTotal();
}

function actualizarTotal() {
    document.getElementById("total").textContent = `Total a pagar: S/${total}`;
}

function pagar() {
    const productos = [];
    const customerName = document.getElementById("customerName").value;
    const direccionEnvio = document.getElementById("direccionEnvio").value;
    const correo = document.getElementById("correo").value;

    document.querySelectorAll("#lista-carrito li").forEach(item => {
        const nombre = item.querySelector("span").textContent.split(" - ")[0];
        const precio = parseFloat(item.querySelector("span").textContent.split("S/")[1]);
        productos.push({ nombre, precio, cantidad: 1 });
    });

    fetch("http://localhost:3000/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerName,
            productos,
            estado: "pendiente",
            total,
            fecha: new Date(),
            direccionEnvio,
            correo
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Pedido guardado en la base de datos');
        document.getElementById("lista-carrito").innerHTML = ""; // Limpia el carrito
        total = 0;
        actualizarTotal();
    })
    .catch(error => console.error("Error al procesar el pedido:", error));
    // Guardar información en localStorage
    localStorage.setItem("productos", JSON.stringify(productos));
    localStorage.setItem("customerName", customerName);
    
    // Redirigir a la página de pago
    window.location.href = 'pagoyape.html';
}



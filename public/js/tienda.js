let total = 0;

document.addEventListener("DOMContentLoaded", cargarProductos);

function cargarProductos() {
    fetch("/productos")  // Asegúrate de que esta ruta esté correcta y accesible desde el frontend
        .then(response => {
            // Verifica si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error("Error al cargar los productos");
            }
            return response.json();
        })
        .then(data => {
            const catalogo = document.getElementById("catalogo");
            catalogo.innerHTML = "";  // Limpia el catálogo antes de agregar nuevos productos
    
            // Recorre la lista de productos y los agrega al catálogo
            data.forEach(producto => {
                const productoDiv = document.createElement("div");
                productoDiv.classList.add("producto");
                productoDiv.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p>Precio: S/${producto.precio}</p>
                    <button onclick="agregarAlCarrito('${producto.nombre}', '${producto.imagen}', ${producto.precio}, '${producto._id}')">Agregar al carrito</button>
                `;
                catalogo.appendChild(productoDiv);
            });
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
            alert("Hubo un error al cargar los productos. Inténtalo nuevamente más tarde.");
        });
}


function agregarAlCarrito(nombre, imagen, precio, id) {
    const listaCarrito = document.getElementById("lista-carrito");

    // Validar el ID antes de proceder
    if (!id || id.length !== 24) { // Verifica que 'id' sea válido
        console.error("ID inválido detectado en el frontend:", id);
        return; // Sale de la función si el ID no es válido
    }

    // Crear el elemento dinámico para el carrito
    const item = document.createElement("li");
    item.setAttribute("data-producto-id", id);
    item.innerHTML = `
        <img src="${imagen}" alt="${nombre}">
        <span>${nombre} - S/${precio}</span>
        <button onclick="eliminarDelCarrito(this, ${precio})">Eliminar</button>
    `;
    listaCarrito.appendChild(item);

    // Recuperar el carrito desde localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Agregar el producto completo al carrito (no solo el ID)
    carrito.push({ nombre, imagen, precio, id });
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar el total
    total += precio;
    actualizarTotal();
}



function actualizarTotal() {
    document.getElementById("total").textContent = `Total a pagar: S/${total}`;
}

function eliminarDelCarrito(boton, precio) {
    const item = boton.parentElement;
    const id = item.getAttribute("data-producto-id");
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(productId => productId !== id); // Elimina el producto del carrito
    localStorage.setItem("carrito", JSON.stringify(carrito));
    item.remove();
    total -= precio;
    actualizarTotal();
}


async function pagar() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const productIds = carrito.map(producto => producto.id).filter(id => id && id.length === 24);

    if (productIds.length === 0) {
        alert("No se seleccionaron productos válidos.");
        return;
    }

    try {
        const response = await fetch("/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productIds })  // El `userId` se obtiene automáticamente desde la sesión
        });

        if (!response.ok) {
            throw new Error("Error al procesar el pago.");
        }

        const data = await response.json();

        if (data.success) {
            localStorage.removeItem("carrito");
            alert("Orden creada con éxito");
            window.location.href = data.init_point;
        } else {
            alert("Error al crear la orden.");
        }

    } catch (error) {
        console.error("Error al procesar la orden:", error);
        alert("Hubo un error al procesar tu orden. Intenta nuevamente.");
    }
}







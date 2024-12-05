let total = 0;

document.addEventListener("DOMContentLoaded", function() {
    cargarProductos();
});

function cargarProductos() {
    fetch("/productos")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar los productos");
            }
            return response.json();
        })
        .then(data => {
            const catalogo = document.getElementById("catalogo");
            if (!catalogo) {
                console.error("Elemento con id 'catalogo' no encontrado");
                return;
            }
            catalogo.innerHTML = ""; // Limpia el catálogo antes de agregar nuevos productos

            // Recorre la lista de productos y los agrega al catálogo
            data.forEach(producto => {
                const productoDiv = document.createElement("div");
                productoDiv.classList.add("producto");
                productoDiv.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p>Precio: S/${producto.precio}</p>
                    <div class="botones-container">
                        <button class="btn-agregar-carrito" onclick="agregarAlCarrito('${producto.nombre}', '${producto.imagen}', ${producto.precio}, '${producto._id}')"><svg xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24" fill="none" stroke="currentColor"  strokelinecap="round" strokelinejoin="round" width={24} height={24}  strokeWidth={2}> <path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path> <path d="M12.5 17h-6.5v-14h-2"></path> <path d="M6 5l14 1l-.86 6.017m-2.64 .983h-10.5"></path> <path d="M16 19h6"></path> <path d="M19 16v6"></path> </svg> </button>
                        <button class="btn-ver-mas" onclick="verMas('${producto._id}')">Ver más</button>
                        <button class="btn-agregar-deseos" onclick="agregarAListaDeseos('${producto.nombre}', '${producto.imagen}', ${producto.precio}, '${producto._id}')"><svg xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24" fill="none" stroke="currentColor"  strokelinecap="round" strokelinejoin="round" width={24} height={24}  strokeWidth={2}> <path d="M19 8h-14"></path> <path d="M5 12h9"></path> <path d="M11 16h-6"></path> <path d="M15 16h6"></path> <path d="M18 13v6"></path> </svg> </button>
                    </div>
                `;
                catalogo.appendChild(productoDiv);
            });
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
            alert("Hubo un error al cargar los productos. Inténtalo nuevamente más tarde.");
        });
}

function verMas(id) {
    window.location.href = `/libro/${id}`; 
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






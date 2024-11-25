document.addEventListener("DOMContentLoaded", cargarPedidos);

function cargarPedidos() {
    fetch("http://localhost:3000/pedidos") // Ajusta la URL si es diferente
        .then(response => response.json())
        .then(data => {
            mostrarPedidosEnTabla(data);
        })
        .catch(error => console.error("Error al cargar pedidos:", error));
}

function mostrarPedidosEnTabla(pedidos) {
    const tablaPedidos = document.getElementById("tabla-pedidos").querySelector("tbody");
    tablaPedidos.innerHTML = ""; // Limpiar la tabla antes de agregar los pedidos

    pedidos.forEach(pedido => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${pedido.customerName}</td>
            <td>
                ${pedido.productos.map(p => `${p.nombre} (x${p.cantidad})`).join(", ")}
            </td>
            <td>S/${pedido.total.toFixed(2)}</td>
            <td>${new Date(pedido.fecha).toLocaleDateString()}</td>
            <td>${pedido.estado}</td>
            <td>
                <select onchange="actualizarEstadoPedido('${pedido._id}', this.value)">
                    <option value="pendiente" ${pedido.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
                    <option value="procesado" ${pedido.estado === "procesado" ? "selected" : ""}>Procesado</option>
                    <option value="entregado" ${pedido.estado === "entregado" ? "selected" : ""}>Entregado</option>
                </select>
            </td>
            <td>${pedido.direccionEnvio}</td>
            <td>${pedido.correo}</td>
        `;

        tablaPedidos.appendChild(fila);
    });
}

function actualizarEstadoPedido(idPedido, nuevoEstado) {
    fetch(`http://localhost:3000/pedidos/${idPedido}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || "Estado del pedido actualizado");
    })
    .catch(error => console.error("Error al actualizar el estado del pedido:", error));
}

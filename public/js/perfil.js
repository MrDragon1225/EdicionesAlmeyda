function loadOrderHistory() {
    fetch('/orders')
      .then(res => res.json())
      .then(data => {
        console.log(data); // Asegúrate de que los datos se están obteniendo
        const container = document.getElementById('order-history');
        if (data.length === 0) {
          container.innerHTML = "<p>No tienes compras registradas.</p>";
        } else {
          data.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order'); // Clase para cada orden
  
            // Añadir una clase según el estado de la orden
            const orderStatusClass = 'status-' + order.status.toLowerCase();
            orderDiv.classList.add(orderStatusClass); // Clase dinámica para el estado
  
            // Crear el contenido HTML de la orden
            orderDiv.innerHTML = `
              <div class="order-header">
                <p><strong>Orden ID:</strong> ${order._id}</p>
                <p><strong>Total:</strong> S/${order.totalAmount}</p>
                <p><strong>Estado:</strong> ${order.status}</p>
                <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <ul class="order-items">
                ${order.products.map(p => `
                  <li class="order-item">
                    <span><strong>${p.title}</strong> (x${p.quantity}) - S/${p.unit_price}</span>
                  </li>
                `).join('')}
              </ul>
            `;
  
            container.appendChild(orderDiv);
          });
        }
      })
      .catch(err => console.error(err));
  }
  
  
  
  // Llamada a la función para cargar el historial de órdenes al cargar la página
  loadOrderHistory();
  

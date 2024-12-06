function Seccion() {
    document.addEventListener("DOMContentLoaded", () => {
        const razonSelect = document.getElementById("section");
        const otrosContainer = document.getElementById("other-section");
        const contactForm = document.getElementById("contact-form");
        const successMessage = document.getElementById("success-message");

        // Mostrar u ocultar el campo "Otros" según la selección
        razonSelect.addEventListener("change", () => {
            otrosContainer.style.display = razonSelect.value === "otros" ? "block" : "none";
        });

        // Manejo del envío del formulario con AJAX
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();  // Evitar la redirección

            const formData = new FormData(contactForm);

            // Enviar los datos con fetch
            fetch("/enviar-contacto", {
                method: "POST",
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        successMessage.style.display = "block";  // Mostrar mensaje de éxito
                        contactForm.reset();  // Limpiar el formulario
                        otrosContainer.style.display = "none";  // Ocultar campo de "Otros"
                    } else {
                        alert("Hubo un error al enviar el formulario.");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Error al enviar el formulario.");
                });
        });
    });
}

Seccion();
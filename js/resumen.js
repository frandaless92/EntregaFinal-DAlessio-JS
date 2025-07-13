const contenedor = document.getElementById("contenedor-resumen");
const totalContainer = document.getElementById("total-resumen");
let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

function renderTurnos() {
  contenedor.innerHTML = "";
  totalContainer.innerHTML = "";

  if (turnos.length === 0) {
    contenedor.innerHTML =
      "<p class='text-white'>No hay turnos registrados.</p>";
    return;
  }

  let total = 0;

  turnos.forEach((t, i) => {
    total += t.precio;

    const card = document.createElement("div");
    card.className = "card mb-4 shadow-sm";
    card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Turno #${i + 1}</h5>
          <p><strong>Cliente:</strong> ${t.cliente.nombre} ${
      t.cliente.apellido
    }</p>
          <p><strong>Teléfono:</strong> ${t.cliente.telefono}</p>
          <p><strong>E-Mail:</strong> ${t.cliente.email}</p>
          <p><strong>Servicio:</strong> ${t.servicio} ($${t.precio})</p>
          <p><strong>Día y Hora:</strong> ${t.dia} a las ${t.hora}</p>
          <div class="text-end">
            <button class="btn btn-danger btn-sm" data-index="${i}">Eliminar</button>
          </div>
        </div>
      `;
    contenedor.appendChild(card);
  });

  totalContainer.innerHTML = `
      <div class="alert alert-primary mt-4 text-end">
        <strong>Total a pagar:</strong> $${total}
      </div>
      <div class="row m-1">
        <button type="button" id="btn-confirm-cita" class="btn btn-success">
              Confirmar Cita
        </button>
      </div>
    `;

  // Asignar evento a cada botón "Eliminar"
  document.querySelectorAll("button[data-index]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      eliminarTurno(index);
    });
  });

  document.getElementById("btn-confirm-cita").addEventListener("click", () => {
    Swal.fire({
      icon: "success",
      title: "¡Muchas Gracias!",
      html: "Los comprobantes de reserva serán enviados a las casillas de E-Mail.<br><br>Te esperamos en Yanel Lagares y Abru Nails!!!",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      localStorage.setItem("turnos", JSON.stringify([]));
      window.location.href = "../../index.html";
    });
  });
}

function eliminarTurno(index) {
  // Eliminar el turno del array
  turnos.splice(index, 1);
  // Guardar el nuevo array en localStorage
  localStorage.setItem("turnos", JSON.stringify(turnos));
  // Volver a renderizar
  renderTurnos();
}

renderTurnos();

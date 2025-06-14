const servicios = [
  { id: 1, nombre: "Depilación completa", precio: 15000 },
  { id: 2, nombre: "Limpieza facial", precio: 10000 },
  { id: 3, nombre: "Manicura semipermanente", precio: 10000 },
  { id: 4, nombre: "Masajes descontracturantes", precio: 18000 },
  { id: 5, nombre: "Uñas esculpidas", precio: 12000 },
  { id: 6, nombre: "Pedicura", precio: 12500 },
];

const diasDisponibles = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const horariosDisponibles = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
];

let turnosReservados = [];

document.addEventListener("DOMContentLoaded", () => {
  renderServicios();
  renderDias();
  renderHorarios();

  document.getElementById("dia").addEventListener("change", actualizarHorarios);

  document
    .getElementById("formulario-turno")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      procesarReserva();
    });
});

function renderServicios() {
  const contenedor = document.getElementById("lista-servicios");

  let html = '<div class="row gx-3 gy-3">';

  servicios.forEach((serv) => {
    html += `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${serv.nombre}</h5>
          <p class="card-text">Precio: $${serv.precio}</p>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${serv.id}" id="serv-${serv.id}">
            <label class="form-check-label" for="serv-${serv.id}">
              Seleccionar
            </label>
          </div>
        </div>
      </div>
    </div>`;
  });

  html += "</div>";

  contenedor.innerHTML = html;
}

function renderDias() {
  const select = document.getElementById("dia");
  diasDisponibles.forEach((dia) => {
    const option = document.createElement("option");
    option.value = dia;
    option.textContent = dia;
    select.appendChild(option);
  });
}

function renderHorarios(horarios = horariosDisponibles) {
  const select = document.getElementById("hora");
  select.innerHTML = "";
  horarios.forEach((hora) => {
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;
    select.appendChild(option);
  });
}

function actualizarHorarios() {
  const diaElegido = document.getElementById("dia").value;
  const horariosLibres = horariosDisponibles.filter(
    (hora) =>
      !turnosReservados.find((t) => t.dia === diaElegido && t.hora === hora)
  );
  renderHorarios(horariosLibres);
}

function procesarReserva() {
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const telefono = document.getElementById("telefono").value.trim();

  const serviciosElegidos = Array.from(
    document.querySelectorAll("#lista-servicios input:checked")
  ).map((input) => servicios.find((s) => s.id == input.value));

  const dia = document.getElementById("dia").value;
  const hora = document.getElementById("hora").value;

  if (!nombre || !apellido || serviciosElegidos.length === 0) {
    alert("Por favor completá los datos y elegí al menos un servicio.");
    return;
  }

  const turnoSeleccionado = { dia, hora };

  // Guardar el turno
  turnosReservados.push(turnoSeleccionado);

  // Mostrar resumen con datos actuales
  const cliente = { nombre, apellido, telefono };
  mostrarResumenModal(cliente, serviciosElegidos, turnoSeleccionado);
}

function mostrarResumenModal(cliente, serviciosSeleccionados, turno) {
  const resumenContainer = document.getElementById("contenido-resumen");

  const serviciosHTML = serviciosSeleccionados
    .map((serv) => `<li>${serv.nombre} ($${serv.precio})</li>`)
    .join("");

  const total = serviciosSeleccionados.reduce(
    (acc, serv) => acc + serv.precio,
    0
  );

  resumenContainer.innerHTML = `
    <p><strong>Cliente:</strong> ${cliente.nombre} ${cliente.apellido}</p>
    <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
    <p><strong>Servicios seleccionados:</strong></p>
    <ul>${serviciosHTML}</ul>
    <p><strong>Turno:</strong> ${turno.dia} a las ${turno.hora}</p>
    <p><strong>Total a pagar:</strong> $${total}</p>
  `;

  const modal = new bootstrap.Modal(document.getElementById("resumenModal"));
  modal.show();
}

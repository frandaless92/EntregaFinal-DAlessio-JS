const servicios = [
  { id: 1, nombre: "Depilación completa", precio: 15000 },
  { id: 2, nombre: "Limpieza facial", precio: 10000 },
  { id: 3, nombre: "Manicura semipermanente", precio: 10000 },
  { id: 4, nombre: "Masajes descontracturantes", precio: 18000 },
  { id: 5, nombre: "Uñas esculpidas", precio: 12000 },
  { id: 6, nombre: "Pedicura", precio: 12500 },
];

let diasDisponibles = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
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
      // Redirigir a la página resumen
      window.location.href = "resumen.html";
    });

  document
    .getElementById("btn-agregar-servicio")
    .addEventListener("click", () => {
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
            <input class="form-check-input" type="radio" name="servicio" value="${serv.id}" id="serv-${serv.id}">
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
  select.innerHTML = "";
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
  if (horariosLibres.length === 0) {
    const index = diasDisponibles.indexOf(diaElegido);
    if (index > -1) {
      diasDisponibles.splice(index, 1);
    }
    renderDias();

    const selectDia = document.getElementById("dia");

    if (diasDisponibles.length > 0) {
      // Seleccionar el primer día disponible
      selectDia.value = diasDisponibles[0];
      actualizarHorarios(); // Actualizar horarios para el nuevo día seleccionado
    } else {
      // Si no quedan días, deshabilitar el select
      selectDia.disabled = true;
      renderHorarios([]); // No hay horarios para mostrar
    }
    return;
  }

  renderHorarios(horariosLibres);
}

function procesarReserva() {
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const telefono = document.getElementById("telefono").value.trim();

  const seleccionado = document.querySelector('input[name="servicio"]:checked');
  const servicio = seleccionado
    ? servicios.find((s) => s.id == seleccionado.value)
    : null;

  const dia = document.getElementById("dia").value;
  const hora = document.getElementById("hora").value;

  if (!nombre || !apellido || !servicio || !dia || !hora) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor completá todos los campos y seleccioná un servicio.",
    });
    return;
  }

  const nuevoTurno = {
    cliente: { nombre, apellido, telefono },
    servicio: servicio.nombre,
    precio: servicio.precio,
    dia,
    hora,
  };

  // Obtener los turnos anteriores del localStorage
  const turnosGuardados = JSON.parse(localStorage.getItem("turnos")) || [];

  // Agregar el nuevo turno
  turnosGuardados.push(nuevoTurno);

  // Guardar de nuevo en localStorage
  localStorage.setItem("turnos", JSON.stringify(turnosGuardados));

  Swal.fire({
    icon: "success",
    title: "¡Servicio agregado!",
    text: "El servicio fue agregado correctamente.",
    timer: 2000,
    showConfirmButton: false,
  });

  const turnoSeleccionado = { dia, hora };

  // Guardar el turno
  turnosReservados.push(turnoSeleccionado);
  actualizarHorarios();
}

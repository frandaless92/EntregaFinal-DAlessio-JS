let diasDisponibles = [];

let servicios = [];

renderServicios();
renderDiasyHorarios();

document.getElementById("nombre").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ´'\s]/g, "");
});

document.getElementById("apellido").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ´'\s]/g, "");
});

document.getElementById("telefono").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^\d]/g, "");
});

document.getElementById("formulario-turno").addEventListener("submit", (e) => {
  e.preventDefault();
  // Redirigir a la página resumen
  window.location.href = "resumen.html";
});

document
  .getElementById("btn-agregar-servicio")
  .addEventListener("click", () => {
    procesarReserva();
  });

function parseDateFromISO(isoString) {
  const [year, month, day] = isoString.split("-").map(Number);
  return new Date(year, month - 1, day); // mes es base 0
}

async function renderServicios() {
  const contenedor = document.getElementById("lista-servicios");
  try {
    const response = await fetch("../data/servicios.json");
    if (!response.ok)
      throw new Error("No se pudo cargar la lista de servicios.");
    servicios = await response.json();

    let html = '<div class="row gx-3 gy-3">';

    servicios.forEach((serv) => {
      html += `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm servicio-card">
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
  } catch (error) {
    contenedor.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
  }
}

async function renderDiasyHorarios() {
  const selectDia = document.getElementById("dia");
  const selectHora = document.getElementById("hora");

  try {
    const guardado = localStorage.getItem("diasDisponibles");

    if (guardado) {
      diasDisponibles = JSON.parse(guardado);
    } else {
      const response = await fetch("../data/diasDisponibles.json");
      if (!response.ok) throw new Error("No se pudo cargar el archivo de días");
      diasDisponibles = await response.json();
      // Guardar copia inicial
      localStorage.setItem("diasDisponibles", JSON.stringify(diasDisponibles));
    }

    if (diasDisponibles.length === 0) {
      selectDia.innerHTML =
        "<option disabled selected value=''>No hay días disponibles</option>";
      return;
    }

    const opciones = diasDisponibles.map((diaObj) => {
      const fecha = parseDateFromISO(diaObj.fecha);

      const diaNombre = fecha.toLocaleDateString("es-AR", { weekday: "long" });
      const diaCapitalizado =
        diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1);
      const fechaFormateada = fecha.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
      });

      return `<option value="${diaObj.fecha}">${diaCapitalizado} ${fechaFormateada}</option>`;
    });

    selectDia.innerHTML =
      "<option disabled selected value=''>Seleccione un día</option>" +
      opciones.join("");

    // Evento: cuando cambia el día, cargar horarios
    selectDia.addEventListener("change", () => {
      const fechaSeleccionada = selectDia.value;
      const dia = diasDisponibles.find((d) => d.fecha === fechaSeleccionada);

      if (dia) {
        const opcionesHora = dia.horarios.map(
          (hora) => `<option value="${hora}">${hora}</option>`
        );
        selectHora.innerHTML =
          "<option disabled selected value=''>Seleccione un horario</option>" +
          opcionesHora.join("");
        selectHora.disabled = false;
      } else {
        selectHora.innerHTML =
          "<option disabled selected>Sin horarios</option>";
        selectHora.disabled = true;
      }
    });
  } catch (error) {
    console.error("Error al cargar días:", error);
    selectDia.innerHTML =
      "<option disabled selected>Error al cargar los días</option>";
  }
}

function renderSelectsActualizados() {
  const selectDia = document.getElementById("dia");
  const selectHora = document.getElementById("hora");

  // Sin días disponibles
  if (diasDisponibles.length === 0) {
    selectDia.innerHTML =
      "<option disabled selected>No hay más turnos disponibles</option>";
    selectHora.innerHTML = "<option disabled selected>—</option>";
    selectHora.disabled = true;
    return;
  }

  // Cargar días
  const opciones = diasDisponibles.map((diaObj) => {
    const fecha = parseDateFromISO(diaObj.fecha);
    const diaNombre = fecha.toLocaleDateString("es-AR", { weekday: "long" });
    const diaCapitalizado =
      diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1);
    const fechaFormateada = fecha.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
    });

    return `<option value="${diaObj.fecha}">${diaCapitalizado} ${fechaFormateada}</option>`;
  });

  selectDia.innerHTML =
    "<option disabled selected>Seleccione un día</option>" + opciones.join("");

  // Reset horario
  selectHora.innerHTML =
    "<option disabled selected value=''>Seleccione un horario</option>";
  selectHora.disabled = true;

  // Evento: al cambiar día, cargar horarios disponibles
  selectDia.addEventListener("change", () => {
    const fechaSeleccionada = selectDia.value;
    const dia = diasDisponibles.find((d) => d.fecha === fechaSeleccionada);

    if (dia) {
      const opcionesHora = dia.horarios.map(
        (hora) => `<option value="${hora}">${hora}</option>`
      );
      selectHora.innerHTML =
        "<option disabled selected>Seleccione un horario</option>" +
        opcionesHora.join("");
      selectHora.disabled = false;
    } else {
      selectHora.innerHTML = "<option disabled selected>Sin horarios</option>";
      selectHora.disabled = true;
    }
  });
}

function procesarReserva() {
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const email = document.getElementById("email").value.trim();

  const seleccionado = document.querySelector('input[name="servicio"]:checked');
  const servicio = seleccionado
    ? servicios.find((s) => s.id == seleccionado.value)
    : null;

  const dia = document.getElementById("dia").value;
  const hora = document.getElementById("hora").value;

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValido.test(email)) {
    Swal.fire({
      icon: "error",
      title: "Email inválido",
      text: "Por favor ingresá un email válido (ej: nombre@dominio.com).",
    });
    return;
  }

  if (
    !nombre ||
    !apellido ||
    !telefono ||
    !email ||
    !servicio ||
    !dia ||
    !hora
  ) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor completá todos los campos, seleccioná un servicio, fecha y hora.",
    });
    return;
  }

  const nuevoTurno = {
    cliente: { nombre, apellido, telefono, email },
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

  // 🔴 Eliminar el horario seleccionado de diasDisponibles
  const diaObj = diasDisponibles.find((d) => d.fecha === dia);
  if (diaObj) {
    diaObj.horarios = diaObj.horarios.filter((h) => h !== hora);

    // Si ya no quedan horarios en ese día, eliminar el día completo
    if (diaObj.horarios.length === 0) {
      diasDisponibles = diasDisponibles.filter((d) => d.fecha !== dia);
    }
  }

  // 🔄 Volver a renderizar días y horarios actualizados
  renderSelectsActualizados();

  Swal.fire({
    icon: "success",
    title: "¡Servicio agregado!",
    text: "El servicio fue agregado correctamente.",
    timer: 2000,
    showConfirmButton: false,
  });

  localStorage.setItem("diasDisponibles", JSON.stringify(diasDisponibles));
}

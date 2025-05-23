// Declaración de objetos y arrays globales
// Array de servicios disponibles
const servicios = [
  { id: 1, nombre: "Depilación completa", precio: 15000 },
  { id: 2, nombre: "Limpieza facial", precio: 10000 },
  { id: 3, nombre: "Manicura semipermanente", precio: 10000 },
  { id: 4, nombre: "Masajes descontracturantes", precio: 18000 },
  { id: 5, nombre: "Uñas esculpidas", precio: 12000 },
  { id: 6, nombre: "Pedicura", precio: 12500 },
];

let cliente = {};
let agenda = [];
let turnoSeleccionado = {};
let turnosReservados = [];

// Función 1 - Entrada de datos del cliente con validación
function obtenerDatosCliente() {
  let nombre = "";
  let apellido = "";

  while (!nombre) {
    nombre = prompt("Ingrese su nombre:");
    if (!nombre) alert("No se ingresó ningún nombre, vuelva a intentarlo.");
  }

  while (!apellido) {
    apellido = prompt("Ingrese su apellido:");
    if (!apellido) alert("No se ingresó ningún apellido, vuelva a intentarlo.");
  }

  //El telefono puede estar vacío, por ahora no nos interesa
  const telefono = prompt("Ingrese su número de teléfono:");

  //Guardamos los datos en el objeto global
  cliente = {
    nombre,
    apellido,
    telefono,
  };

  //Vamos a ir mostrando el proceso con logs en la consola.
  console.log(
    `Cliente: ${cliente.nombre} ${cliente.apellido}. Teléfono: ${cliente.telefono}.`
  );
}

// Función 2 - Selección de servicios a contratar
function seleccionarServicios() {
  //Definición de la variable local para poder salir del condicional
  let seguir = true;

  while (seguir) {
    let listaServicios =
      "Seleccioná el servicio a reservar (ingresá el número):\n";
    servicios.forEach((servicio) => {
      listaServicios += `${servicio.id}. ${servicio.nombre} - $${servicio.precio}\n`;
    });

    console.log(listaServicios);

    //Capturamos el valor seleccionado y lo convertimos a integer
    const seleccion = parseInt(prompt(listaServicios));

    if (!isNaN(seleccion)) {
      const servicioElegido = servicios.find((s) => s.id === seleccion);

      console.log(
        "Servicio elegido: " +
          servicioElegido.id +
          " - " +
          servicioElegido.nombre
      );

      if (servicioElegido) {
        //Agregamos el servicio a nuestra agenda global
        agenda.push(servicioElegido);
        alert(
          `Perfecto! Tomamos nota y "${servicioElegido.nombre}" fue agregado a la reserva.`
        );
        console.log("Servicio agregado a la reserva.");
      } else {
        alert("No encontramos el servicio seleccionado. Volvé a intentarlo.");
      }
    } else {
      return;
    }

    const respuesta = confirm("¿Te gustaría agregar otro servicio?");

    seguir = respuesta;
  }
}

// Función 3 - Gestión de turnos
// Por ahora muy básica la reserva, es como para sumar una iteracción más con el cliente, pero la idea es que
// por cada servicio seleccione un turno de 30 min y poder ir almacenando eso en una base de datos al momento
// de quedar confirmada la reserva.

function seleccionarTurno() {
  const diasDisponibles = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const horariosDisponibles = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
  ];

  console.log(`Días disponibles: ${diasDisponibles.join(", ")}`);

  let diaElegido = prompt(
    "Seleccione un día para su turno:\n" + diasDisponibles.join(", ")
  );
  while (!diasDisponibles.includes(diaElegido)) {
    diaElegido = prompt(
      "Día inválido. Ingrese uno de los siguientes:\n" +
        diasDisponibles.join(", ")
    );
  }

  console.log(`Día seleccionado: ${diaElegido}`);

  // Obtenemos solo aquellos horarios que no estén ya reservados para ese día
  let horariosLibres = horariosDisponibles.filter((hora) => {
    return !turnosReservados.find(
      (t) => t.dia === diaElegido && t.hora === hora
    );
  });

  if (horariosLibres.length === 0) {
    alert(
      `No hay horarios disponibles para ${diaElegido}. Intente con otro día.`
    );
    return seleccionarTurno(); // Vuelve a empezar
  }

  let listaHorarios = "Horarios disponibles:\n";
  horariosLibres.forEach((hora) => (listaHorarios += `- ${hora}\n`));
  let horaElegida = prompt(
    `Seleccione un horario para su turno en ${diaElegido}:\n${listaHorarios}`
  );

  console.log(listaHorarios);

  while (!horariosLibres.includes(horaElegida)) {
    horaElegida = prompt(
      `Horario inválido o ya reservado. Seleccione uno de los siguientes:\n${listaHorarios}`
    );
  }

  console.log(`Horario seleccionado: ${horaElegida}`);

  // Guardamos el turno como reservado
  turnoSeleccionado = {
    dia: diaElegido,
    hora: horaElegida,
  };

  turnosReservados.push(turnoSeleccionado);
  alert(`Turno reservado para el ${diaElegido} a las ${horaElegida}.`);
}

// Función 4 - Mostrar resumen de reserva
function mostrarResumen() {
  let resumen = `Cliente: ${cliente.nombre} ${cliente.apellido}\n Teléfono: ${cliente.telefono}\n\n Servicios seleccionados:\n`;
  let total = 0;

  agenda.forEach((serv) => {
    resumen += `- ${serv.nombre} ($${serv.precio})\n`;
    total += serv.precio;
  });

  resumen += `\nTurno: ${turnoSeleccionado.dia} a las ${turnoSeleccionado.hora}`;
  resumen += `\nTotal a pagar: $${total}`;

  alert(resumen);
  console.log(resumen);
}

let continuar = true;

function ejecutarTurnera() {
  // Invocación a la funciones
  obtenerDatosCliente();

  //Denifimos un bucle para, en este caso, demostrar como los turnos ya seleccionados quedan guardados en memoria
  //en tiempo de ejecución
  while (continuar) {
    seleccionarServicios();
    //Manejamos el caso de que el cliente no haya seleccionado ningún servicio a reservar
    if (agenda.length !== 0) {
      seleccionarTurno();
      mostrarResumen();
    }
    // Pregunta si desea realizar otra reserva
    continuar = confirm("¿Querés hacer otra reserva?");
  }

  alert("Gracias por reservar con Yanel Lagares y Abru Nails!! Te esperamos!.");
}

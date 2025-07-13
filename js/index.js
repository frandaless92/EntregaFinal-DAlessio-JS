async function cargarTarjetasServicios() {
  const contenedor = document.getElementById("lista-servicios");

  try {
    const response = await fetch("./data/servicios.json");
    if (!response.ok) throw new Error("No se pudo cargar el archivo JSON.");
    const servicios = await response.json();

    let html = '<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">';

    servicios.forEach((serv) => {
      html += `
        <div class="col">
          <div class="card h-100">
            <img
              src="${serv.imagen}"
              class="card-img-top"
              alt="${serv.nombre}"
            />
            <div class="card-body">
              <h5 class="card-title">${serv.nombre}</h5>
              <p class="card-text">${serv.descripcion}</p>
            </div>
          </div>
        </div>
      `;
    });

    html += "</div>";
    contenedor.innerHTML = html;
  } catch (error) {
    contenedor.innerHTML = `<p class="text-danger">Error al cargar los servicios: ${error.message}</p>`;
  }
}

cargarTarjetasServicios();

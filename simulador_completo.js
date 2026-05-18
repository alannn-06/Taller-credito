
  let clientes = [];
  let creditos = [];

  let tasaInteres = 15;
  let clienteSeleccionado = null;
  let cuotaCalculada = 0;
  let montoCalculado = 0;
  let plazoCalculado = 0;
  let creditoAprobado = false;

  

function ocultarSecciones() {
    let secciones = document.querySelectorAll("section");
    
    secciones.forEach(function(seccion) {
        seccion.classList.remove("activa");
    });
}

function mostrarSeccion(id) {
    ocultarSecciones();

    let seccionObjetivo = document.getElementById(id);
    if (seccionObjetivo) {
        seccionObjetivo.classList.add("activa");
    }
}

function guardarTasa() {
    let tasaIngresada = recuperarFloat("tasaInteres");
    
    if (tasaIngresada >= 10 && tasaIngresada <= 20) {
        tasaInteres = tasaIngresada;
       
        mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasaInteres + "%");
    } else {
        mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
    }
}

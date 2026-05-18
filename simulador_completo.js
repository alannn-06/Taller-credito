
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

function guardarCliente() {

    let cedula = recuperaraTexto("txtCedula");
    let nombre = recuperaraTexto("txtNombre");
    let apellido = recuperaraTexto("txtApellido");
    let ingresos = recuperarInt("txtIngresos");
    let egresos = recuperarInt("txtEgresos");

    let nuevoCliente = {
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        ingresos: ingresos,
        egresos: egresos
    };

  
    clientes.push(nuevoCliente);

    pintarClientes();
}

function pintarClientes() {
    let tabla = document.getElementById("tablaClientes");
    tabla.innerHTML = "";

    clientes.forEach(function(cliente) {
        let fila = `
            <tr>
                <td>${cliente.cedula}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.ingresos}</td>
                <td>${cliente.egresos}</td>
                <td>
                    <button>Actualizar</button>
                </td>
            </tr>
        `;
      
        tabla.innerHTML += fila;
    });
}
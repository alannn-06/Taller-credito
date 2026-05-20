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
    let clienteExistente = buscarCliente(cedula);

    if (clienteExistente === null) {
        let nuevoCliente = {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            ingresos: ingresos,
            egresos: egresos
        };
        clientes.push(nuevoCliente);
    } else {
        clienteExistente.nombre = nombre;
        clienteExistente.apellido = apellido;
        clienteExistente.ingresos = ingresos;
        clienteExistente.egresos = egresos;
    }
    pintarClientes();
    limpiar();
}

function limpiar() {
    mostrarTextoEnCaja("txtCedula", "");
    mostrarTextoEnCaja("txtNombre", "");
    mostrarTextoEnCaja("txtApellido", "");
    mostrarTextoEnCaja("txtIngresos", "");
    mostrarTextoEnCaja("txtEgresos", "");
    
    document.getElementById("txtCedula").disabled = false;
    
    clienteSeleccionado = null;
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
                    <button onclick="seleccionarCliente('${cliente.cedula}')">Actualizar</button>
                    <button onclick="eliminarCliente('${cliente.cedula}')">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

function buscarCliente(cedula) {
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            return clientes[i]; 
        }
    }
    return null; 
}

function seleccionarCliente(cedula) {
    let clienteEncontrado = buscarCliente(cedula);
    
    if (clienteEncontrado !== null) {
        clienteSeleccionado = clienteEncontrado;
        
        mostrarTextoEnCaja("txtCedula", clienteSeleccionado.cedula);
        mostrarTextoEnCaja("txtNombre", clienteSeleccionado.nombre);
        mostrarTextoEnCaja("txtApellido", clienteSeleccionado.apellido);
        mostrarTextoEnCaja("txtIngresos", clienteSeleccionado.ingresos);
        mostrarTextoEnCaja("txtEgresos", clienteSeleccionado.egresos);
        
        document.getElementById("txtCedula").disabled = true;
    }
}

function buscarClienteCredito() {
    let cedulaBuscar = recuperaraTexto("buscarCedulaCredito");
    let clienteEncontrado = buscarCliente(cedulaBuscar);
    
    let contenedorDatos = document.getElementById("datosClienteCredito");
    
    if (clienteEncontrado !== null) {
        clienteSeleccionado = clienteEncontrado;

        contenedorDatos.innerHTML = `
            <h3>Datos del Cliente</h3>
            <p><strong>Cédula:</strong> ${clienteSeleccionado.cedula}</p>
            <p><strong>Nombre:</strong> ${clienteSeleccionado.nombre}</p>
            <p><strong>Apellido:</strong> ${clienteSeleccionado.apellido}</p>
            <p><strong>Ingresos:</strong> $${clienteSeleccionado.ingresos}</p>
            <p><strong>Egresos:</strong> $${clienteSeleccionado.egresos}</p>
        `;
    } else {
        clienteSeleccionado = null;
        contenedorDatos.innerHTML = `<p class="error-mensaje">El cliente con cédula "${cedulaBuscar}" no fue encontrado.</p>`;
    }
}

function calcularCredito() {
    let divResultado = document.getElementById("resultadoCredito");
    let btnSolicitar = document.getElementById("btnSolicitarCredito");

    if (clienteSeleccionado === null) {
        divResultado.innerHTML = "<p class='error-mensaje'>Debe buscar y seleccionar un cliente válido antes de calcular.</p>";
        btnSolicitar.disabled = true;
        return;
    }

    montoCalculado = recuperarFloat("montoCredito");
    plazoCalculado = recuperarInt("plazoCredito");

    if (isNaN(montoCalculado) || montoCalculado <= 0 || isNaN(plazoCalculado) || plazoCalculado <= 0) {
        divResultado.innerHTML = "<p class='error-mensaje'>Por favor ingrese un monto y un plazo válidos.</p>";
        btnSolicitar.disabled = true;
        return;
    }

    let capacidadPago = clienteSeleccionado.ingresos - clienteSeleccionado.egresos;
    let totalAPagar = montoCalculado + (montoCalculado * (tasaInteres / 100));
    cuotaCalculada = totalAPagar / plazoCalculado;

    if (cuotaCalculada <= capacidadPago) {
        creditoAprobado = true;
    } else {
        creditoAprobado = false;
    }

    let mensajeResultado = `
        Capacidad de pago: $${capacidadPago.toFixed(2)}<br>
        Total a pagar: $${totalAPagar.toFixed(2)}<br>
        Cuota mensual: $${cuotaCalculada.toFixed(2)}<br>
        RESULTADO: ${creditoAprobado ? "APROBADO" : "RECHAZADO"}
    `;
    divResultado.innerHTML = mensajeResultado;

    if (creditoAprobado) {
        divResultado.className = "aprobado";
        btnSolicitar.disabled = false; 
    } else {
        divResultado.className = "rechazado";
        btnSolicitar.disabled = true;  
    }
}

function pintarCreditos(arregloCreditos) {
    let tabla = document.getElementById("tablaCreditos");
    tabla.innerHTML = "";

    arregloCreditos.forEach(function(credito, indice) {
        let fila = `
            <tr>
                <td>${credito.cedula}</td>
                <td>${credito.nombre}</td>
                <td>${credito.apellido}</td>
                <td>$${parseFloat(credito.monto).toFixed(2)}</td>
                <td>${credito.tasa}%</td>
                <td>${credito.plazo} meses</td>
                <td>$${parseFloat(credito.cuota).toFixed(2)}</td>
                <td>
                    <button onclick="eliminarCredito(${indice})">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

function eliminarCredito(indice) {
    creditos.splice(indice, 1);
    pintarCreditos(creditos);
}

function buscarCreditosCliente() {
    let cedulaBuscar = recuperaraTexto("buscarCedulaListado");
    let creditosFiltrados = [];

    for (let i = 0; i < creditos.length; i++) {
        if (creditos[i].cedula === cedulaBuscar) {
            creditosFiltrados.push(creditos[i]);
        }
    }
    pintarCreditos(creditosFiltrados);
}

function solicitarCredito() {
    if (creditoAprobado === true && clienteSeleccionado !== null) {
        let credito = {
            cedula: clienteSeleccionado.cedula,
            nombre: clienteSeleccionado.nombre,
            apellido: clienteSeleccionado.apellido,
            monto: montoCalculado,
            tasa: tasaInteres,
            plazo: plazoCalculado,
            cuota: cuotaCalculada
        };

        creditos.push(credito);

        let divResultado = document.getElementById("resultadoCredito");
        divResultado.innerHTML += "<br><br><strong> Crédito asignado y registrado con exito</strong>";

        document.getElementById("btnSolicitarCredito").disabled = true;
        pintarCreditos(creditos);
        
    } else {
        alert("No se puede asignar un credito que no ha sido previamente aprobado");
    }
}

function eliminarCliente(cedula) {
    let tieneCreditos = false;
    for (let i = 0; i < creditos.length; i++) {
        if (creditos[i].cedula === cedula) {
            tieneCreditos = true;
            break;
        }
    }
    if (tieneCreditos) {
        alert("No se puede eliminar el cliente porque tiene créditos asociados");
        return; 
    }

    let posicion = -1;
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            posicion = i; 
            break;
        }
    }
    if (posicion !== -1) {
        clientes.splice(posicion, 1);
        
        pintarClientes();
    }
}
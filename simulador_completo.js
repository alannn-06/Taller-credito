  let clientes = [];
  let creditos = [];

  let tasaInteres = 15;
  let clienteSeleccionado = null;
  let cuotaCalculada = 0;
  let montoCalculado = 0;
  let plazoCalculado = 0;
  let creditoAprobado = false;
  let montoMaximoPermitido = 10000; 

  

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

    if (id === "seccionVIP") {
        pintarTablaVIP();
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
    let telefono = recuperaraTexto("txtTelefono"); 

    let clienteExistente = buscarCliente(cedula);

    if (clienteExistente === null) {
        let nuevoCliente = {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            ingresos: ingresos,
            egresos: egresos,
            telefono: telefono 
        };
        clientes.push(nuevoCliente);
    } else {
        clienteExistente.nombre = nombre;
        clienteExistente.apellido = apellido;
        clienteExistente.ingresos = ingresos;
        clienteExistente.egresos = egresos;
        clienteExistente.telefono = telefono; 
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
    mostrarTextoEnCaja("txtTelefono", ""); 
    
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
                <td>${cliente.telefono ? cliente.telefono : ""}</td> <td>
                    <button onclick="seleccionarCliente('${cliente.cedula}')">Actualizar</button>
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
        mostrarTextoEnCaja("txtTelefono", clienteSeleccionado.telefono ? clienteSeleccionado.telefono : ""); 
        
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
            <p><strong>Teléfono:</strong> ${clienteSeleccionado.telefono ? clienteSeleccionado.telefono : "No registrado"}</p>
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

    if (montoCalculado > montoMaximoPermitido) {
        divResultado.innerHTML = `<p class='error-mensaje'>Error: El monto solicitado ($${montoCalculado.toFixed(2)}) supera el monto máximo permitido ($${montoMaximoPermitido.toFixed(2)}).</p>`;
        divResultado.className = "rechazado";
        btnSolicitar.disabled = true;
        mostrarTextoEnCaja("montoCredito", "");
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

function solicitarCredito() {
    if (clienteSeleccionado === null || !creditoAprobado) {
        alert("No se puede solicitar: Debe seleccionar un cliente y el crédito debe estar APROBADO.");
        return;
    }
    let nuevoCredito = {
        cedula: clienteSeleccionado.cedula,
        monto: montoCalculado,
        plazo: plazoCalculado,
        cuota: cuotaCalculada
    };
    creditos.push(nuevoCredito);
    alert("Crédito solicitado con éxito para el cliente " + clienteSeleccionado.nombre + "");

    document.getElementById("resultadoCredito").innerHTML = "";
    document.getElementById("resultadoCredito").className = "";
    mostrarTextoEnCaja("montoCredito", "");
    mostrarTextoEnCaja("plazoCredito", "");
    document.getElementById("btnSolicitarCredito").disabled = true;
}

function guardarMontoMaximo() {
    let montoIngresado = recuperarFloat("txtMontoMaximo");
    
    if (!isNaN(montoIngresado) && montoIngresado > 0) {
        montoMaximoPermitido = montoIngresado;
        mostrarTexto("mensajeMontoMax", "Monto máximo configurado en: $" + montoMaximoPermitido.toFixed(2));
    } else {
        mostrarTexto("mensajeMontoMax", "Por favor, ingrese un monto válido mayor a 0.");
    }
}

function registrarCreditoAprobado() {
    if (clienteSeleccionado === null || !creditoAprobado) {
        return;
    }

    let nuevoCredito = {
        cedula: clienteSeleccionado.cedula,
        monto: montoCalculado,
        plazo: plazoCalculado,
        cuota: cuotaCalculada
    };

    creditos.push(nuevoCredito);
}

function pintarTablaVIP() {
    let tabla = document.getElementById("cuerpoTablaVIP");
    tabla.innerHTML = ""; 
    let creditosFiltrados = creditos.filter(function(credito) {
        return credito.monto > 5000;
    });
    if (creditosFiltrados.length === 0) {
        tabla.innerHTML = `<tr><td colspan="4">No hay créditos VIP registrados mayores a $5000</td></tr>`;
        return;
    }

    creditosFiltrados.forEach(function(credito) {
        let fila = `
            <tr>
                <td>${credito.cedula}</td>
                <td>$${credito.monto.toFixed(2)}</td>
                <td>${credito.plazo} meses</td>
                <td>$${credito.cuota.toFixed(2)}</td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}
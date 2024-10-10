// Función para guardar datos en el localStorage
function guardarDatos(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}

// Función para obtener datos del localStorage
function obtenerDatos(clave) {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : [];
}

// Función para agregar una nueva cuenta
function agregarCuenta(numeroCuenta, nombre, monto, tipoCuenta) {
    //agregar validaciones
    if (!numeroCuenta || !nombre || !monto || !tipoCuenta) {
        alert('Por favor complete todos los campos.');
        return;
    }

    let cuentas = obtenerDatos('cuentas');
    let nuevaCuenta = {
        numeroCuenta: parseInt(numeroCuenta),
        nombre: nombre,
        monto: parseFloat(monto),
        tipoCuenta: tipoCuenta,
        fechaCreacion: new Date().toLocaleDateString(), // Fecha de creación en formato dd/mm/aaaa
        movimientos: []
    };

    // movimiento inicial de ingreso
    const nuevoMovimiento = {
        fechaMovimiento: new Date().toLocaleString(), // Fecha de movimiento en formato dd/mm/aaaa hh:mm:ss
        tipoMovimiento: 'Ingreso',
        cantidad: parseFloat(monto),
        numeroMovimiento: 1 // primer movimienyo
    };
    //agregar movimiento
    nuevaCuenta.movimientos.push(nuevoMovimiento);
    //agregar cuenta a la lista de cuentas
    cuentas.push(nuevaCuenta);
    guardarDatos('cuentas', cuentas);
    alert("Cuenta creada exitosamente");
    listarCuentas(cuentas);
}

// Función para agregar un movimiento a una cuenta
function agregarMovimiento(numeroCuenta, tipoMovimiento, cantidad) {
    //agregar validaciones para un movimiento
    if (!numeroCuenta || !tipoMovimiento || !cantidad) {
        alert('Por favor complete todos los campos para el movimiento.');
        return;
    }

    let cuentas = obtenerDatos('cuentas');
    let cuenta = cuentas.find(c => c.numeroCuenta === parseInt(numeroCuenta));

    if (cuenta) {
        const nuevoMovimiento = {
            fechaMovimiento: new Date().toLocaleString(), // Fecha de movimiento en formato dd/mm/aaaa hh:mm:ss
            tipoMovimiento: tipoMovimiento,
            cantidad: parseFloat(cantidad),
            numeroMovimiento: cuenta.movimientos.length + 1
        };
        //actualizar monto
        if (tipoMovimiento.toLowerCase() === "ingreso") {
            cuenta.monto += parseFloat(cantidad);
        } else if (tipoMovimiento.toLowerCase() === "egreso" && cuenta.monto >= cantidad) {
            cuenta.monto -= parseFloat(cantidad);
        } else {
            alert('Fondos insuficientes para realizar el retiro');
            return;
        }

        // Añadir el nuevo movimiento a la cuenta
        cuenta.movimientos.push(nuevoMovimiento);

        // Guardar la cuenta actualizada en localStorage
        guardarDatos('cuentas', cuentas);
        alert('Movimiento agregado exitosamente'); // Mensaje de éxito
        listarCuentas();
    } else {
        alert('Cuenta no encontrada');
    }
}


// Función para ordenar cuentas por un atributo específico
function ordenarCuenta(atributo, tipoOrdenacion) {
    let cuentas = obtenerDatos('cuentas');

    cuentas.sort((a, b) => {
        if (typeof a[atributo] === 'number') {
            //ordenar por numero
            return tipoOrdenacion ? a[atributo] - b[atributo] : b[atributo] - a[atributo];
        } else {
            // ordenar por letras
            let auxA = a[atributo].toString().toLowerCase();
            let auxB = b[atributo].toString().toLowerCase();
            if (tipoOrdenacion === true) {
                return auxA < auxB ? -1 : (auxA > auxB ? 1 : 0);
            } else {
                return auxA > auxB ? -1 : (auxA < auxB ? 1 : 0);
            }
        }
    });

    // Mostrar cuentas ordenadas en la tabla
    listarCuentas(cuentas);
}


// Función para buscar cuentas por un atributo específico
function buscarCuentas(atributo, valor) {
    let cuentas = obtenerDatos('cuentas');
    let cuentasFiltradas = cuentas.filter(cuenta => {
        if (cuenta[atributo]) {
            return cuenta[atributo].toString().toLowerCase().includes(valor.toLowerCase());
        }
        return false;
    });

    // Mostrar cuentas filtradas en la tabla
    listarCuentas(cuentasFiltradas);
}

// Función para mostrar cuentas en una tabla
function listarCuentas(cuentas = obtenerDatos('cuentas')) {
    let resultado = `
        <table border="1">
            <thead>
                <tr>
                    <th>Número de Cuenta</th>
                    <th>Nombre</th>
                    <th>Monto</th>
                    <th>Tipo de Cuenta</th>
                    <th>Fecha de Creación</th>
                    <th>Movimientos</th>
                </tr>
            </thead>
            <tbody>
    `;

    cuentas.forEach(cuenta => {
        let movimientos = cuenta.movimientos.map(mov =>
            `Fecha: ${mov.fechaMovimiento}, Tipo: ${mov.tipoMovimiento}, Cantidad: ${mov.cantidad.toFixed(2)} $, Movimiento #: ${mov.numeroMovimiento}`
        ).join('<br>');

        resultado += `
            <tr>
                <td>${cuenta.numeroCuenta}</td>
                <td>${cuenta.nombre}</td>
                <td>${cuenta.monto.toFixed(2)} $</td>
                <td>${cuenta.tipoCuenta}</td>
                <td>${cuenta.fechaCreacion}</td>
                <td>${movimientos}</td>
            </tr>
        `;
    });

    resultado += `
            </tbody>
        </table>
    `;

    document.getElementById('resultado').innerHTML = resultado;
}


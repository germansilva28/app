// ===========================
// 1. VARIABLES GLOBALES
// ===========================
let tiempoRestante;
let temporizadorIntervalo;
let esSesionEstudio = true;
let tiempoEstudio, tiempoDescanso;
let temporizadorActivo = false;

// ===========================
// 2. PERMISO DE NOTIFICACIONES
// ===========================
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

// ===========================
// 3. FUNCIONES PRINCIPALES
// ===========================

// Enviar notificación
function enviarNotificacion(titulo, mensaje) {
    if (Notification.permission === "granted") {
        new Notification(titulo, {
            body: mensaje,
            icon: "https://cdn-icons-png.flaticon.com/512/727/727399.png"
        });
    }
}

// Reproducir sonido de alarma
function reproducirAlarma() {
    const alarma = document.getElementById('alarmaAudio');
    alarma.pause();
    alarma.currentTime = 0;
    alarma.play().catch(e => {
        console.warn("El navegador bloqueó el sonido:", e);
    });
}

// Iniciar el temporizador
function iniciarTemporizador() {
    temporizadorActivo = true;
    temporizadorIntervalo = setInterval(() => {
        tiempoRestante--;
        document.getElementById('tiempoRestante').textContent = tiempoRestante;
        actualizarBarraProgreso(esSesionEstudio ? tiempoEstudio : tiempoDescanso, tiempoRestante);

        if (tiempoRestante <= 0) {
            clearInterval(temporizadorIntervalo);

            // Alarma y notificación
            reproducirAlarma();
            enviarNotificacion(
                esSesionEstudio ? "¡Estudio terminado!" : "¡Descanso terminado!",
                esSesionEstudio ? "Toma un descanso bien merecido." : "Hora de volver al estudio."
            );

            // Cambiar estado
            esSesionEstudio = !esSesionEstudio;
            document.getElementById('estadoSesion').textContent = esSesionEstudio ? '¡Es hora de estudiar!' : '¡Es hora de descansar!';
            document.getElementById('startSessionButton').style.display = 'inline-block';
        }
    }, 60000); // 1 minuto = 60000 milisegundos
}

// Actualizar la barra de progreso
function actualizarBarraProgreso(tiempoInicial, tiempoActual) {
    const porcentaje = ((tiempoInicial - tiempoActual) / tiempoInicial) * 100;
    document.getElementById('barraProgreso').style.width = `${porcentaje}%`;
}

// ===========================
// 4. EVENTOS DE INTERFAZ
// ===========================

// Generar rutina
document.getElementById('generarRutina').addEventListener('click', () => {
    let horasEstudio = parseInt(document.getElementById('horas').value);
    let asignaturas = parseInt(document.getElementById('asignaturas').value);
    let sesionEstudio = parseInt(document.getElementById('sesion').value);
    let descanso = parseInt(document.getElementById('descanso').value);
    let nombresAsignaturas = document.getElementById('nombresAsignaturas').value
        .split(',')
        .map(nombre => nombre.trim());

    // Mostrar resumen
    document.getElementById('detallesHorasEstudio').textContent = horasEstudio;
    document.getElementById('detallesAsignaturas').textContent = asignaturas;
    document.getElementById('detallesSesionEstudio').textContent = sesionEstudio;
    document.getElementById('detallesDescanso').textContent = descanso;

    // Configurar tiempos
    tiempoEstudio = sesionEstudio;
    tiempoDescanso = descanso;

    // Mostrar botón de inicio
    document.getElementById('startSessionButton').style.display = 'inline-block';

    // Cálculos de distribución
    let totalMinutos = horasEstudio * 60;
    let tiempoTotal = sesionEstudio + descanso;
    let sesionesTotales = Math.floor(totalMinutos / tiempoTotal);
    let sesionesPorAsignatura = Math.floor(sesionesTotales / asignaturas);

    // Asegurar que haya suficientes nombres
    while (nombresAsignaturas.length < asignaturas) {
        nombresAsignaturas.push(`Asignatura ${nombresAsignaturas.length + 1}`);
    }
    nombresAsignaturas = nombresAsignaturas.slice(0, asignaturas);

    // Mostrar lista
    const lista = document.getElementById('listaAsignaturas');
    lista.innerHTML = '';
    for (let i = 0; i < asignaturas; i++) {
        const li = document.createElement('li');
        li.textContent = `${nombresAsignaturas[i]}: ${sesionesPorAsignatura} sesiones`;
        lista.appendChild(li);
    }
});

// Iniciar sesión
document.getElementById('startSessionButton').addEventListener('click', () => {
    tiempoRestante = esSesionEstudio ? tiempoEstudio : tiempoDescanso;
    document.getElementById('temporizador').style.display = 'block';
    document.getElementById('estadoSesion').textContent = esSesionEstudio ? 'Estudiando...' : 'Descansando...';
    document.getElementById('tiempoRestante').textContent = tiempoRestante;

    // Reiniciar barra de progreso
    document.getElementById('barraProgreso').style.width = '0%';

    iniciarTemporizador();
});

// Pausar / Reanudar
document.getElementById('pausarButton').addEventListener('click', () => {
    if (temporizadorActivo) {
        clearInterval(temporizadorIntervalo);
        temporizadorActivo = false;
        document.getElementById('pausarButton').textContent = 'Reanudar';
    } else {
        iniciarTemporizador();
        document.getElementById('pausarButton').textContent = 'Pausar';
    }
});

// Reiniciar
document.getElementById('reiniciarButton').addEventListener('click', () => {
    clearInterval(temporizadorIntervalo);
    tiempoRestante = esSesionEstudio ? tiempoEstudio : tiempoDescanso;
    document.getElementById('tiempoRestante').textContent = tiempoRestante;
    document.getElementById('estadoSesion').textContent = esSesionEstudio ? 'Estudiando...' : 'Descansando...';
    temporizadorActivo = false;
    document.getElementById('pausarButton').textContent = 'Pausar';
});
// ===========================
// 1. Variables Globales
// ===========================
let sonidoAlarma = document.getElementById('alarmaAudio'); // Sonido por defecto
const inputAudio = document.getElementById('audioAlarma');

// ===========================
// 2. Función para cambiar el sonido de la alarma
// ===========================
inputAudio.addEventListener('change', (evento) => {
    const archivo = evento.target.files[0];

    if (archivo) {
        const url = URL.createObjectURL(archivo); // Crear un enlace de objeto para el archivo
        sonidoAlarma.src = url; // Cambiar la fuente de la alarma al archivo seleccionado
        console.log("Nuevo sonido de alarma cargado:", archivo.name);
    }
});

// ===========================
// 3. Reproducir el sonido de la alarma
// ===========================
function reproducirAlarma() {
    sonidoAlarma.pause();
    sonidoAlarma.currentTime = 0;
    sonidoAlarma.play().catch((e) => {
        console.warn("El navegador bloqueó el sonido:", e);
    });
}

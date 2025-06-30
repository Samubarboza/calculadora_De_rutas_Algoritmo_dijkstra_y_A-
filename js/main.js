import { Mapa } from './mapa.js'; 
import { Dijkstra } from './dijkstra.js';
import { Visualizador } from './visualizacion.js';

// Constantes para validaciones
const MIN_FILAS = 2;
const MIN_COLUMNAS = 2;

// Guardamos la instancia del visualizador para no crearla de nuevo
let visual = null;

// Referencias a los inputs y botón (evitamos repetir getElementById)
const inputFilas = document.getElementById('input-filas');
const inputColumnas = document.getElementById('input-columnas');
const inputInicio = document.getElementById('input-inicio');
const inputFin = document.getElementById('input-fin');
const botonGenerar = document.getElementById('btn-generar');

// Función para parsear coordenadas del input, devuelve array [fila, columna] o null si no es válido
function parsearCoordenada(str) {
    const partes = str.split(',').map(Number);
    if (partes.length !== 2 || partes.some(isNaN)) return null;
    return partes;
}

// Función que valida entradas y muestra alert si algo está mal
function validarEntradas(filas, columnas, inicio, fin) {
    if (isNaN(filas) || isNaN(columnas) || filas < MIN_FILAS || columnas < MIN_COLUMNAS) {
        alert(`Por favor ingresa valores válidos, mínimo ${MIN_FILAS}x${MIN_COLUMNAS}`);
        return false;
    }
    if (!inicio || !fin) {
        alert('Las coordenadas de inicio y fin deben tener formato "fila,columna" válido');
        return false;
    }
    if (inicio[0] === fin[0] && inicio[1] === fin[1]) {
        alert('El punto de inicio y fin no pueden ser iguales');
        return false;
    }
    return true;
}

// Función principal que genera mapa, calcula ruta y muestra visualización
function ejecutarGeneracion() {
    // Parseamos y obtenemos valores
    const filas = parseInt(inputFilas.value);
    const columnas = parseInt(inputColumnas.value);
    const inicio = parsearCoordenada(inputInicio.value);
    const fin = parsearCoordenada(inputFin.value);

    // Validamos datos
    if (!validarEntradas(filas, columnas, inicio, fin)) return;

    // Creamos y generamos el mapa con obstáculos
    const mapa = new Mapa(filas, columnas);
    mapa.generar_mapa(inicio, fin);

    // Validamos que las coordenadas de inicio y fin estén dentro del mapa y no caigan en obstáculo
    if (!mapa.es_valida(inicio) || !mapa.es_valida(fin)) {
        alert('Coordenada inválida: está fuera del mapa o en un obstáculo.');
        return;
    }

    // Instanciamos Dijkstra y calculamos la ruta
    const dijkstra = new Dijkstra(mapa.obtener_matriz());
    const ruta = dijkstra.calcular_camino(inicio[0], inicio[1], fin[0], fin[1]);

    if (!ruta) {
        alert('No se encontró ruta válida');
        return;
    }

    // Creamos o actualizamos el visualizador
    if (!visual) {
        visual = new Visualizador('contenedor-mapa');
    } else {
        visual.mapa = mapa;
    }

    // Mostramos el mapa con la ruta calculada
    visual.mostrar_mapa(mapa.obtener_matriz(), ruta, inicio, fin);

    console.log('Ruta calculada:', ruta);
}

// Listener para el botón
botonGenerar.addEventListener('click', ejecutarGeneracion);

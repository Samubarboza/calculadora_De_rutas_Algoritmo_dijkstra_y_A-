// ACA ESTOY IMPORTANDO LAS CLASES CREADAS PARA USAR EL MAPA, EL ALGORITMO Y SU VISUALIZACION
import { Mapa } from './mapa.js'; 
import { Dijkstra } from './dijkstra.js';
import { visualizador } from './visualizacion.js';

// GUARDAMOS UNA INSTANCIA DE LA VISUALIZACION PARA REUTILIZARLA SIN VOLVER A CREAR - UTIL POR SI VOLVEMOS A GENERAR EL MAPA Y NO QUEREMOS RECARGAR LA PAGINA
let visual = null;

// BOTON DEL ARCHIVO HTML PARA PODER GENERAR EL MAPA Y BUSCAR RUTA
const boton = document.getElementById('btn-generar');

// preparamos el boton
boton.addEventListener('click', () => {

// AGGARRO LOS VALORES QE INGRESA EL USUARIO PARA PODER CARGAR LA DATA EN EL PROGRAMA Y QUE GENERE
const filas = parseInt(document.getElementById('input-filas').value);//convertimos de string a entero -value(obtenemos el valor ingresado)
const columnas = parseInt(document.getElementById('input-columnas').value);

// ACA VALIDO QUE SEAS NUMEROS VALIDOS 
if (isNaN(filas) || isNaN(columnas) || filas < 2 || columnas < 2) { // isNaN verifica si el valor es numero, devuelve true o false
    alert('Por favor ingresa valores validos, minimo 2x2');
    return;
}
// GENERAMOS EL MAPA
const mapa = new Mapa(filas, columnas, 'aleatorio'); // generamos el mapa con obstaculos aleatorios
window.mapa_generado = mapa; // guardamos el mapa en el objeto global para poder acceder desde la consola si es necesario

// ACA VAMOS A AGARRAR LOS VALORES DE PUNTO DE INICIO Y FIN DESDE EL HTML
const input_inicio = document.getElementById('input-inicio').value;
const input_fin = document.getElementById('input-fin').value;

// CONVERTIMOS LAS COORDENADAS DE STRING A NUMEROS
const inicio = input_inicio.split(',').map(Number); // con split separamos los strings con comas y con map-number convertimos string a NRO
const fin = input_fin.split(',').map(Number);

// verificamos si una coordenada es valida
function coordenada_valida(coord) {
    const [f, c] = coord;
    return (!isNaN(f) && !isNaN(c) && // que sean numeros validos 
            f >= 0 && f < filas &&  // que esten dentro de los limites 
            c >= 0 && c < columnas &&
            mapa.obtener_matriz()[f][c] === 0 // que el terreno sea LIBRE, o sea transitable
    );
}

// Guardamos también estos puntos en el objeto global para debug o inspección
    window.punto_inicio = inicio;
    window.punto_fin = fin;

// si la coordenada es invalida o esta sobre el obstaculo lo que hacemos es frenar el proceso
if (!coordenada_valida(inicio) || !coordenada_valida(fin)) {
    alert('Coordenada invalida, mira que este dentro del mapa y que no se caiga en un obstaculo.');
    return;
}
// ACA LO QUE HACEMOS ES VERIFICAMOS QUE EL PUNTO DE INCIO Y FIN NO SEAN EL MISMO
if (inicio[0] === fin[0] && inicio[1] === fin[1]) {
    alert('El punto de inicio y fin no pueden ser iguales');
    return;
}
// ACA INSTANCIAMOS EL ALGORTIMO DIJKSTRA
const dijkstra = new Dijkstra(mapa.obtener_matriz()); // aca le paso la matriz del mapa al algoritmo
const ruta = dijkstra.calcular_camino(
    inicio[0], inicio[1], fin[0], fin[1]
); // aca calculamos el camino mas corto desde el incio al fin

// CREAMOS EL VISUALIZADOR
if (!visual) {
    visual = new visualizador('contenedor-mapa'); // si todavia no existe se crea el mapa con el ID DEL DIN CONTENEDOR
} else {
    visual.mapa = mapa; // PERO SI YA EXISTE ACTUALIZAMOS EL MAPA QUE YA TIENE CARGADO
}
// ACA MOSTRAMOS EL MAPA CON LA RUTA CALCULADA
visual.mostrar_mapa(
    mapa.obtener_matriz(), //   matriz del terreno actual
    ruta, inicio, fin // ruta encontrada por el algoritmo, punto de partida, punto de llegada
); 
// MOSTRAMOS LA RUTA EN CONSOLA
console.log('Ruta', ruta);
});
import { CalculadoraDeRutas } from "./calculadora_rutas.js";

// Referencia a los inputs
const inputFilas = document.getElementById('input-filas');
const inputColumnas = document.getElementById('input-columnas');
const inputInicio = document.getElementById('input-inicio');
const inputFin = document.getElementById('input-fin');
const botonGenerar = document.getElementById('btn-generar');

// instanciamos la calculadora con el id del contenedor donde se muestra el mapa
const calculadora = new CalculadoraDeRutas('contenedor-mapa');

// Funcion auxiliar para parsear coordenadas desde strings fila-columnas
function extraerCoordenada(str) {
    const partes = str.split(',').map(Number);
    if (partes.length !== 2 || partes.some(isNaN)) return null;
    return partes;
}

// boton ejecutar el proceso cuando se hace click
botonGenerar.addEventListener('click', () => {
    const filas = parseInt(inputFilas.value);
    const columnas = parseInt(inputColumnas.value);
    const inicio = extraerCoordenada(inputInicio.value);
    const fin = extraerCoordenada(inputFin.value);

    if (calculadora.validarEntradas(filas, columnas, inicio, fin)) {
        calculadora.generarRuta(filas, columnas, inicio, fin);
    }
});

// aca lo que hacemos es que importamos las clases que cremoas para usar el mapa, el algoritmo y la visualizacion
import { Mapa } from './mapa.js';
import { Dijkstra } from './dijkstra.js';
import { visualizador } from './visualizacion.js';

// aca agarramos el boton del html que va a hacer que funcione cuando el usuario haga click 
const boton = document.getElementById('btn-generar');

// aca definimos que pasa cuando el usuario hace click
boton.addEventListener('click', () => {
    // leemos los valores que puso el usuario en los inputs de filas y columnas
    // parseInt convierte esos valores que vienen como texto  a numeros enteros
    const filas = parseInt(document.getElementById('input-filas').value);
    const columnas = parseInt(document.getElementById('input-columnas').value);

    // aca chequeamos que esos valores sean numeros validos y mayores  o iguales a 2
    // si no, mostramos alerta y salimos de la funcion para que no siga el proceso
    if (isNaN(filas) || isNaN(columnas) || filas < 2 || columnas < 2) {
        alert('Por favor ingresa valores validos, minimo de 2x2');
        return; // aca corta la ejecucion
    }

    // aca lo que hacemos es creamos el mapa con los valores que ingreso el usuario de filas y columnas
    // y le pedimos que genere obstalos de manera aleatoria
    const mapa = new Mapa(filas, columnas, 'aleatorio');

    // aca creamos una instancia del algoritmo Dijkstra pasandole la matriz del mapa
    // la matriz es un array 2d que representa el terreno y obstaculos
    const dijkstra = new Dijkstra(mapa.obtener_matriz());

    // funcion que genera una coordenada aleatoria dentro del rango del mapa
    function coordenada_aleatoria() {
        return [
            Math.floor(Math.random() * filas), // fila aleatoria entre 0 y filas -1
            Math.floor(Math.random() * columnas)
        ];
    }
    // aca generamos el punto de inicio y de fin pero aleatoriamente
    let inicio = coordenada_aleatoria();
    let fin = coordenada_aleatoria();

    // nos aseguramos que el inicio y fin no sean la misma celda
    while (inicio[0] === fin[0] && inicio[1] === fin[1]) {
        fin = coordenada_aleatoria();
    }

    // aca lo que hacemos es, ejecutamos el algoritmo para calcular la ruta des el inicio hasta el fin 
    // devuelve un array con las coordenadas del camino mas corto, o null si no hay otra ruta
    const ruta = dijkstra.calcular_camino(inicio[0], inicio[1], fin[0], fin[1]);

    // creamos el visualizador pasandole el id del div donde va a mostrar el mapa
    const visual = new visualizador('contenedor-mapa');

    // mostramos el mapa en el navegador con la ruta, el punto de inicio y el punto fin de resaltados
    visual.mostrar_mapa(mapa.obtener_matriz(), ruta, inicio, fin);

    // imprimimos en consola la ruta para ver que salio
    console.log('Ruta', ruta);
});
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

    // aca leemos las coordenadas que ingresan los usuarios
    const input_inicio = document.getElementById('input-inicio').value;
    const input_fin = document.getElementById('input-fin').value;

    // convertimos los textos a arrays de numeros
    const inicio = input_inicio.split(',').map(Number);
    const fin = input_fin.split(',').map(Number);

    // validamos que tengan el formato correcto y que esten dentro del mapa
    function coordenada_valida(coord) {
        const [f, c] = coord;
        return (
            !isNaN(f) && !isNaN(c) && 
            f >= 0 && f < filas &&
            c >= 0 && c < columnas &&
            mapa.obtener_matriz()[f][c] === 0 // solo permitimos empezar/terminar si es un terrno libre
        )
    }

    // si no son validas, cortamos
    if (!coordenada_valida(inicio) || !coordenada_valida(fin)) {
        alert('Coordenadas invaldias, Verifica que esten dentro del mapa y no caigan sobre un obstaculo.');
        return;
    }

    // si son iguales no sirve
    if (inicio[0] === fin[0] && inicio[1] === fin[1]) {
        alert('El punto de inicio y de fin no pueden ser iguales');
        return
    }

    // aca creamos una instancia del algoritmo Dijkstra pasandole la matriz del mapa
    // la matriz es un array 2d que representa el terreno y obstaculos
    const dijkstra = new Dijkstra(mapa.obtener_matriz());

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
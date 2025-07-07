import { Mapa } from "./mapa.js";
import { Dijkstra } from "./dijkstra.js";
import { VisualizadorConColores as Visualizador } from "./visualizador_colores.js";


class CalculadoraDeRutas {
    constructor(id_contenedor) {
        this.visualizador = new Visualizador(id_contenedor);
        this.mapa = null;
    }

    // metodo para validar las entradas del usuario
    validarEntradas(filas, columnas, inicio, fin) {
        // isNaN (is not a number) devuelve true si el valor no es un numero
        if (isNaN(filas) || isNaN(columnas) || filas < 2 || columnas < 2) {
            alert('Las dimensiones minimas tienen que ser 2x2');
            return false;
        }
        // validamos que haya coordenada
        if (!inicio || !fin) {
            alert('coordenadas invalidas');
            return false;
        }
        // verificamos que las coordenadas esten dentro del mapa
        const dentroMapa = coord => coord[0] >= 0 && coord[0] < filas && coord[1] >= 0 && coord[1] < columnas;
        if (!dentroMapa(inicio) || !dentroMapa(fin)) {
            alert('coordenadas fuera del mapa');
            return false;
        }
        // verificamos que el inicio y fin no coincidan
        if (inicio[0] === fin[0] && inicio[1] === fin[1]) {
            alert('Inicio y fin no pueden ser iguales');
            return false;
        }
        // si esta todo ok, la funcion retorna true
        return true;
    }


    // metodo para generar el mapa y calcular camino
    generarRuta(filas, columnas, inicio, fin) {
        // creamos una instancia del mapa
        this.mapa = new Mapa(filas, columnas);
        // generamos la matriz del mapa, usando el metodo de la clase Mapa
        this.mapa.generar_mapa(inicio, fin);

        // verificamos que sean coordenadas validas
        if (!this.mapa.es_valida(inicio) || !this.mapa.es_valida(fin)) {
            alert('Coordenada invalida o es un obstaculo');
            return false;
        }
        // creamos una instancia del algoritmo
        const dijkstra = new Dijkstra(this.mapa.obtener_matriz());

        // ejecutamos el calculo del camino mas corto, este metodo devuelve un array con coordenadas q forman l ruta
        // usamos el meotod calcular_Camino de la clase Dijkstra
        const ruta = dijkstra.calcular_camino(inicio[0], inicio[1], fin[0], fin[1]);

        // si no hay ruta, avisamos
        if (!ruta) {
            alert('No se encontro ruta valida');
            return;
        }
        // mostramos el mapa en la pantalla con la ruta incluida
        this.visualizador.mostrar_mapa(this.mapa.obtener_matriz(), ruta, inicio, fin);
        console.log('Ruta:', ruta);
    }
}
// exportamos la clase
export { CalculadoraDeRutas };
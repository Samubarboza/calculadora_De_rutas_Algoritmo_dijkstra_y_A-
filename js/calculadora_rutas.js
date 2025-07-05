import { Mapa } from "./mapa.js";
import { Dijkstra } from "./dijkstra.js";
import { Visualizador } from "./visualizacion.js";

class CalculadoraDeRutas {
    constructor(id_contenedor) {
        this.visualizador = new Visualizador(id_contenedor);
        this.mapa = null;
    }

    // validar coordenadas y dimensiones
    validarEntradas(filas, columnas, inicio, fin) {
        if (isNaN(filas) || isNaN(columnas) || filas < 2 || columnas < 2) {
            alert('Las dimensiones minimas tienen que ser 2x2');
            return false;
        }
        if (!inicio || !fin) {
            alert('coordenadas invalidas');
            return false;
        }
        const dentroMapa = coord => coord[0] >= 0 && coord[0] < filas && coord[1] >= 0 && coord[1] < columnas;
        if (!dentroMapa(inicio) || !dentroMapa(fin)) {
            alert('coordenadas fuera del mapa');
            return false;
        }
        if (inicio[0] === fin[0] && inicio[1] === fin[1]) {
            alert('Inicio y fin no pueden ser iguales');
            return false;
        }
        return true;
    }


    // crear mapa y buscar ruta
    generarRuta(filas, columnas, inicio, fin) {
        this.mapa = new Mapa(filas, columnas);
        this.mapa.generar_mapa(inicio, fin);

        if (!this.mapa.es_valida(inicio) || !this.mapa.es_valida(fin)) {
            alert('Coordenada invalida o es un obstaculo');
            return false;
        }
        const dijkstra = new Dijkstra(this.mapa.obtener_matriz());
        const ruta = dijkstra.calcular_camino(inicio[0], inicio[1], fin[0], fin[1]);

        if (!ruta) {
            alert('No se encontro ruta valida');
            return;
        }
        this.visualizador.mostrar_mapa(this.mapa.obtener_matriz(), ruta, inicio, fin);
        console.log('Ruta:', ruta);
    }
}
export { CalculadoraDeRutas };
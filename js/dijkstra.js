// importamos la estructura de datos para manejar prioridades
// modulo para reconstruir el camino
import { ColaPrioridad } from './cola_prioridad.js';
import { Ruta } from './ruta.js';

// algoritmo de camino mas corto con opcion de A*
class Dijkstra {
    // constructor que inicializa propiedades del mapa
    constructor(matriz_mapa) {
        this.matriz = matriz_mapa;
        this.filas = matriz_mapa.length; 
        this.columnas = matriz_mapa[0].length;
        this.distancias = [];
        this.visitados = [];
        this.predecesores = [];
        this.usar_heuristica = false;
    }

    // metodo para inciar estructuras, crea matrices internas necesarias
    inicializar_estructuras() {
        for (let fila = 0; fila < this.filas; fila++) {
            this.distancias[fila] = [];
            this.visitados[fila] = [];
            this.predecesores[fila] = [];

            for (let columna = 0; columna < this.columnas; columna++) {
                this.distancias[fila][columna] = Infinity;
                this.visitados[fila][columna] = false;
                this.predecesores[fila][columna] = null;
            }
        }
    }

    // metodo que retorna solo las celdas vecinas accesibles
    obtener_vecinos_validos(fila, columna) {
        const vecinos = [];
        const direcciones = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0]
        ];

        for (const [desplazar_fila, desplazar_columna] of direcciones) {
            const nueva_fila = fila + desplazar_fila;
            const nueva_columna = columna + desplazar_columna;

            if (
                nueva_fila >= 0 && nueva_fila < this.filas &&
                nueva_columna >= 0 && nueva_columna < this.columnas &&
                this.matriz[nueva_fila][nueva_columna] !== 1 &&
                this.matriz[nueva_fila][nueva_columna] !== 2 &&
                this.matriz[nueva_fila][nueva_columna] !== 3
            ) {
                vecinos.push([nueva_fila, nueva_columna]);
            }
        }
        return vecinos;
    }

    // metodo para calcular la distancia de manhatan entre dos puntos
    calcular_heuristica(fila_actual, columna_actual, fila_destino, columna_destino) {
        return Math.abs(fila_actual - fila_destino) + Math.abs(columna_actual - columna_destino);
    }

    // algoritmo principal - dijkstra con opcion a heuristica (A*)
    calcular_camino(fila_inicio, columna_inicio, fila_destino, columna_destino) {
        this.inicializar_estructuras();
        const distancia_estimada = this.calcular_heuristica(fila_inicio, columna_inicio, fila_destino, columna_destino);
        this.usar_heuristica = distancia_estimada > 10;

        const cola_prioridad = new ColaPrioridad();
        this.distancias[fila_inicio][columna_inicio] = 0;
        cola_prioridad.encolar([fila_inicio, columna_inicio], 0);

        while (!cola_prioridad.esta_vacia()) {
            const [fila_actual, columna_actual] = cola_prioridad.desencolar();

            if (this.visitados[fila_actual][columna_actual]) continue;
            this.visitados[fila_actual][columna_actual] = true;

            if (fila_actual === fila_destino && columna_actual === columna_destino) break;

            for (const [fila_vecina, columna_vecina] of this.obtener_vecinos_validos(fila_actual, columna_actual)) {
                const nueva_distancia = this.distancias[fila_actual][columna_actual] + 1;

                if (nueva_distancia < this.distancias[fila_vecina][columna_vecina]) {
                    this.distancias[fila_vecina][columna_vecina] = nueva_distancia;
                    this.predecesores[fila_vecina][columna_vecina] = [fila_actual, columna_actual];

                    let prioridad = nueva_distancia;

                    if (this.usar_heuristica) {
                        const heuristica = this.calcular_heuristica(fila_vecina, columna_vecina, fila_destino, columna_destino);
                        prioridad += heuristica;
                    }
                    cola_prioridad.encolar([fila_vecina, columna_vecina], prioridad);
                }
            }
        }
        return Ruta.reconstruir(this.predecesores, fila_destino, columna_destino, fila_inicio, columna_inicio);
    }
}
// exportamos la clase 
export { Dijkstra };
// vamos a crear la clase COLA DE PRIORIDAD
// ESTA CLASE SIVER PARA QUE YO PUEDA MANEJAR UNA LISTA ORDENADA DE ELEMENTOS SEGUN SU PRIORIDAD - DE MENOR A MAYOR
// USAMOS ESTA CLASE PARA OPTIMIZAR EL ALGORTIMO DIJKSTRA/A* BUSCANDO SIEMPRE LA CELDA CON MENOR COSTO
class ColaPrioridad {
    constructor() {
        this.elementos = []; // ARRAY QUE GUARDA LOS ELEMENTOS JUNTO CON SU PRIORIDAD
    }
    //agregamos un elemento con su prioridad
    encolar(elemento, prioridad) {
        this.elementos.push({elemento, prioridad}); // guardamos un objeto con la celda y su prioridad

        // usamos sort para ordenar el array segun la prioridad
        // a y b son elementos del array y comparamos su prioridades
        // si a.prioridad < b.prioridad . se mantiene el orden. si es al reves se reordenan
        this.elementos.sort((a, b) => a.prioridad - b.prioridad);
    }
    // elimina y devuelve el elemento con menor prioridad
    desencolar() {
        // shift saca el primer elemento del array (el de menor prioridad por el sort )
        // usamos ?.elemento por si el array esta vacio (para evitar error)
        return this.elementos.shift()?.elemento;
    }
    // devuelve true si la cola esta vacia
    esta_vacia() {
        return this.elementos.length === 0;
    }
}

// aca creamos mi clase dijkstra con a*
class Dijkstra {
    constructor(matriz_mapa) {
        this.matriz = matriz_mapa; // aca guardamos la matriz del mapa
        this.filas = matriz_mapa.length; 
        this.columnas = matriz_mapa[0].length;
        this.distancias = []; // se van a guardar las distancias minimas desde el inicio
        this.visitados = []; // se van a guardar la matriz de celdas ya visitadas
        this.predecesores = []; // se van a guardar la celda de donde venimos para cada celda
        this.usar_heuristica = false; // desde el inicio es false, pero si la distancia es mayor a 10 usamos A*
    }
    // INICIALIZAMOS LAS MATRICES DE TRABAJO
    inicializar_estructuras() {
        for (let fila = 0; fila < this.filas; fila++) {
            this.distancias[fila] = [];
            this.visitados[fila] = [];
            this.predecesores[fila] = [];
            for (let columna = 0; columna < this.columnas; columna++) {
                this.distancias[fila][columna] = Infinity; // infiniti representa una distancia imposible (inicialmente todo esta lejos)
                this.visitados[fila][columna] = false; // inicialmente todo esta falso, ninguna celda se visito
                this.predecesores[fila][columna] = null; // aca esta en nulo, aun no sabemos como llegamos
            }
        }
    }
    // buscamos celdas vecinas validas (que esten en el mapa y no sean obstaculos)
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

            // verificamos que este dentro del mapa y no sea un obstaculo (tipo 1, 2, 3)
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
    // calcular la distancia de manhatan (heuristica)
    calcular_heuristica(fila_actual, columna_actual, fila_destino, columna_destino) {
        // Math.abs devuelve el valor absoluto 
        return Math.abs(fila_actual - fila_destino) + Math.abs(columna_actual - columna_destino);
    }
    // esta es la funcion principal que encuentra el camino mas corto
    calcular_camino(fila_inicio, columna_inicio, fila_destino, columna_destino) {
        this.inicializar_estructuras(); // limpiamos todo

        // decidimos si usamos A* SI ES QUE LA ESTRUCTURA ES GRANDE
        const distancia_estimada = this.calcular_heuristica(fila_inicio, columna_inicio, fila_destino, columna_destino);
        this.usar_heuristica = distancia_estimada > 10;

        // creamos una cola de prioridad para procesar las celdas por prioridad
        const cola_prioridad = new ColaPrioridad();
        this.distancias[fila_inicio][columna_inicio] = 0; // la distancia al inicio es 0
        cola_prioridad.encolar([fila_inicio, columna_inicio], 0);

        // bucle principal 
        while (!cola_prioridad.esta_vacia()) {
            const [fila_actual, columna_actual] = cola_prioridad.desencolar();
            if (this.visitados[fila_actual][columna_actual]) continue; // si ya visitamos, saltamos

            this.visitados[fila_actual][columna_actual] = true;

            if (fila_actual === fila_destino &&
                columna_actual === columna_destino
            ) break; // llegamos al destino, parar

            // recorremos vecinos validos
            for (const [fila_vecina, columna_vecina] of this.obtener_vecinos_validos(fila_actual, columna_actual)) {
                const nueva_distancia = this.distancias[fila_actual][columna_actual] +1; // cada paso cuesta 1

                if(nueva_distancia < this.distancias[fila_vecina][columna_vecina]) {
                    // si encontramos un vamino mas corto, actualizamos la informacion
                    this.distancias[fila_vecina][columna_vecina] = nueva_distancia;
                    this.predecesores[fila_vecina][columna_vecina] = [fila_actual, columna_actual];

                    // calculamos la prioridad para la cola (dijkstra solo g, a* g + h)
                    let prioridad = nueva_distancia;
                    if (this.usar_heuristica) {
                        const heuristica = this.calcular_heuristica(fila_vecina, columna_vecina, fila_destino, columna_destino);
                        prioridad += heuristica;
                    }
                    cola_prioridad.encolar([fila_vecina, columna_vecina], prioridad);
                }
            }
        }
        // reconstruimos el camino desde el destino hasta el incio
        const camino = [];
        let f = fila_destino;
        let c = columna_destino;

        while (f !== null && c !== null) {
            camino.unshift([f, c]); // agregamos al incio del array
            const anterior = this.predecesores[f][c];
            if (!anterior) break; 
            f = anterior[0];
            c = anterior[1];
        }
        // verificamos si se llego correctamente 
        if (camino.length === 0 || camino[0][0] !== fila_inicio || camino[0][1] !== columna_inicio) {
            return null; // no hay camino
        }
        return camino; // devolvemos el camino completo
    }
}
// exportamos la clase para usarla desde otros archivos
export { Dijkstra };
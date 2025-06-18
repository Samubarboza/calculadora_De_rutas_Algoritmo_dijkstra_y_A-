// aca voy a crear una clase que implementa el algoritmo dijkstra con opcion de usar A* si es que es largo el camino

class Dijkstra {
    constructor(matriz_mapa) {
        this.matriz = matriz_mapa; // aca definimos el tributo mapa que contiene terrenos y ostaculos
        this.filas = matriz_mapa.length; // cantidad de filas
        this.columnas = matriz_mapa[0].length; // la cantidad total de columnas
        this.distancias = []; // con esta matriz, registramos la distancia minima desde el inicio a cada celda
        this.visitados = []; // y con esta matriz sabemos si la celda fue visitada
        this.predecesores = []; // esta matriz es para saber de donde llegamos a cada celda, sirve para reconstruir el camino
        this.usar_heuristica = false; // por defecto solo usamos dijkstra, si la distancia es grande se activa el A*
    }
    // inicializamos las matrices internas, distancias, visitados, predecesores
    inicializar_estructuras() {
        for (let fila = 0; fila < this.filas; fila++) {
            this.distancias[fila] = [];
            this.visitados[fila] = [];
            this.predecesores[fila] = [];
            for (let columna = 0; columna < this.columnas; columna++) {
                this.distancias[fila][columna] = Infinity; // al principio todo esta re lejos
                this.visitados[fila][columna] = false; // el iniciar ninguna celda fue aun visitada
                this.predecesores[fila][columna] = null; // aun no se llego desde ningun ladoporque estamos al incio
            }
        }
    }
    // una vez dado la fila y columna, devuelve un array con las coordenadas de los vecinos validos
    obtener_vecinos_validos(fila, columna) {
        const vecinos = [];
        const movimientos_posibles = [
            [0, 1], [1, 0], [0, -1], [-1, 0] // derecha, abajo, izquierda y arriba
        ];
        // recorremos los movimientos, creamos nueva variable con los valores de los nuevos movimientos
        for (const [desplazar_fila, desplazar_columna] of movimientos_posibles) {
            const nueva_fila = fila + desplazar_fila;
            const nueva_columna = columna + desplazar_columna;

            // verificamos que este dentro del mapa y que no sea una celda bloqueada
            if (
                nueva_fila >= 0 && nueva_fila < this.filas &&
                nueva_columna >= 0 && nueva_columna < this.columnas &&
                this.matriz[nueva_fila][nueva_columna] !== 3
            ) {
                vecinos.push([nueva_fila, nueva_columna]);
            }
        }
        return vecinos;
    }
    // calculamos la heuristica para el algoritmo A*, DISTANCIA DE MANHATAN ENTRE DOS CELDAS
    calcular_heuristica(fila_actual, columna_actual, fila_destino, columna_destino) {
        return Math.abs(fila_actual - fila_destino) + Math.abs(columna_actual - columna_destino);
    }
    
    // funcion principal que calcula el camino desde un punto de origen al destino 
    calcular_camino(fila_inicio, columna_inicio, fila_destino, columna_destino) {
        this.inicializar_estructuras(); // limpiamos todo antes de empezar

        // aca decidimos si usamos A* segun la distancia entre el inicio y el destino
        const ditancia_estimada_total = this.calcular_heuristica(fila_inicio, columna_inicio, fila_destino, columna_destino);
        this.usar_heuristica = ditancia_estimada_total > 10; // si es mayor a 10 se activa el A*

        // desde el inicio la distancia es 0
        this.distancias[fila_inicio][columna_inicio] = 0;

        // aca comienza la busqueda del camino, bucle principal
        while (true) {
            let fila_actual = - 1;
            let columna_actual = - 1;
            let distancia_mas_cercana = Infinity;

            // buscamos la celda no visitada con menor distancia (o menor f = g + h si usamos A*)
            for (let fila = 0; fila < this.filas; fila++) {
                for (let columna = 0; columna < this.columnas; columna++) {
                    if (!this.visitados[fila][columna]) {
                        let costo_actual = this.distancias[fila][columna];

                        // si estamos usando A* vamos a sumar la heuristica
                        if (this.usar_heuristica) {
                            const g = this.distancias[fila][columna];
                            const h = this.calcular_heuristica(fila, columna, fila_destino, columna_destino);
                            costo_actual = g + h;
                        }
                        if (costo_actual < distancia_mas_cercana) {
                            distancia_mas_cercana = costo_actual;
                            fila_actual = fila;
                            columna_actual = columna;
                        }
                    }
                }
            }
            // aca es si no hay mas caminos posibles o si no llegamos al destino, salimos del bucle
            if (
                distancia_mas_cercana === Infinity ||
                (fila_actual === fila_destino && columna_actual === columna_destino)
            ) {
                break;
            }
            // vamos a marcar como visitado la celda actual
            this.visitados[fila_actual][columna_actual] = true;

            // analizamos los vecinos validos de la celda actual
            const vecinos = this.obtener_vecinos_validos(fila_actual, columna_actual);
            for (const [fila_vecina, columna_vecina] of vecinos) {
                if (!this.visitados[fila_vecina][columna_vecina]) {
                    const nueva_distancia = this.distancias[fila_actual][columna_actual] + 1; // cada paso cuesta 1

                    if (nueva_distancia < this.distancias[fila_vecina][columna_vecina]) {
                        // si encontramos un camino mas corto, actualizamos distancia y predecesor
                        this.distancias[fila_vecina][columna_vecina] = nueva_distancia;
                        this.predecesores[fila_vecina][columna_vecina] = [fila_actual, columna_actual];
                    }
                }
            }
        }
        // reconstruimos el camino desde el destino hacia el inicio 
        const camino = [];
        let reconstruir_fila = fila_destino;
        let reconstruir_columna = columna_destino;

        while (reconstruir_fila !== null && reconstruir_columna !== null) {
            camino.unshift([reconstruir_fila, reconstruir_columna]); // insertamos al principio del array
            const anterior = this.predecesores[reconstruir_fila][reconstruir_columna];
            if (!anterior) break;
            reconstruir_fila = anterior[0];
            reconstruir_columna = anterior[1];
        }
        // si el camino reconstruido no empieza al incio, entonces significa que no hay camino valido
        if (
            camino.length === 0 ||
            (camino[0][0] !== fila_inicio || camino[0][1] !== columna_inicio)
        ) {
            return null;
        }
        return camino;
    }
}
export { Dijkstra };
// esta clase sirve para mantener una lista ordenada de elementos segun prioridad (de menor a mayor)
// vamos a usar esto para optimizar el algortimo y va a permitir procesar siempre la celda con menor costo
class ColaPrioridad {
    constructor() { // el constructor usamos para inicializar el objeto cuando se crea
        this.elementos = []; // aca vamos a guardar una lista de elementos cada vez que encolamos
    }
    // aca cremos un metodo que es para agregar un elemento cn su prioridad
    encolar(elemento, prioridad) {
        this.elementos.push({elemento, prioridad}); // aca agregamos al array
        this.elementos.sort((a, b) => a.prioridad - b.prioridad); // ordenamos el array elementos poniendo primero el que tenga menor prioridad
    }
    // este metodo es para desencolar - o sea para sacar elementos con menor prioridad
    desencolar() {
        return this.elementos.shift()?.elemento; // usamos ? por si el array esta vacio , si hay algo agarra, si no, no pasa nada
    }
    // este metodo creamos para desencolar - esto devuelve true si es que la cola esta vacia o false si hay elementos
    esta_vacia() {
        return this.elementos.length === 0;
    }
}

// aca vamos a crear mi clase dijkstra
// vamos a tener el algoritmo dijkstra y a* que se activan 
class Dijkstra {
    constructor(matriz_mapa) { // recibe el mapa para buscar caminos en la matriz
        this.matriz = matriz_mapa; // guardamos la matriz del mapa
        this.filas = matriz_mapa.length; // length cuenta la cantidad de elementos, nos dice cuantas filas tiene el array
        this.columnas = matriz_mapa[0].length; //lo mismo pero con las columnas
        // esto usamos para que el algortimo funcione bien y va a guardar las infos
        this.distancias = []; 
        this.visitados = [];
        this.predecesores = [];
        this.usar_heuristica = false; // el A* se activa solo si es que la distancia es larga - heuristica es encontrar, lo mas rapido
    }
    // usamos un metodo para inicializar las matrices
    inicializar_estructuras() {
        // recorremos las filas y agregamos a las propiedades del objeto para usar su informacion
        for (let fila = 0; fila < this.filas; fila++) {
            this.distancias[fila] = [];
            this.visitados[fila] = [];
            this.predecesores[fila] = [];
            
            // lo mismo pero con columnas
            for (let columna = 0; columna < this.columnas; columna++) {
                // inicialmente todos estan infinitamente lejos, el algoritmo sabe que puede interntar mejorar la distancia
                this.distancias[fila][columna] = Infinity; 
                this.visitados[fila][columna] = false; 
                this.predecesores[fila][columna] = null; // al principio no tenemos predecesores
            }
        }
    }

    // este metodo es para que podamos obtener los vecinos validos
    obtener_vecinos_validos(fila, columna) {
        const vecinos = []; 
        const direcciones = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0]
        ];
        // recorremos en los movimientos
        for (const [desplazar_fila, desplazar_columna] of direcciones) {
            const nueva_fila = fila + desplazar_fila;
            const nueva_columna = columna + desplazar_columna;

            // verificamos que no salga del mapa y que no sea un obstaculo 
            if (
                nueva_fila >= 0 && nueva_fila < this.filas &&
                nueva_columna >= 0 && nueva_columna < this.columnas &&
                this.matriz[nueva_fila][nueva_columna] !== 1 &&
                this.matriz[nueva_fila][nueva_columna] !== 2 &&
                this.matriz[nueva_fila][nueva_columna] !== 3
            ) {
                vecinos.push([nueva_fila, nueva_columna]); // agregamos los vecinos validos
            }
        }
        return vecinos;
    }

    // aca usamos la distancia de manhatan y le llamo heuristica porque es como encontrar el camino mas rapido
    calcular_heuristica(fila_actual, columna_actual, fila_destino, columna_destino) {
        return Math.abs(fila_actual - fila_destino) + Math.abs(columna_actual - columna_destino);
    }
    // este es mi meotod principal para calcular el camino mas corto
    calcular_camino(fila_inicio, columna_inicio, fila_destino, columna_destino) {
        this.inicializar_estructuras(); // usamos la funcion para iniciar laestructura

        // aca decidimos que vamos a usar A* si el camino esta lejos - usamos la distancia de manhatan para calcular la distancia
        const distancia_estimada = this.calcular_heuristica(fila_inicio, columna_inicio, fila_destino, columna_destino);
        this.usar_heuristica = distancia_estimada > 10; // si la distancia es 

        // aca creamos la cola de prioridad y comenzamos desde el inicio
        const cola_prioridad = new ColaPrioridad();
        this.distancias[fila_inicio][columna_inicio] = 0; // el incio tiene distancia 0 porque ahi estamos
        cola_prioridad.encolar([fila_inicio, columna_inicio], 0); // metemos la posicion inicial con priori 0 para empezar ahi

        // bucle pricipal
        while (!cola_prioridad.esta_vacia()) {
            const [fila_actual, columna_actual] = cola_prioridad.desencolar();

            // si visitamos la celda, seguimos, o sea saltamos
            if (this.visitados[fila_actual][columna_actual]) continue;
            this.visitados[fila_actual][columna_actual] = true; // si no, marcamos ahora que ya visitamos para no volver a procesar

            // si llegamos al destino salimos del bucle
            if (fila_actual === fila_destino && columna_actual === columna_destino) break;

            // recorremos todos los vecinos validos de la celda actual para ver de llegar de forma mas corta
            for (const [fila_vecina, columna_vecina] of this.obtener_vecinos_validos(fila_actual, columna_actual)) {
                // calculo cuanto cuesta llegar hasta el vecino valido desde donde estoy ahora
                const nueva_distancia = this.distancias[fila_actual][columna_actual] + 1; //suma 1, cuesta 1 moverse aun vecino

                // si encontramos un camino mas corto a la vecina, actualizamos.
                if (nueva_distancia < this.distancias[fila_vecina][columna_vecina]) { 
                    this.distancias[fila_vecina][columna_vecina] = nueva_distancia; // asignamos la nueva distancia si es mas corto
                    // guardamos de donde venimos para saber como llego hasta ahi y reconstruir despues el camino
                    this.predecesores[fila_vecina][columna_vecina] = [fila_actual, columna_actual]; 

                    // aca vamos a calcular la prioridad
                    let prioridad = nueva_distancia; // le pasamos los pasos que ya dimos
                    if (this.usar_heuristica) { // si estamos usando heuristica o sea A*
                        // el camino que falta desde el punto en el que estamos
                        const heuristica = this.calcular_heuristica(fila_vecina, columna_vecina, fila_destino, columna_destino); 
                        prioridad += heuristica; // prioridad es el pnto en el que estamos + el camino que falta
                    }
                    cola_prioridad.encolar([fila_vecina, columna_vecina], prioridad);
                }
            }
        }
        // reconstruimos el camino
        const camino = [];
        let f = fila_destino;
        let c = columna_destino;

        // vamos hacia atras desde el destino hasta el inicio usando predecesores
        while(f !== null && c !== null) { // mientras haya una celda valida
            camino.unshift([f,c]); // agregamos al principio del array
            const anterior = this.predecesores[f][c]; // miramos de donde vino
            if (!anterior) break; // si no hay celda anterior llegamos al inicio y paramos
            f = anterior[0]; // esto es como la marca de donde vinimos
            c = anterior[1];
        }

        // si no encontramos ningun camino o no empieza de donde deberia
        if (camino.length === 0 || camino[0][0] !== fila_inicio || camino[0][1] !== columna_inicio) { 
            return null; // aca le decimos que no se encontro camino
        }
        return camino;
    }
}
export { Dijkstra };
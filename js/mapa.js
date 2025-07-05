const TERRENOS = {
    LIBRE: 0,
    EDIFICIO: 1,
    AGUA: 2,
    BLOQUEADO: 3
};

class Mapa {
    #matriz;
    constructor(filas, columnas) {
        this.filas = filas;
        this.columnas = columnas;
        this.#matriz = [];
    }

    // crear matriz limpia con terrenos libres
    inicializar_matriz() {
        this.#matriz = [];
        for (let fila = 0; fila < this.filas; fila++) {
            const fila_array = new Array(this.columnas).fill(TERRENOS.LIBRE);
            this.#matriz.push(fila_array);
        }
    }

    // metemos obstaculos 20% del mapa
    calcular_total_obstaculos() {
        return Math.floor(this.filas * this.columnas * 0.2);
    }

    // ponemos obstaculos aleatorios evitando el inicio y el fin
    colocar_obstaculos(inicio, fin) {
        const total_obstaculos = this.calcular_total_obstaculos();
        let colocados = 0;
        const tipos = [TERRENOS.EDIFICIO, TERRENOS.AGUA, TERRENOS.BLOQUEADO];

        while (colocados < total_obstaculos) {
            const f = Math.floor(Math.random() * this.filas);
            const c = Math.floor(Math.random() * this.columnas);

            const es_inicio = inicio && f === inicio[0] && c === inicio[1];
            const es_fin = fin && f === fin[0] && c === fin[1];

            if (this.#matriz[f][c] === TERRENOS.LIBRE && !es_inicio && !es_fin) {
                const tipo = tipos[Math.floor(Math.random() * tipos.length)];
                this.#matriz[f][c] = tipo;
                colocados++;
            }
        }
    }
    // metodo principal que me genera el mapa, limpia, crea matriz y pone obstaculos
    generar_mapa(inicio = null, fin = null) {
        this.inicializar_matriz();
        this.colocar_obstaculos(inicio, fin);
    }

    es_coordenada_valida(fila, columna) {
        return fila >= 0 && fila < this.filas && columna >= 0 && columna < this.columnas;
    }

    es_valida(coord) {
        const [f, c] = coord;
        return !isNaN(f) && !isNaN(c) && this.es_coordenada_valida(f, c);
    }

    obtener_matriz() {
        return this.#matriz;
    }
}

export { Mapa, TERRENOS };
// objeto con constantes del terreno
const TERRENOS = {
    LIBRE: 0, // este es un espacio libre en el terreno donde se puede pasar
    EDIFICIO: 1, // este es un obstaculo de tipo edificio, donde se puede pasar
    AGUA: 2, // los mismo de arriba pero un obstaculo de tipo agua 
    BLOQUEADO: 3 // y este obstaculo bloquea todo
}; 

// clase mapa que va a guardar los valores que reciba para construir todo el mapa
class Mapa {
    constructor(filas, columnas, obstaculos = 'limpio') {
        // atributos que van a guardar los valores para generar el mapa
        this.filas = filas;  
        this.columnas = columnas;
        this.matriz = []; // aca se va a guardar el mapa 2d

        this.generarMapa(obstaculos); // se genera el mapa segun el modo que se indique
    }

    generarMapa(modo) {
        // inicializamos matriz vacia
        this.matriz = [];

        // llenamos fila por fila
        for (let fila = 0; fila < this.filas; fila++) {
            const filaArray = []; // empezar la matriz limpia

            // llenamos cada celda con el terreno libre, o sea donde se puede transitar
            for (let columna = 0; columna < this.columnas; columna++) {
                filaArray.push(TERRENOS.LIBRE); // mapa limpio de entrada
            }
            this.matriz.push(filaArray) // aca agregamos la fila a la matriz
        }
        
        // agregamos obstaculos segun el modo, en este caso estamos agregando los obstaculos manualmente
        if (modo === 'predeterminado') {
            // obstaculos fijos en posiciones especificas
            this.agregar_obstaculo(1, 1, TERRENOS.EDIFICIO);
            this.agregar_obstaculo(2, 3, TERRENOS.AGUA);
            this.agregar_obstaculo(0, 4, TERRENOS.BLOQUEADO);
        } else if (modo === 'aleatorio') { // si se juega en modo aleatorio se agregan los obstalos al azar
            const total = Math.floor(this.filas * this.columnas * 0.2); // se calcula la cantidad de obstaculos - 20% del mapa
            let contador = 0;

            // mientras no se hayan puesto todos los obstaculos, seguimos agregando 
            while (contador < total) {
                // elejimos una fila y columna al azar dentro del mapa
                const f = Math.floor(Math.random() * this.filas);
                const c = Math.floor(Math.random() * this.columnas);

                // solo agregamos los obstaculos si la celda es igual a libre
                if (this.matriz[f][c] === TERRENOS.LIBRE) {
                    // definimos los tipos de obstaculos
                    const tipos = [TERRENOS.EDIFICIO, TERRENOS.AGUA, TERRENOS.BLOQUEADO];
                    // elegimos un tipo de obstaculo al azar
                    const tipo = tipos[Math.floor(Math.random() * tipos.length)];

                    this.matriz[f][c] = tipo; // asignamos el obstaculo a la celda
                    contador++; // y le decimos al contador que agregamos uno
                }
            }
        }
    }

    // metodo para agregar un obstaculo manualmente 
    agregar_obstaculo(fila, columna, tipo) {
        if (this.es_coordenada_valida(fila, columna)) {
            this.matriz[fila][columna] = tipo; // si la coordenada es valida agregamos el obstaculo
        } else {
            // si no es valida, mostramos este mensaje
            console.warn(`Coordenada invalida: (${fila}, ${columna})`);
        }
    }

    // metodo para validar si una coordenada esta dentro del mapa
    es_coordenada_valida(fila, columna) {
        return (
            fila >= 0 && fila < this.filas &&
            columna >= 0 && columna < this.columnas
        );
    }

    // mostrar mapa en consola
    mostrar_en_consola() {
        console.log('MAPA');
        for (let fila of this.matriz) {
            // convierte los valores numericos a simbolos y los une en string
            console.log(fila.map(valor => this.simbolo_terreno(valor)).join(' '));
        }
    }

    // devolvemos simbolos para que sea mas legible en consola
    simbolo_terreno(valor) {
        switch (valor) {
            case TERRENOS.LIBRE: return '🔲'; // este es el simbolo para terreno libre
            case TERRENOS.EDIFICIO: return '🏢';
            case TERRENOS.AGUA: return '🌊';
            case TERRENOS.BLOQUEADO: return '⛔';
            default: return '?';
        }
    }
    // getter de la matriz si queres usarla afuera de la clase
    obtener_matriz() {
        return this.matriz;
    }
} export { Mapa, TERRENOS };


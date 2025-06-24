// CREAMOS LOS OBJETOS CON LOS TIPOS DE TERRENOS PARA EL MAPA
// USAMOS NUMEROS PARA QUE EL ALMACENAMIENTO EN MEMORIA SEA MAS SENCILLO Y PARA LAS COMPARACIONES 
const TERRENOS = {
    LIBRE: 0,
    EDIFICIO: 1,
    AGUA: 2,
    BLOQUEADO: 3
};

// ACA CREAMOS LA CLASE MAPA QUE SE ENCARGAR DE GENERAR EL MAPA Y MANEJAR LA LOGICA DE OBSTACULOS Y VALIDACION
class Mapa {
    constructor(filas, columnas) {
        // aca vamos a guardar los valores que va a recibir para poder construir
        this.filas = filas;
        this.columnas = columnas;
        this.matriz = []; // aca se guarda el mapa

        // CUANDO CREAMOS LA INSTANCIA YA VA A GENERAR EL MAPA CON LOS OBSTACULOS ALEATORIOS
        this.generar_mapa();
    }
    // ESTE ES MI METODO QUE VA A CREAR UNA MATRIZ Y COLOCAR LOS OBSTACULOS
    // VAMOS A CONSIDERAR 20% DEL TOTAL DE LAS CELDAS PARA COLOCAR LOS OBSTACULOS
    generar_mapa() {
        this.matriz = []; // inicializamos limpio la matriz

        // recorremos filas 
        for (let fila = 0; fila < this.filas; fila++) {
            const fila_array = []; // guardamos, creamos una nueva fila

            for(let columna = 0; columna < this.columnas; columna++) {
                fila_array.push(TERRENOS.LIBRE); // en el array metemos todo el objeto terreno libre
            }
            this.matriz.push(fila_array); // y aca agregamos la fila a la matriz
        }
        // ACA VAMOS A DEFINNIR CUANTOS OBSTACULOS VAMOS A COLOCAR Y OBVIAMENTE ALEATORIO VA A SER
        const total_obstaculos = Math.floor(this.filas * this.columnas * 0.2);
        let colocados = 0; // este es mi contador que va a tomar la cuenta de cuantos ya se puso

        // aca vamos a colocar los obstaculos hasta llegar al 20% del total del terreno
        while(colocados < total_obstaculos) {
            const f = Math.floor(Math.random() * this.filas); // redondeamos hacia abajo el numero decimal, y creamosun numero aleatorio
            const c = Math.floor(Math.random() * this.columnas);

            // SOLO VAMOS A PONER OBSTACULOS SI LA CELDA ESTA LIBRE 
            if (this.matriz[f][c] === TERRENOS.LIBRE) {
                const tipos = [TERRENOS.EDIFICIO, TERRENOS.AGUA, TERRENOS.BLOQUEADO]; // TIPOS DE OBSTACULOS
                const tipo = tipos[Math.floor(Math.random() * tipos.length)]; // aca elije uno al azar nomas

                this.matriz[f][c] = tipo; // aca colocamos el obstaculo en la matriz
                colocados++;
            }
        }
    }
    // ESTE ES MI METODO PARA VALIDAR LA COORDENADA - verifica si la coordenada este dentro de los limits
    es_coordenada_valida(fila, columna) {
        return (
            fila >= 0 && fila < this.filas &&
            columna >= 0 && columna < this.columnas
        );
    }
    // ESTE METODO DEVUELVE LA MATRIZ COMPLETA PARA PODER USAR
    obtener_matriz() {
        return this.matriz;
    }
}
// EXPORTAMOS PARA PODER USAR EN EL MAIN
export { Mapa, TERRENOS };
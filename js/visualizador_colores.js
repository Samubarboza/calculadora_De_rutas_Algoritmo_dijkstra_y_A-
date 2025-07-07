import { Visualizador } from "./visualizacion.JS";

class VisualizadorConColores extends Visualizador {
    constructor(contenedor_id) {
        super(contenedor_id); // usamos el constructor de la clase padre

        // definimos colores segun el tipo de terreno
        this.COLORES_TERRENO = {
            0: '#ffffff', 
            1: '#999999', 
            2: '#87cefa',
            3: '#ff4d4d'  
        };
    }
    // sobreescribimos el metodo para aplicar estilos visuales
    crearCelda(fila, columna, tipo, inicio, fin, celdasRuta) {
        const celda = document.createElement('td');
        celda.style.width = '30px';
        celda.style.height = '30px';
        celda.style.textAlign = 'center';
        celda.style.border = '1px solid #ccc';
        celda.style.backgroundColor = this.COLORES_TERRENO[tipo] || '#000';

        // si es parte de la ruta, le damos un color especial
        if(celdasRuta.has(`${fila},${columna}`)) {
            celda.style.backgroundColor = '#FFD700';
        }

        // si es el incio o el fin, lo marcamos con emojis encima del color
        if (inicio && fila === inicio[0] && columna === inicio[1]) {
            celda.textContent = '🟢';
        } else if (
            fin && fila === fin[0] && columna === fin[1]) {
                celda.textContent = '🚩';
            }
        return celda;
    }
}
export { VisualizadorConColores };
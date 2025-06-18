// esta es la clase que se encarga de dibujar el mapa en el dom html

class visualizador {
    constructor(contenedor_id) {
        // aca lo que hacemos es guardamos el elemento html donde vamos a mostrar el mapa
        this.contenedor = document.getElementById(contenedor_id);
    }

    mostrar_mapa(matriz, ruta = [], inicio = null, fin = null) {
        // limpiamos cualqueir contenido previo del contenedor para que no se acumule
        this.contenedor.innerHTML = '';

        // convertimos la ruta en un set para chequear rapido si una celda esta en el camino
        // la ruta viene como un array de coordenadas [fila, columna]
        const celdas_ruta = new Set(ruta.map(([f,c]) => `${f},${c}`));

        // creamos una tabla para representar el mapa con filas y columnas
        const tabla = document.createElement('table');
        tabla.style.borderCollapse = 'collapse'; // estilo para que no haya espacios entre celdas

        // recorremos cada fila de la matriz del mapa
        for (let fila = 0; fila < matriz.length; fila++) {
            const fila_html = document.createElement('tr'); // fila de la tabla

            // recorremos cada columna dento de la fila actual
            for (let columna = 0; columna < matriz[0].length; columna++) {
                const celda = document.createElement('td'); // celda de la tabla
                const tipo = matriz[fila][columna]; // obtenemos el tipo de terreno de esa celda

                // primero chequeamos si esta celda es el punto de inicio 
                if (inicio && fila === inicio[0] && columna === inicio[1]) {
                    celda.textContent = '🟢'; // marcamos con un circulo verde de inicio 
                }
                // si no, vamos a chequear si es el punto de fin 
                else if (fin && fila === fin[0] && columna === fin[1]) {
                    celda.textContent = '🚩'; // marcamos con la banderita que es el fin
                }
                // si no es inicio ni fin, mostramos el icono segun el tipo de terreno
                else {
                    switch (tipo) {
                        case 0: celda.textContent = '🔲'; break; // camino libre, paso normal
                        case 1: celda.textContent = '🏢'; break; // es un edificio
                        case 2: celda.textContent = '🌊'; break; // es agua
                        case 3: celda.textContent = '⛔'; break; // paso bloqueado
                        default: celda.textContent = '?'; break; // no definido
                    }
                    // si la celda esta en la ruta, camino calculado, le ponemos el fondo dorado
                    if (celdas_ruta.has(`${fila},${columna}`)) {
                        celda.style.backgroundColor = '#FFD700';
                    }
                }
                // estilos visuales para la celda que quede ordenado y legible
                celda.style.padding = '5px';
                celda.style.fontSize = '20px';
                celda.style.textAlign = 'center';

                // aca agregamos la celda a la fila
                fila_html.appendChild(celda);
            }
            // agregamos la fila completa a la tabla
            tabla.appendChild(fila_html);
        }
        // y aca insertamos la tabla entera en el contenedor del html
        this.contenedor.appendChild(tabla);
    }
}
export { visualizador };
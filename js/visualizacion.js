// esta clase se encargar de mostrar el mapa en el html
class visualizador {
    constructor(contenedor_id) {
        // ACA GUARDAMOS EL CONTENEDOR HTML DONDE SE VA A MOSTRAR EL MAPA EN EL HTML
        this.contenedor = document.getElementById(contenedor_id);
    }
    // CREAMOS UN METODO PARA QUE RECIBE LA MATRIZ, UNA RUTA Y LOS PUNTOS DE INICIO Y FIN
    mostrar_mapa(matriz, ruta = [], inicio = null, fin = null) {
        // aca limpiamos el contenido anterior asi no se acumulan mapas viejos cada vez que ejecutamos
        this.contenedor.innerHTML = '';

        // convertimos la ruta en un set de string tipo fila, columna
        
        const celdas_ruta = new Set(ruta.map(([f, c]) => `${f}, ${c}`)); // map va a recorrer un array y transformar cada elemento

        // ACA CREAMOS LA TABLA HTML DONDE VAMOS A RENDERIZAR EL MAPA
        const tabla = document.createElement('table'); // crea una etiqueta html <table> desde js
        tabla.style.borderCollapse = 'collapse'; // esto hace que los bordes de la celda se junten y quede mas prolijo para no tener doble

        // recorremos cada fila de la matriz
        for (let fila = 0; fila < matriz.length; fila++) {
            const fila_html = document.createElement('tr'); // creamos una fila de la tabla en el html

            // recorremos cada columna dentro de la fila actual
            for (let columna = 0; columna < matriz[0].length; columna++) {
                const celda = document.createElement('td'); // aca creo una celda
                const tipo = matriz[fila][columna]; // aca lo que hacemos es obtener el tipo de terreno

                // aca vamos a marcar el punto de partida, o sea el punto de inicio
                if (inicio && fila === inicio[0] && columna === inicio[1]) {
                    celda.textContent = '🟢'; 
                } // ya ca marcamos el fin
                else if (fin && fila === fin[0] && columna === fin[1]) {
                    celda.textContent = '🚩';
                }
                else {
                    switch (tipo) {
                        case 0: celda.textContent = '🔲'; break;
                        case 1: celda.textContent = '🏢'; break;
                        case 2: celda.textContent = '🌊'; break;
                        case 3: celda.textContent = '⛔'; break;
                        default: celda.textContent = '?'; break;
                    }
                    // aca lo que hacemos es verificar si la celda pertenece al camino calculado por el algoritmo
                    if (celdas_ruta.has(`${fila}, ${columna}`)) {
                        celda.style.backgroundColor = '#FFD700';
                    }
                }
                // aca solo le damos estilo visual
                celda.style.padding = '5px';
                celda.style.fontSize = '20px';
                celda.style.textAlign = 'center';

                // ya aca agregamos la celda ya construida a la fila html
                fila_html.appendChild(celda);
            }
            // una vez que la fila esta completa, agregamos a la tabla principal
            tabla.appendChild(fila_html);
        }
        // por ultimo lo que hago es agregar la tabla completa al contenedor html
        this.contenedor.appendChild(tabla);
    }
}
export { visualizador };
class Visualizador {
    constructor(contenedor_id) {
        this.contenedor = document.getElementById(contenedor_id);
        this.TIPOS_TERRENO = {
            0: '⬜',
            1: '🏢',
            2: '💧',
            3: '⛔'
        };
    }

    mostrar_mapa(matriz, ruta = [], inicio = null, fin = null) {
        this.limpiarContenedor();
        const celdasRuta = new Set(ruta.map(([f, c]) => `${f},${c}`));
        const tabla = this.crearTabla();

        // recorremos cada elemento del array
        matriz.forEach((fila, filaIndex) => {
            const filaHtml = this.crearFila();
            fila.forEach((tipo, colIndex) => {
                const celda = this.crearCelda(filaIndex, colIndex, tipo, inicio, fin, celdasRuta);
                filaHtml.appendChild(celda);
            });
            tabla.appendChild(filaHtml);
        });
        this.contenedor.appendChild(tabla);
    }

    limpiarContenedor() {
        this.contenedor.innerHTML = '';
    }

    crearTabla() {
        const tabla = document.createElement('table');
        return tabla;
    }

    crearCelda(fila, columna, tipo, inicio, fin, celdasRuta) {
        const celda = document.createElement('table');
        tabla.style.borderCollapse = 'collapse';
        return tabla;
    }

    crearFila() {
        return document.createElement('tr');
    }

    crearCelda(fila, columna, tipo, inicio, fin, celdasRuta) {
        const celda = document.createElement('td');
        celda.style.padding = '5px';
        celda.style.fontSize = '20px';
        celda.style.textAlign = 'center';

        // marcar inicio y fin
        if (inicio && fila === inicio[0] && columna === inicio[1]) {
            celda.textContent = '🟢';
        } else if (fin && fila === fin[0] && columna === fin[1]) {
            celda.textContent = '🚩';
        } else {
            celda.textContent = this.TIPOS_TERRENO[tipo] || '?';

            if (celdasRuta.has(`${fila},${columna}`)) {
                celda.style.backgroundColor = '#FFD700';
            }
        }
        return celda;
    }
}

export { Visualizador };
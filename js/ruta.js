// clase que solo se encarga de reconstruir el camino desde la matriz de predecesores, con camino mas corto
class Ruta {
    // metodo que reconstruye el camino desde el destino hacia el inicio
    static reconstruir(predecesores, fila_destino, columna_destino, fila_inicio, columna_inicio) {
        // aca guardamos el camino
        const camino = []; 
        // empezamos en la celda de destino
        let f = fila_destino;
        let c = columna_destino;


        // mientras haya una celda valida para recorrer hacia atras
        while (f !== null && c !== null) {
            camino.unshift([f, c]); // insertamos al principio la celda actual (para dejar ordenado, d inicio a fin)

            const anterior = predecesores[f][c];// buscamos la celda previa en el camino
            if (!anterior) break; // si no hay predecesor paramos

            // actualizamos la fila y columna para seguir retrocediendo
            f = anterior[0];
            c = anterior[1];
        }

        // validamos que el camino empiece en el lugar correcto, o sea la posiciond e incio 
        if (camino.length === 0 || camino[0][0] !== fila_inicio || camino[0][1] !== columna_inicio) {
            return null; // no hay ruta válida
        }
        // devolvemos el camino reconstruido desde el inicio hasta el destino
        return camino;
    }
}

export { Ruta };

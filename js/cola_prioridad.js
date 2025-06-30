// mi clase maneja cola de prioridad usando un array ordenado
class ColaPrioridad {
    constructor() {
        // guarda los elementos con su prioridad
        this.elementos = [];
    }
    // metodo para agregar un elemento junto con su prioridad
    encolar(elemento, prioridad) {
        this.elementos.push({ elemento, prioridad }); // agrego al final
        // ordenamos el array segun la prioridad ascendente, o sea el menor es primero
        this.elementos.sort((a, b) => a.prioridad - b.prioridad);
    }
    // metodo para sacar y devolver elemento con menor prioridad (el primero del array)
    desencolar() {
        return this.elementos.shift()?.elemento; // saca y devuelve el elemento y no la prioridad
    }

    // metodo para saber si la cola esta vacia
    esta_vacia() {
        return this.elementos.length === 0;
    }
}
export { ColaPrioridad };

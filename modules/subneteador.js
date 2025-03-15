export default class Subneteador {
    #redes;
    #rangos;
    constructor() {
        this.#rangos = [];
        this.#redes = [];
    }

    getRangos() {
        return this.#rangos;
    }

    getRedes() {
        return this.#redes;
    }

    // Método privado para definir la clase de la red
    #definirClase() {
        const totalHosts = [...this.#redes].reduce((suma, numero) => suma + numero);
        let ipInicial = [];
        if (totalHosts <= 220) {
            ipInicial = [192, 168, 0, 0];
        } else if (totalHosts > 220 && totalHosts < 65500) {
            ipInicial = [172, 16, 0, 0];
        } else {
            ipInicial [10, 0, 0, 0];
        }
        return ipInicial;
    }

    // Metodo para calcular las redes con VLSM
    calcularRedes(redes) {
        this.#rangos = [];
        this.#redes = redes;
        const hostsOrdenados = [...this.#redes].sort((a, b) => b - a);
        let ipInicial = this.#definirClase();
        hostsOrdenados.forEach(red => {
            let nBits = (red + 1).toString(2).length;
            let mascara = 32 - nBits;
            let hosts = 2 ** nBits;

            let ipInicialEntero = (ipInicial[0] << 24) | (ipInicial[1] << 16) | (ipInicial[2] << 8) | ipInicial[3]
            let ipFinalEntero = ipInicialEntero + hosts - 1;
            let ipFinal = [
                (ipFinalEntero >> 24) & 0xFF,
                (ipFinalEntero >> 16) & 0xFF,
                (ipFinalEntero >> 8) & 0xFF,
                ipFinalEntero & 0xFF
            ];
            this.#rangos.push({
                red: ipInicial,
                mascara: mascara,
                hosts_totales: hosts,
                hosts_disponibles: hosts - 2,
                broadcast: ipFinal
            });
            ipInicialEntero = ipFinalEntero + 1;
            ipInicial = [
                (ipInicialEntero >> 24) & 0xFF,
                (ipInicialEntero >> 16) & 0xFF,
                (ipInicialEntero >> 8) & 0xFF,
                ipInicialEntero & 0xFF
            ];
        });
        return this.#rangos;
    }

    // Metodo para calcular los octetos de una mascara de red
    calcularMascara(nBits) {
        let mascara = (1 << nBits) - 1;
        mascara <<= (32 - nBits);
        let octetos = [
            (mascara >> 24) & 0xFF,
            (mascara >> 16) & 0xFF,
            (mascara >> 8) & 0xFF,
            mascara & 0xFF
        ];
        return octetos;
    }
}
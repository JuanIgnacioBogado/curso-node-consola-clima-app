require('dotenv').config();
require('colors');

const {
    leerInput,
    inquirerMenu,
    pausa,
    listarLugares
} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {
    let opt;
    const busquedas = new Busquedas();

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                const termino = await leerInput('Ciudad:');
                const lugares = await busquedas.ciudad(termino);
                const id = await listarLugares(lugares);
                if (id === 0) continue;

                const {nombre, lat, lng} = lugares.find(lugar => lugar.id === id);
                busquedas.agregarHistorial(nombre);
                const {desc, min, max, temp} = await busquedas.climaLugar(lat, lng);

                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', nombre.green);
                console.log('Lat:', lat);
                console.log('Lng:', lng);
                console.log('temperatura:', `${temp} C°`.blue);
                console.log('Mínima:', `${min} C°`.blue);
                console.log('Máxima:', `${max} C°`.blue);
                console.log('Como está el clima:', desc.green);
            break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
            break;
        }

        opt !== 0 && await pausa();
    } while (opt !== 0);
};

main();
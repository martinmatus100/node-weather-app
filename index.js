require('dotenv').config();

const { readInput, inquirerMenu, pause, listPlaces } = require("./helpers/inquirer");
const Searches = require("./models/searches");

const main = async() => {
    const searches =  new Searches();
    let opt;

    do{
        opt = await inquirerMenu();

        switch( opt ) {
            case 1:
                //  SHOW MESAGGE
                const term = await readInput('City: ');

                //  SEARCH PLACES
                const places = await searches.city( term );

                //  SELECT PLACE
                const idSelected = await listPlaces( places );
                if ( idSelected === '0') continue;

                const placeSel = places.find( p => p.id === idSelected );

                // SAVE DB
                searches.addHistory( placeSel.name );

                //  WEATHER
                const weather = await searches.weatherPlace( placeSel.lat, placeSel.lng );

                // SHOW RESULTS
                console.clear();
                console.log('\nCity information\n'.green);
                console.log('City: ', placeSel.name.green );
                console.log('Lat: ', placeSel.lat );    
                console.log('Lng: ', placeSel.lng );
                console.log('Temp: ', weather.temp );
                console.log('Min: ', weather.min ); 
                console.log('Max: ', weather.max );    
                console.log("What's the weather like?: ", weather.desc.green );    

            break;

            case 2:
                searches.historyCapitalized.forEach( ( place, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ place }`);
                })
            break;
        }

        if ( opt !== 0 ) await pause();

    } while ( opt !== 0)
}

main();
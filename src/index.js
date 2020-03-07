

// You can require libraries
const d3 = require('d3')

// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();

// Gets included in js bundle
const data_nuclear_only = require('./country_nuclear_status.json');

// Loaded over network due to size
d3.csv('all_fuels.csv')
  .then((data) => {
    // console.log('Dynamically loaded CSV data', data);
    // Do stuff
  });

/*const Map = require('./map.js');
const MapInstance = new Map(data_nuclear_only);
MapInstance.createMap();*/

const nuclear_powerplant_locations = require('./nuclear-only.json');

const CountryMap = require('./country_map.js');
const CountryMapInstance = new CountryMap(nuclear_powerplant_locations);
CountryMapInstance.makeCountryMap("United States of America", "#country-map-container");
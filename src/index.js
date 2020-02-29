

// You can require libraries
const d3 = require('d3')

// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();

// Gets included in js bundle
const data_nuclear_only = require('./nuclear-only.json');

// Loaded over network due to size
d3.csv('all_fuels.csv')
  .then((data) => {
    // console.log('Dynamically loaded CSV data', data);
    // Do stuff
  });

const Map = require('./map.js');
const MapInstance = new Map(data_nuclear_only);
MapInstance.createMap();

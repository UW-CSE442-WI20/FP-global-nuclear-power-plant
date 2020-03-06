

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

const Map = require('./map.js');
const MapInstance = new Map(data_nuclear_only);
MapInstance.createMap();

var control_spans = d3.selectAll('#map-control span')
    .on('click', function() {
        if (MapInstance.legend_choice != this.id) {
            MapInstance.legend_choice = this.id;
            control_spans.classed('selected', false);
            d3.select(`#${MapInstance.legend_choice}`)
                .classed('selected', true);
            MapInstance.refreshColorMap();
        }
    });
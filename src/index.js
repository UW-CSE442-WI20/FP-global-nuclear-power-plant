
const d3 = require('d3')

// Gets included in js bundle
const data_nuclear_only = require('./country_nuclear_status.json');
const nuclear_powerplants = require('./nuclear-only.json');

const Map = require('./country_map.js');
const USMapInstance = new Map(nuclear_powerplants, "#america-map", "United States of America");
USMapInstance.makeCountryMap();

d3.select('#america-container').on('mouseover', () => {
  USMapInstance.plotPlants();
  d3.select('#america-container').on('mouseover', null);
});

// plotPlants to make dots
// clearDots to clear the dots
const ChinaMapInstance = new Map(nuclear_powerplants, "#china-map", "China");
ChinaMapInstance.makeCountryMap();

const AustraliaMapInstance = new Map(nuclear_powerplants, "#australia-map", "Australia");
AustraliaMapInstance.makeCountryMap();

const JapanMapInstance = new Map(nuclear_powerplants, "#japan-map", "Japan");
JapanMapInstance.makeCountryMap();

const FranceMapInstance = new Map(nuclear_powerplants, "#france-map", "France");
FranceMapInstance.makeCountryMap();

const Dashboard = require('./dashboard.js');
const DashboardInstance = new Dashboard(data_nuclear_only);
DashboardInstance.createMap();

var control_spans = d3.selectAll('#map-control span')
    .on('click', function() {
        if (DashboardInstance.legend_choice != this.id) {
            DashboardInstance.legend_choice = this.id;
            control_spans.classed('selected', false);
            d3.select(`#${DashboardInstance.legend_choice}`)
                .classed('selected', true);
            DashboardInstance.refreshColorMap();
        }
    });
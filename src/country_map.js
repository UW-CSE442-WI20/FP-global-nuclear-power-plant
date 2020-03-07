const d3 = require('d3')

const height = 610;
const width = 700;

// const worldmap_geo_json = require('../static/world-for-countries.json'); // https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson
const worldmap_geo_json = require('../static/world-map-geo.json'); // https://github.com/topojson/world-atlas

const country_position = [
    {
        country: "France",
        scale: 2000,
        center: [2, 47]
    },
    {
        country: "Australia",
        scale: 700,
        center: [137, 330]
    },
    {
        country: "China",
        scale: 550,
        center: [105, 40]
    },
    {
        country: "Japan",
        scale: 1200,
        center: [135, 37]
    },
    {
        country: "United States of America",
        scale: 575,
        center: [-95, 40]
    }
]

class CountryMap {
    constructor(data) {
        this.nuclear_powerplant_locations = data;
    }

    makeCountryMap(country_name) {
        var svg = d3.select("#country-map-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        country_coord = {};
        for (let c of country_position) {
            if (c.country == country_name) {
                country_coord.scale = c.scale;
                country_coord.center = c.center;
            }
        }

        var projection = d3.geoMercator()
            .center(country_coord.center) // x, y lower y higher up it is
            .scale(country_coord.scale)
            .translate([width / 2, height / 2])

        var path = d3.geoPath()
            .projection(projection);

        svg.selectAll("path")
            .data(topojson.feature(worldmap_geo_json, worldmap_geo_json.objects.countries)
                .features.filter(function (d) { return country_name == d.properties.name; }))
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#aaaaaa");


        console.log(country_name);
        this.plotPlants(country_name);
    }

    plotPlants(country_name) {

    }
}

module.exports = CountryMap;
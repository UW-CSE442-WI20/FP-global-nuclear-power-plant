const d3 = require('d3')

const worldmap_geo_json = require('../static/world-map-geo.json'); // https://github.com/topojson/world-atlas

const height = 546;
const width = 1113;
var min_zoom;
var max_zoom;

var country_nuclear_data;

class Map {
    constructor(data) {
        country_nuclear_data = data;
    }

    createMap() {
        //let country_nuclear_counts = this.getCountryCounts();
        let color_scale = this.getColorScale();
        console.log(color_scale('Brazil'));
        console.log(    this.country_nuclear_data);

        let svg = d3.select("#map-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


        let projection = d3.geoMercator()
            .scale(width / 2 / Math.PI)
            .translate([width / 2, height / 1.55])

        let path = d3.geoPath()
            .projection(projection);
        
        svg.selectAll("path")
            .data(topojson.feature(worldmap_geo_json, worldmap_geo_json.objects.countries)
                .features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", function (d) {
                for (let c of country_nuclear_data) {
                    if (c.country == d.properties.name) { return color_scale(c.operating);}
                }
                return "#ececec";
            });
    }

    getCountryCounts() {
        let group_by_country = d3.nest()
            .key(function (d) { return d.country_long })
            .entries(country_nuclear_data);

        let country_nuclear_count = [];
        for (let country of group_by_country) {
            country_nuclear_count.push({ country: country.key, count: country.values.length });
        }

        return country_nuclear_count
    }

    getColorScale() {
        // domain means input range means output

        let scale = d3.scaleLinear()
            .domain([0, d3.max(country_nuclear_data, function (d) { return d["operating"]; })])
            .range(["#cecece", "#ea1616"]);
        return scale;
    }
}

module.exports = Map;
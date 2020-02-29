const d3 = require('d3')

const geomap_json = require('./world-map.json');

const height = 546;
const width = 1113;
var min_zoom;
var max_zoom;

class Map {


    constructor(data) {
        this.country_nuclear_data = data;
    }

    createMap() {
        let country_nuclear_counts = this.getCountryCounts();
        let color_scale = this.getColorScale(country_nuclear_counts);

        let svg = d3.select("#map-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


        let projection = d3.geoMercator()
            .scale(width / 2 / Math.PI)
            .translate([width / 2, height / 1.55])

        let path = d3.geoPath()
            .projection(projection);

        svg.append("path").attr("d", path(geomap_json));

        svg.selectAll("path")
            .attr("fill", function (d) {
                console.log(d);
                return color_scale(d["admin"]);
            });
    }

    getCountryCounts() {
        let group_by_country = d3.nest()
            .key(function (d) { return d.country_long })
            .entries(this.country_nuclear_data);

        let country_nuclear_count = [];
        for (let country of group_by_country) {
            country_nuclear_count.push({ country: country.key, count: country.values.length });
        }

        console.log(country_nuclear_count);
        return country_nuclear_count
    }

    getColorScale(data) {
        let country_list = [];
        let counts = [];
        for (let country of data) {
            country_list.push(country.country);
            counts.push(country.count);
        }
        console.log(country_list);
        console.log(counts)

        let scale = d3.scaleLinear()
            .domain(country_list)
            .range(["#cecece", "#ea1616"]);

        return scale;
    }
}

module.exports = Map;
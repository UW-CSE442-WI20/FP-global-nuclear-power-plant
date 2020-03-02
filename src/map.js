const d3 = require('d3')

const worldmap_geo_json = require('../static/world-map-geo.json'); // https://github.com/topojson/world-atlas

const height = 546;
const width = 1113;
var min_zoom = 1;
var max_zoom = 5;

var country_nuclear_data;
var countries_with_nuclear = [];
var path;
var svg;

var selected_country;

class Map {
    constructor(data) {
        country_nuclear_data = data;
        this.centered = null;

        for (let c of country_nuclear_data) {
            if (c.operating > 0) {
                countries_with_nuclear.push(c.country);
            }
        }
    }

    createMap() {
        let color_scale = this.getColorScale();
        console.log(countries_with_nuclear);

        svg = d3.select("#map-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


        let projection = d3.geoMercator()
            .scale(1 * width / 2 / Math.PI)
            .translate([width / 2, height / 1.55])

        path = d3.geoPath()
            .projection(projection);

        svg.selectAll("path")
            .data(topojson.feature(worldmap_geo_json, worldmap_geo_json.objects.countries)
                .features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", function (d) {
                for (let c of country_nuclear_data) {
                    if (c.country == d.properties.name) {
                        if (countries_with_nuclear.includes(d.properties.name)) {
                            return color_scale(c.operating);
                        } else if (c.permanent_shutdown > 0) {
                            return "#90ee90";
                        } else if (c.abandoned_construction > 0) {
                            return "#b19cd9";
                        }
                    }
                }
                return "#ececec";
            })
            .on("click", this.clicked);

        // temp fix
        countries_with_nuclear.push('Philippines');
    }

    getColorScale() {
        // domain means input range means output
        let scale = d3.scaleLinear()
            .domain([0, d3.max(country_nuclear_data, function (d) { return d["operating"]; })])
            .range(["#ffc0cb", "#ff0000"]);
        return scale;
    }

    //clicked
    clicked(d) {
        var dx, dy, k;
        
        var country = d.properties.name;

        if (selected_country !== country && countries_with_nuclear.includes(country)) {
            var centroid = path.centroid(d);

            dx = width / 2 - centroid[0];
            dy = height / 2 - centroid[1];

            var bounds = path.bounds(d);
            var boxw = bounds[1][0] - bounds[0][0];
            var boxh = bounds[1][1] - bounds[0][1];

            k = Math.min(width / (2 * boxw), height / (2 * boxh));
            if (k < min_zoom) k = min_zoom;
            if (k > max_zoom) k = max_zoom;

            selected_country = country;
            svg.selectAll("path")
                .classed("active", function (d) { return d.properties.name === selected_country; })
        } else {
            dx = 0, dy = 0, k=1;

            selected_country = -1;
            svg.selectAll('path')
                .classed('active', false);
        }

        svg.transition()
            .duration(750)
            .attr("transform", `scale(${k})translate(${dx},${dy})`);
    }
}

module.exports = Map;
const d3 = require('d3')

const worldmap_geo_json = require('../static/world-map-geo.json'); // https://github.com/topojson/world-atlas

const height = 546;
const width = 1113;
var min_zoom;
var max_zoom;

var country_nuclear_data;
var countries_with_nuclear = [];
var path;
var svg;

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
            .scale(width / 2 / Math.PI)
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
            .on("click", this.clicked)
            .on("click", this.getCountryInfo);
    }

    getColorScale() {
        // domain means input range means output
        let scale = d3.scaleLinear()
            .domain([0, d3.max(country_nuclear_data, function (d) { return d["operating"]; })])
            .range(["#ffc0cb", "#ff0000"]);
        return scale;
    }

    getCountryInfo(d) {
        // percentage and 
        getLightBubls();
    }

    //clicked
    clicked(d) {
        var x, y, k;
        //if not centered into that country and clicked country in visited countries
        if ((d && this.centered !== d) & (countries_with_nuclear.includes(d.properties.name))) {
            var centroid = path.centroid(d); //get center of country
            var bounds = path.bounds(d); //get bounds of country
            var dx = bounds[1][0] - bounds[0][0], //get bounding box
                dy = bounds[1][1] - bounds[0][1];
            //get transformation values
            x = (bounds[0][0] + bounds[1][0]) / 2;
            y = (bounds[0][1] + bounds[1][1]) / 2;
            k = Math.min(width / dx, height / dy);
            this.centered = d;
        } else {
            //else reset to world view
            x = width / 2;
            y = height / 2;
            k = 1;
            this.centered = null;
        }
        //set class of country to .active
        svg.selectAll("path")
            .classed("active", this.centered && function (d) { return d === this.centered; })


        // make contours thinner before zoom for smoothness
        if (this.centered !== null) {
            svg.selectAll("path")
                .style("stroke-width", (0.75 / k) + "px");
        }

        // map transition
        svg.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .on('end', function () {
                if (centered === null) {
                    svg.selectAll("path")
                        .style("stroke-width", (0.75 / k) + "px");
                }
            });
    }

    getLightBulbs(percentage, country) {
        var stringP = percentage.toFixed(2).bold();
        document.getElementById("lightbulbs").innerHTML = '<h1 style="display:inline">' + stringP + '%</h1><p style="display:inline";> of the energy source in </p></br><h1 style="display:inline";> '
            + country + '</h1><p style="display:inline";> is powered by nuclear energy</p></br>';
        var lightBulbs = Math.round(percentage);
        let allBulb = '';
        for (var i = 0; i < lightBulbs; i++) allBulb += '<img src="/LightBulb.png" style="width: 11%;">';
        for (var i = 0; i < 100 - lightBulbs; i++) allBulb += '<img src="/Dimbulb.44b548c1.png" style="width: 11%;">';
        document.getElementById("lightbulbs").innerHTML += allBulb;
    }

    getFactories(working, inProgress, abandon) {
        document.getElementById("plants").innerHTML = '';
        let allplants = '';
        for (var i = 0; i < working; i++) allplants += '<img src="/workingPlant.png" style="width: 5%;">';
        for (var i = 0; i < inProgress; i++) allplants += '<img src="/inProgressPlant.png" style="width: 5%;">';
        for (var i = 0; i < abandon; i++) allplants += '<img src="/abandon.png" style="width: 5%;">';
        document.getElementById("plants").innerHTML = allplants;
    }
}

module.exports = Map;
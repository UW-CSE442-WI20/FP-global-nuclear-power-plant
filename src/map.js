const d3 = require('d3')

const worldmap_geo_json = require('../static/world-map-geo.json'); // https://github.com/topojson/world-atlas

const height = 546;
const width = 1113;
var min_zoom = 1.5;
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

        this.world_operating_capacity = 0;
        this.word_total_operating = 0;
        this.world_total_inprogess = 0;
        this.world_total_shutdown = 0;
        for (let c of country_nuclear_data) {
            if (c.operating > 0) {
                countries_with_nuclear.push(c.country);
            }
            if (c.operating_total_capacity) {
                this.world_operating_capacity += c.operating_total_capacity;
            }
            if (c.country == "World") {
                this.word_total_operating = c.operating;
                this.world_total_inprogess = c.under_construction;
                this.world_total_shutdown = c.abandoned_construction + c.longterm_outage + c.permanent_shutdown;
            }
        }
    }

    createMap() {
        let color_scale = this.getColorScale();

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
            .on('click', this.clicked);

        this.resetValuesToWorld();

        // temp fix
        countries_with_nuclear.push('Philippines');
    }

    resetValuesToWorld() {
        this.getLightBulbs(100, "World");
        this.getFactories(this.word_total_operating, this.world_total_inprogess, this.world_total_shutdown);
    }

    getColorScale() {
        // domain means input range means output
        let scale = d3.scaleLinear()
            .domain([0, d3.max(country_nuclear_data, function (d) { return d["operating"]; })])
            .range(["#ffc0cb", "#ff0000"]);
        return scale;
    }

    getCountryInfo(d) {
        console.log(d.properties.name);
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
            svg.selectAll('path')
                .classed('active', function (d) { return d.properties.name === selected_country; })
        } else {
            dx = 0, dy = 0, k=1;

            selected_country = -1;
            svg.selectAll('path')
                .classed('active', false);
        }

        svg.transition()
            .duration(750)
            .attr('transform', `scale(${k})translate(${dx},${dy})`);
    }

    getLightBulbs(percentage, country) {
        var string_p = percentage.toFixed(2).bold();
        document.getElementById("lightbulbs").innerHTML = '<h1 style="display:inline">' + string_p + '%</h1><p style="display:inline";> of the energy source in </p></br><h1 style="display:inline";> '
            + country + '</h1><p style="display:inline";> is powered by nuclear energy</p></br>';
        var lightbulbs = Math.round(percentage);
        let all_bulbs = '';
        for (var i = 0; i < lightbulbs; i++) all_bulbs += '<img src="/LightBulb.png" style="width: 11%;">';
        for (var i = 0; i < 100 - lightbulbs; i++) all_bulbs += '<img src="/Dimbulb.44b548c1.png" style="width: 11%;">';
        document.getElementById("lightbulbs").innerHTML += all_bulbs;
    }

    getFactories(working, in_progress, abandon) {
        document.getElementById("plants").innerHTML = '';
        let all_plants = '';
        for (var i = 0; i < working; i++) all_plants += '<img src="/workingPlant.png" style="width: 5%;">';
        for (var i = 0; i < in_progress; i++) all_plants += '<img src="/inProgressPlant.png" style="width: 5%;">';
        for (var i = 0; i < abandon; i++) all_plants += '<img src="/abandon.png" style="width: 5%;">';
        document.getElementById("plants").innerHTML = all_plants;
    }
}

module.exports = Map;
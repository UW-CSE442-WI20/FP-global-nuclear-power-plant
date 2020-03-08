const d3 = require('d3')

const worldmap_geo_json = require('../static/world-map-geo.json'); // https://github.com/topojson/world-atlas

var country_nuclear_data;
var countries_with_data = [];
var path;
var svg;

const height = 546;
const width = 1113;

// Minimum and maximum zoom levels when clicking on a country
var min_zoom = 2;
var max_zoom = 5;

// Scale factor for zoom (1 means match bounding box of country)
var zoom_scale = .5;

// currently highlighted country
var selected_country;

// upper bounds for the color maps
let bounds_percent = [0, 10, 30, 50, 70, 100];
let bounds_construction = [0, 1, 2, 5, 8, 11];
let bounds_ratio = [0, .2, .4, .6, .8, 1];

// legend descriptions
let legend_text_percent = ['0%', '1-10%', '11-30%', '31-50%', '51-70%' , '71-100%'];
let legend_text_construction = ['0', '1', '2', '3-5', '6-10', '11+'];
let legend_text_ratio = ['No Nuclear', '0-20%', '21-40%', '41-60%', '61-80%', '81-100%'];

let teal_blue_colors = ['#ececec', '#bce4d8', '#81c4cb','#45a2b9', '#347da0', '#2c5985'];
let orange_blue_colors = ['#ececec', '#d45b22', '#f69035', '#AAA194', '#78add3', '#5083af'];

let color_scale_percent = createColorScale(bounds_percent, teal_blue_colors);
let color_scale_construction = createColorScale(bounds_construction, teal_blue_colors);
let color_scale_ratio = createColorScale(bounds_ratio, orange_blue_colors);

class Dashboard {
    constructor(data) {
        country_nuclear_data = data;

        // column to be color-encoded on the map: 'nuclear_share_percentage', 'under_construction', or 'active_total_ratio'
        this.legend_choice = 'nuclear_share_percentage';

        this.word_total_operating = 0;
        this.world_total_inprogess = 0;
        this.world_total_shutdown = 0;

        for (let c of country_nuclear_data) {
            countries_with_data.push(c.country);
            if (c.country == "World") {
                this.word_total_operating = c.operating;
                this.world_total_inprogess = c.under_construction;
                this.world_total_shutdown = c.abandoned_construction + c.longterm_outage + c.permanent_shutdown;
            }
        }
    }

    createMap() {
        svg = d3.select("#map-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


        let projection = d3.geoMercator()
            .scale(1 * width / 2 / Math.PI)
            .translate([width / 2, height / 1.55])

        path = d3.geoPath()
            .projection(projection);

        this.countryPath = svg.selectAll("path")
            .data(topojson.feature(worldmap_geo_json, worldmap_geo_json.objects.countries)
                .features)
            .enter()
            .append("path")
            .attr("d", path)
            .on('click', function (d) {
                this.getCountryInfo(d);
                this.clicked(d);
            }.bind(this))


        this.refreshColorMap();

        this.resetValuesToWorld();

        d3.select(`#${this.legend_choice}`).classed('selected', true);
    }

    refreshColorMap() {
        let color_list, text_list;
        switch(this.legend_choice) {
            case 'under_construction':
                color_list = teal_blue_colors;
                text_list = legend_text_construction;
                break;
            case 'active_total_ratio':
                color_list = orange_blue_colors;
                text_list = legend_text_ratio;
                break;
            default:
                color_list = teal_blue_colors;
                text_list = legend_text_percent;
                break;
        }

        var legend_table = d3.select('#map-legend table');
        for (var i = 0; i < 6; i++) {
            legend_table.select(`.c${i} .color`)
                .style('background-color', color_list[i])
            legend_table.select(`.c${i} .text`)
                .text(text_list[i])
        }

        this.countryPath
            .transition()
            .duration(1000)
            .attr('fill', function (d) {
                for (let c of country_nuclear_data) {
                    if (c.country == d.properties.name && countries_with_data.includes(d.properties.name)) {
                        let color;
                        switch (this.legend_choice) {
                            case 'under_construction':
                                color = color_scale_construction(c.under_construction);
                                break;
                            case 'active_total_ratio':
                                color = color_scale_ratio(c.active_total_ratio);
                                break;
                            default:
                                color = color_scale_percent(c.nuclear_share_percentage);
                                break;
                        }
                        return color;
                    }
                }
                return "#ececec"; // else no data
            }.bind(this))
    }

    // runs whenever a *country* is clicked, TODO also run when background is clicked
    clicked(d) {
        var dx, dy, k;

        var country = d.properties.name;

        if (selected_country !== country) {
            var centroid = path.centroid(d);

            dx = width / 2 - centroid[0];
            dy = height / 2 - centroid[1];

            var bounds = path.bounds(d);
            var boxw = bounds[1][0] - bounds[0][0];
            var boxh = bounds[1][1] - bounds[0][1];

            k = Math.min(width / boxw, height / boxh) * zoom_scale;
            if (k < min_zoom) k = min_zoom;
            if (k > max_zoom) k = max_zoom;

            selected_country = country;
            svg.selectAll('path')
                .classed('active', function (d) { return d.properties.name === selected_country; })

            for (let c of country_nuclear_data) {
                if (c.country == selected_country) {
                    let country = c.country;
                    if (country === "United States of America") {country = "United States";}
                    this.getLightBulbs(c.nuclear_share_percentage, country);
                    this.getFactories(c.operating, c.under_construction, c.abandoned_construction + c.longterm_outage + c.permanent_shutdown);
                    break;
                }
            }
        } else {
            this.resetValuesToWorld();
            dx = 0, dy = 0, k = 1;

            selected_country = -1;
            svg.selectAll('path')
                .classed('active', false);
        }

        svg.transition()
            .duration(750)
            .attr('transform', `scale(${k})translate(${dx},${dy})`);
    }

    resetValuesToWorld() {
        this.getLightBulbs(10.15, "The World");
        this.getFactories(this.word_total_operating, this.world_total_inprogess, this.world_total_shutdown);
    }

    getCountryInfo(d) {
        for (let c of country_nuclear_data) {
            if (c.country == d.properties.name) {
                this.getLightBulbs(c.nuclear_share_percentage, c.country);
                this.getFactories(c.operating, c.under_construction, c.abandoned_construction + c.longterm_outage + c.permanent_shutdown);
                return;
            }
        }
       this.nonNuclearCountry(d.properties.name);
    }

    getLightBulbs(percentage, country) {
        const TOTAL_BULBS = 20;

        // fix crashes when a country doesn't have a percentage
        if (percentage == '') percentage = 0;

        // fix text overflow
        if (country === 'United States of American') country = 'United States';

        var string_p = percentage.toFixed(2).bold();
        var lightbulbs = Math.round(percentage * (TOTAL_BULBS / 100));
        var all_bulbs = '';
        for (var i = 0; i < lightbulbs; i++) all_bulbs += '<img src="./LightBulb.png">';
        for (var i = 0; i < TOTAL_BULBS - lightbulbs; i++) all_bulbs += '<img src="./Dimbulb.png">';

        document.getElementById('country-text').innerHTML = country;
        document.getElementById('percentage-text').innerHTML = `gets ${string_p}% <br>of its power from nuclear energy.`;
        document.getElementById('lightbulbs').innerHTML = all_bulbs;
    }

    getFactories(working, in_progress, abandon) {
        if (working == '') working = 0;
        if (in_progress == '') in_progress = 0;
        if (abandon == '') abandon = 0;
        
        document.getElementById('plants-working').innerText = working;
        document.getElementById('plants-ip').innerText = in_progress;
        document.getElementById('plants-abandon').innerText = abandon;
    }

    nonNuclearCountry(country) {
        document.getElementById('country-text').innerHTML = country;
        document.getElementById('percentage-text').innerHTML = '<br />has no nuclear power plants';
        document.getElementById('lightbulbs').innerHTML = '';

        this.getFactories(0, 0, 0);
    }
}

module.exports = Dashboard;

// upper_bounds is an int array of the inclusive upper bound of each bin (starting at 0)
// colors is a string array of equal length
// returns a callable function that functions like a d3 scale, but for colors
function createColorScale(upper_bounds, colors) {
    return function(value) {
        for (var i = 0; i < upper_bounds.length; i++) {
            if (value <= upper_bounds[i]) return colors[i];
        }
        return '#ececec';
    }
}
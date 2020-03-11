const d3 = require('d3')

const worldmap_geo_json = require('../static/world-map-geo.json'); // https://github.com/topojson/world-atlas

// SVG height and width (TODO: why are these set to such arbitrary values??)
const height = window.innerHeight * 3 / 4;
const width = window.innerWidth * 3 / 4;

console.log(`width:${width}, height: ${height}`);

// Minimum and maximum zoom levels when clicking on a country
const min_zoom = 2;
const max_zoom = 5;

// Scale factor for zoom (1 means match bounding box of country)
const zoom_scale = .5;

// Country border thickness when zoomed out
const default_stroke_width = 0.5;

// Upper bounds for the color maps
const bounds_percent = [0, 10, 30, 50, 70, 100];
const bounds_construction = [0, 1, 2, 5, 8, 11];
const bounds_ratio = [0, .2, .4, .6, .8, 1];

// Legend descriptions
const legend_text_percent = ['0%', '1-10%', '11-30%', '31-50%', '51-70%' , '71-100%'];
const legend_text_construction = ['0', '1', '2', '3-5', '6-10', '11+'];
const legend_text_ratio = ['No Nuclear', '0-20%', '21-40%', '41-60%', '61-80%', '81-100%'];

const teal_blue_colors = ['#ececec', '#bce4d8', '#81c4cb','#45a2b9', '#347da0', '#2c5985'];
const orange_blue_colors = ['#ececec', '#d45b22', '#f69035', '#AAA194', '#78add3', '#5083af'];

// Color scale functions
const color_scale_percent = createColorScale(bounds_percent, teal_blue_colors);
const color_scale_construction = createColorScale(bounds_construction, teal_blue_colors);
const color_scale_ratio = createColorScale(bounds_ratio, orange_blue_colors);


// Currently highlighted country
var selected_country;

var country_nuclear_data;
var countries_with_data = [];
var geo_path;
var map_container;

// World info values
world_total_operating = 0;
world_total_inprogess = 0;
world_total_shutdown = 0;

class Dashboard {
    constructor(data) {
        country_nuclear_data = data;

        // column to be color-encoded on the map: 'nuclear_share_percentage', 'under_construction', or 'active_total_ratio'
        // created as class variable to be accessible from outside this file (temp hack for #map-control functionality)
        this.legend_choice = 'nuclear_share_percentage';

        for (let c of country_nuclear_data) {
            countries_with_data.push(c.country);
            if (c.country == "World") {
                world_total_operating = c.operating;
                world_total_inprogess = c.under_construction;
                world_total_shutdown = c.abandoned_construction + c.longterm_outage + c.permanent_shutdown;
            }
        }
    }

    createMap() {
        map_container = d3.select('#map-container')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        let projection = d3.geoMercator()
            .scale(width / 2 / Math.PI * 1.05)
            .translate([width / 2, height / 1.75])
            // .translate([width / 2, height / 1.55])

        geo_path = d3.geoPath()
            .projection(projection);

        this.country_path = map_container.selectAll('path')
            .data(topojson.feature(worldmap_geo_json, worldmap_geo_json.objects.countries)
                .features)
            .enter()
            .append('path')
            .attr('d', geo_path)
            .style('stroke', '#ffffff')
            .style('stroke-width', default_stroke_width)
            .on('click', function (d) {
                d3.event.stopPropagation();
                this.getCountryInfo(d);
                this.clicked(d);
            }.bind(this))

        this.refreshColorMap();
        this.resetToWorld();

        d3.select(`#${this.legend_choice}`).classed('selected', true);

        // return to world view if the ocean is clicked
        d3.select('#map-container>svg')
            .on('click', function () {
                this.resetToWorld();
            }.bind(this))
    }

    // updates the legend and the map to reflect a new encoding selection
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

        this.country_path
            .transition()
            .duration(1000)
            .attr('fill', function (d) {
                for (let c of country_nuclear_data) {
                    if (c.country == d.properties.name && countries_with_data.includes(d.properties.name)) {
                        switch (this.legend_choice) {
                            case 'under_construction':
                                return color_scale_construction(c.under_construction);
                            case 'active_total_ratio':
                                return color_scale_ratio(c.active_total_ratio);
                            default:
                                return color_scale_percent(c.nuclear_share_percentage);
                        }
                    }
                }
                return "#ececec"; // else no data
            }.bind(this))
    }

    // runs whenever a *country* is clicked
    clicked(d) {
        var dx, dy, k;

        var country = d.properties.name;

        if (selected_country !== country) {
            var centroid = geo_path.centroid(d);

            dx = width / 2 - centroid[0];
            dy = height / 2 - centroid[1];

            var bounds = geo_path.bounds(d);
            var boxw = bounds[1][0] - bounds[0][0];
            var boxh = bounds[1][1] - bounds[0][1];

            k = Math.min(width / boxw, height / boxh) * zoom_scale;
            if (k < min_zoom) k = min_zoom;
            if (k > max_zoom) k = max_zoom;

            // console.log(`${country} -- dx:${dx}, dy:${dy}, k:${k}, k*dx:${k*dx}, k*dy:${k*dy}`)

            // if (k * dx > width / 2) dx = (width / 2) / k;
            // if (k * dy > height / 2) dy = (height / 2) / k;

            selected_country = country;
            map_container.selectAll('path')
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

            this.zoomMap(k, dx, dy);
        } else {
            this.resetToWorld();
        }
    }

    resetToWorld() {
        this.getLightBulbs(10.15, "The World");
        this.getFactories(world_total_operating, world_total_inprogess, world_total_shutdown);
        
        selected_country = -1;
        map_container.selectAll('path')
            .classed('active', false)

        this.zoomMap(1, 0, 0);
    }

    zoomMap(k, dx, dy) {
        this.country_path.style('stroke-width', default_stroke_width / k);

        map_container.transition()
            .duration(750)
            .attr('transform', `scale(${k})translate(${dx},${dy})`);
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
        const total_bulbs = 20;

        // fix crashes when a country doesn't have a percentage
        if (percentage == '') percentage = 0;

        // fix text overflow
        if (country === 'United States of American') country = 'United States';

        var string_p = percentage.toFixed(2).bold();
        var lightbulbs = Math.round(percentage * (total_bulbs / 100));
        var all_bulbs = '';
        for (var i = 0; i < lightbulbs; i++) all_bulbs += '<img src="./LightBulb.png">';
        for (var i = 0; i < total_bulbs - lightbulbs; i++) all_bulbs += '<img src="./Dimbulb.png">';

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
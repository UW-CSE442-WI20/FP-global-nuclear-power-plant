// needs to be in a div like
// <div id="country-map-container" style="width: 700px; height: 610px;">

const d3 = require('d3')

const height = 510;
const width = 700;

const worldmap_geo_json = require('../static/world-map-geo.json'); // https://github.com/topojson/world-atlas

const country_position = [
    {
        country: "France",
        scale: 1800,
        center: [2, 47]
    },
    {
        country: "Australia",
        scale: 600,
        center: [137, 333]
    },
    {
        country: "China",
        scale: 550,
        center: [105, 40]
    },
    {
        country: "Japan",
        scale: 1200,
        center: [135, 38]
    },
    {
        country: "United States of America",
        scale: 575,
        center: [-95, 42]
    }
]

class CountryMap {
    constructor(data, container, country_name) {
        this.nuclear_powerplant_locations = data;
        this.container = container;
        this.country_name = country_name;
        this.svg = null;
        this.projection = null;

        this.dotsID = `#${country_name}dots`;
        this.tooltipsID = `#${country_name}tooltips`;
    }

    // pass in the name of the country and the div it should be in
    makeCountryMap() {
        this.svg = d3.select(this.container)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            ;

        country_coord = {};
        for (let c of country_position) {
            if (c.country == this.country_name) {
                country_coord.scale = c.scale;
                country_coord.center = c.center;
            }
        }

        this.projection = d3.geoMercator()
            .center(country_coord.center) // x, y lower y higher up it is
            .scale(country_coord.scale)
            .translate([width / 2, height / 2])

        let path = d3.geoPath()
            .projection(this.projection);

        this.svg.selectAll("path")
            .data(topojson.feature(worldmap_geo_json, worldmap_geo_json.objects.countries)
                .features.filter(function (d) {
                    return this.country_name === d.properties.name;
                }.bind(this)))
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#aaaaaa");

        // this.plotPlants();
    }

    plotPlants() {
        let powerplants = [];
        for (let c of this.nuclear_powerplant_locations) {
            if (c.country_long == this.country_name) {
                powerplants.push(c);
            }
        }

        // organize the data here!
        powerplants.sort(function (x, y) {
            return d3.ascending(x.commissioning_year, y.commissioning_year);
        });

        let min_year = d3.min(powerplants, function (d) { return d.commissioning_year; })

        console.log(min_year);
        console.log(powerplants);

        let tooltip = d3.select(this.container)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        console.log(tooltip)


        let circles = this.svg.selectAll(".pin")
            .data(powerplants)
            .enter()
            .append("circle", ".pin")
            .attr("r", 5)
            .attr("id", this.dotsID)
            .attr("transform", function (d) {
                return "translate(" + this.projection([
                    d.longitude,
                    800
                ]) + ")";
            }.bind(this))
            .style("fill", "#000000")
            .style("stroke", "#add8e6")
            .style("stroke-width", 2)
            .on("mouseover", function(d) {      
                tooltip.transition()        
                    .duration(150)      
                    .style("opacity", 1);      
                tooltip.html(d.name)  
                .style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");     
                })                  
            .on("mouseout", function(d) {       
                tooltip.transition()        
                    .duration(500)      
                    .style("opacity", 0);   
            });

        circles
            .transition()
            .delay(function (d, i) { return i * 200; })
            .duration(800)
            .ease(this.customBounce(.08))
            .attr("transform", function (d) {
                return "translate(" + this.projection([
                    d.longitude,
                    d.latitude
                ]) + ")";
            }.bind(this));
    }

    customBounce(h) {
        if (!arguments.length) h = 0.25;
        var b0 = 1 - h,
            b1 = b0 * (1 - b0) + b0,
            b2 = b0 * (1 - b1) + b1,
            x0 = 2 * Math.sqrt(h),
            x1 = x0 * Math.sqrt(h),
            x2 = x1 * Math.sqrt(h),
            t0 = 1 / (1 + x0 + x1 + x2),
            t1 = t0 + t0 * x0,
            t2 = t1 + t0 * x1,
            m0 = t0 + t0 * x0 / 2,
            m1 = t1 + t0 * x1 / 2,
            m2 = t2 + t0 * x2 / 2,
            a = 1 / (t0 * t0);
        return function (t) {
            return t >= 1 ? 1
                : t < t0 ? a * t * t
                    : t < t1 ? a * (t -= m0) * t + b0
                        : t < t2 ? a * (t -= m1) * t + b1
                            : a * (t -= m2) * t + b2;
        };
    }

    /* call this function like this
    d3.select('#button').on('click', () => {
        CountryMapInstance.clearDots()
    });
    */
    clearDots() {
        d3.select(this.container).selectAll("circle").remove();
        d3.select(this.container).selectAll("div").remove();
    }
}

module.exports = CountryMap;

/*
const nuclear_powerplant_locations = require('./nuclear-only.json');

const CountryMap = require('./country_map.js');
const CountryMapInstance = new CountryMap(nuclear_powerplant_locations, "#country-map-container", "France");
CountryMapInstance.makeCountryMap();

d3.select('#button1').on('click', () => {
  CountryMapInstance.clearDots()
});

d3.select('#button2').on('click', () => {
  CountryMapInstance.plotPlants()
});
*/
// needs to be in a div like
// <div id="country-map-container" style="width: 700px; height: 610px;">

const d3 = require('d3')

const height = 610;
const width = 700;

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

    // pass in the name of the country and the div it should be in
    makeCountryMap(country_name, container) {
        let svg = d3.select(container)
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

        let projection = d3.geoMercator()
            .center(country_coord.center) // x, y lower y higher up it is
            .scale(country_coord.scale)
            .translate([width / 2, height / 2])

        let path = d3.geoPath()
            .projection(projection);

        svg.selectAll("path")
            .data(topojson.feature(worldmap_geo_json, worldmap_geo_json.objects.countries)
                .features.filter(function (d) { return country_name == d.properties.name; }))
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#aaaaaa");


        console.log(country_name);
        this.plotPlants(country_name, svg, projection);
    }

    plotPlants(country_name, svg, projection) {
        let powerplants = [];
        for (let c of this.nuclear_powerplant_locations) {
            if (c.country_long == country_name) {
                powerplants.push(c);
            }
        }

        console.log(powerplants);

        let tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "#ffff")
            .text("a simple tooltip");

        let circles = svg.selectAll(".pin")
            .data(powerplants)
            .enter()
            .append("circle", ".pin")
            .attr("r", 5)
            .attr("transform", function (d) {
                return "translate(" + projection([
                    d.longitude,
                    800
                ]) + ")";
            })
            .style("fill", "#000")
            .style("stroke", "#90ee90")
            .style("stroke-width", 2)
            .on("mouseover", function (d) {
                //d3.select(this).attr("xlink:href", "../static/homer.png");
                tooltip.text(d.name);
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function () {
                /*var string = '<img src="./homer.png/">';
                tooltip.html(string) //this will add the image on mouseover
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY + 50) + "px")
                    .style("font-color", "white");*/

                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });

        circles
            .transition()
            .delay(function (d, i) { return i * 200; })
            .duration(800)
            .ease(this.customBounce(.08))
            .attr("transform", function (d) {
                return "translate(" + projection([
                    d.longitude,
                    d.latitude
                ]) + ")";
            });
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
}

module.exports = CountryMap;
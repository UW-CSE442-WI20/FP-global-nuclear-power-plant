
const d3 = require('d3')

// Gets included in js bundle
const data_nuclear_only = require('./country_nuclear_status.json');
const nuclear_powerplants = require('./nuclear-only.json');

const Map = require('./country_map.js');
export const USMapInstance = new Map(nuclear_powerplants, "#america-map", "United States of America");



// plotPlants to make dots
// clearDots to clear the dots
export const ChinaMapInstance = new Map(nuclear_powerplants, "#china-map", "China");

export const AustraliaMapInstance = new Map(nuclear_powerplants, "#australia-map", "Australia");

export const JapanMapInstance = new Map(nuclear_powerplants, "#japan-map", "Japan");

export const FranceMapInstance = new Map(nuclear_powerplants, "#france-map", "France");

const Dashboard = require('./dashboard.js');
const DashboardInstance = new Dashboard(data_nuclear_only);
DashboardInstance.createMap();

var control_spans = d3.selectAll('#map-control span')
    .on('click', function() {
        if (DashboardInstance.legend_choice != this.id) {
            DashboardInstance.legend_choice = this.id;
            control_spans.classed('selected', false);
            d3.select(`#${DashboardInstance.legend_choice}`)
                .classed('selected', true);
            DashboardInstance.refreshColorMap();
        }
    });

ChinaMapInstance.makeCountryMap();
AustraliaMapInstance.makeCountryMap();
JapanMapInstance.makeCountryMap();
FranceMapInstance.makeCountryMap();
USMapInstance.makeCountryMap();
d3.select('#america-container').on('mouseover', () => {
  USMapInstance.plotPlants();
  d3.select('#america-container').on('mouseover', null);
});

d3.select('#countries').on('mouseover', () => {
  ChinaMapInstance.plotPlants();
  d3.select('#countries').on('mouseover', null);
});

var slideIndex = 1;
showDivs(slideIndex, true);

function plusDivs(n) {
    showDivs(slideIndex += n, false);
}

function currentDiv(n) {
    showDivs(slideIndex = n, false);
}

function showDivs(n, first_china) {
    if (!first_china) {
        ChinaMapInstance.clearDots();
        JapanMapInstance.clearDots();
        AustraliaMapInstance.clearDots();
        FranceMapInstance.clearDots();
        switch (n) {
            case 1:
                ChinaMapInstance.plotPlants();
                break;
            case 2:
                JapanMapInstance.plotPlants();
                break;
            case 3:
                FranceMapInstance.plotPlants();
                break;
            case 4:
                AustraliaMapInstance.plotPlants();
                break;
        }
    }
    var i;
    var x = document.getElementsByClassName("slide");
    var dots = document.getElementsByClassName("demo");
    if (n > x.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = x.length }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" w3-white", "");
    }
    x[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " w3-white";
}

document.getElementById("left").addEventListener("click", function () {
    plusDivs(-1);
})

document.getElementById("right").addEventListener("click", function () {
    plusDivs(1);
})

document.getElementById("dot1").addEventListener("click", function () {
    currentDiv(1);
})

document.getElementById("dot2").addEventListener("click", function () {
    currentDiv(2);
})

document.getElementById("dot3").addEventListener("click", function () {
    currentDiv(3);
})

document.getElementById("dot4").addEventListener("click", function () {
    currentDiv(4);
})

document.getElementById("china").addEventListener("click", function () {
    currentDiv(1);
})

document.getElementById("japan").addEventListener("click", function () {
    currentDiv(2);
})

document.getElementById("france").addEventListener("click", function () {
    currentDiv(3);
})

document.getElementById("australia").addEventListener("click", function () {
    currentDiv(4);
})

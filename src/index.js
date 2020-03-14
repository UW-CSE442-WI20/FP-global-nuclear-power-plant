
const d3 = require('d3')

// Gets included in js bundle
const data_nuclear_only = require('./country_nuclear_status.json');
const nuclear_powerplants = require('./nuclear-only.json');

var currentPage = 1;



const Map = require('./country_map.js');
export const USMapInstance = new Map(nuclear_powerplants, "#america-map", "#america-year-text", "United States of America");

// plotPlants to make dots
// clearDots to clear the dots
export const ChinaMapInstance = new Map(nuclear_powerplants, "#china-map", "#china-year-text", "China");

export const AustraliaMapInstance = new Map(nuclear_powerplants, "#australia-map", "#australia-year-text", "Australia");

export const JapanMapInstance = new Map(nuclear_powerplants, "#japan-map", "#japan-year-text", "Japan");

export const FranceMapInstance = new Map(nuclear_powerplants, "#france-map", "#france-year-text", "France");

const Dashboard = require('./dashboard.js');
const DashboardInstance = new Dashboard(data_nuclear_only);
DashboardInstance.createMap();

var control_spans = d3.selectAll('#map-control span')
    .on('click', function () {
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


var visitedUS = false;
var visitedChina = false;
var visitedJapan = false;
var visitedFrance = false;
var visitedAustralia = false;

window.onscroll = function (e) {
    var ratio = document.scrollingElement.scrollTop / document.body.scrollHeight;
    var temp;
    if (ratio < 0.13) {
        temp = 1;
    } else if (ratio < 0.27) {
        temp = 2;
    } else if (ratio < 0.41) {
        temp = 3;
    } else if (ratio < 0.55) {
        temp = 4;
    } else if (ratio < 0.70) {
        temp = 5;
    } else if (ratio < 0.85) {
        temp = 6;
    } else {
        temp = 7;
    }
    if (temp != currentPage) {
        currentPage = temp;
        console.log(currentPage);
        if (currentPage == 3 && !visitedUS) {
            USMapInstance.plotPlants();
            visitedUS = true;
        }
        if (currentPage == 5 && !visitedChina) {
            ChinaMapInstance.plotPlants();
            visitedChina = true;
        }
    }
}

var slideIndex = 1;
showDivs(slideIndex, true);

function plusDivs(n) {
    slideIndex = slideIndex + n == 0 ? 4 : slideIndex + n
    showDivs(slideIndex, false);
}

function currentDiv(n) {
    showDivs(slideIndex = n, false);
}

function showDivs(n, first_china) {
    console.log("HERE" + slideIndex)
    if (!first_china) {
        switch (n) {
            case 1:
                if (!visitedChina) {
                    ChinaMapInstance.plotPlants();
                    visitedChina = true;
                }
                break;
            case 2:
                if (!visitedJapan) {
                    JapanMapInstance.plotPlants();
                    visitedJapan = true;
                }
                break;
            case 3:
                if (!visitedFrance) {
                    FranceMapInstance.plotPlants();
                    visitedFrance = true;
                }
                break;
            case 4:
                if (!visitedAustralia) {
                    AustraliaMapInstance.plotPlants();
                    visitedAustralia = true;
                }
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

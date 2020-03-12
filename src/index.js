
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
    if (ratio < 0.14) {
        temp = 1;
    } else if (ratio < 0.31) {
        temp = 2;
    } else if (ratio < 0.47) {
        temp = 3;
    } else if (ratio < 0.64) {
        temp = 4;
    } else if (ratio < 0.82) {
        temp = 5;
    } else {
        temp = 6;
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
    showDivs(slideIndex += n, false);
}

function currentDiv(n) {
    showDivs(slideIndex = n, false);
}

function showDivs(n, first_china) {
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


var usaContent = '<p>Nuclear power in the USA is provided by 98 commercial reactors with a net capacity of 100,350 megawatts.</p>' +
    '<p>    <u>Development:</u><b>  In 1953, President Dwight D Eisenhower announced Atoms for Peace </b>and in 1958 the first ' +
    'commercial nuclear power plant was built in the US. The industry continued to grow throughout the 1960s ever since. Price-Anderson ' +
    'Act in 1975 then was introduced to protect private companies from liabilities of these accidents to encourage the development of nuclear power.</p>' +
    '<p>    <u>Emergence:</u><b> In the 1970s, the growth of the nuclear industry occured in the US as the environmental movement was being formed ' +
    '</b>was being formed and people saw the advantage of nuclear power in reducing air pollution.</p>' +
    '<p>    <u>Opposition:</u><b> In 1979  three Mile Island Accident that caused radiation leak </b><b> The protests then preceded the shutdown of over ' +
    'a dozen nuclear power plants in the states.</b> that further leads to almost 200 thousands of people attending protests against nuclear power.</p>' +
    '<p>    <u>Overcommitments to Nuclear Power:</u><b> From 1953 to 2008, 48 percent of the ordered nuclear plants were canceled. </b> By 1983, cost overruns ' +
    'and delays along with slowing of electricity demand growth. <b> In 1985 the Atomic Energy Act encouraged private corporations to build nuclear reactors </b> ' +
    'and a significant learning phase followed with many early partial nuclear reactor accidents at experimental reactors and research facilities. </p>';


var japan = '    Prior to the 2011 Tohoku earthquake, Japan had generated 30% of its electrical power' +
    ' from nuclear reactors from 9 reactors. In 1954, Japan budgeted 230 million yen for nuclear energy, marking the beginning of Japan\'s ' +
    'nuclear program. Three Mile Island accident or the Chernobyl disaster did not hit Japan as hard as it did in other countries. ' +
    'Constructions of new nuclear plants continued to be strong through 1980s, 1990s and up to today. Despite the Bombing of Hiroshima ' +
    'and Nagasaki and Fukushima disaster, Japan recognized nuclear power as the country’s most important power source as it aims for a ' +
    'realistic and balanced energy structure.';

var france = '    France derives about 75% of its electricity from nuclear energy. As a direct result of the 1973 oil crisis,' +
    ' Prime Minister Pierre Messmer announced Messmer Plan to reach 170 plants by 2000 as a response to the lack of oil sources.  In 2018, based on energy security, ' +
    'the government policy is to reduce this to 50% by 2035 and increase its wind, biomass and solar power electricity output.';

var china = '    China is one of the largest producers of nuclear power in the world. Nuclear power contributed 4.9% of the total chinese ' +
    'electricity production in 2019 with 45 reactors. Most of the nuclear plants are on the coast and use seawater for cooling. In 1955, the China National Nuclear ' +
    'Corporation was established. In 1970, China issued its first nuclear power plan. Since then, it has Energy Development Strategy Action Plan 2014-2020 to have a ' +
    '58 GWe capacity by 2020 with 30 GWe more under construction.';

var australia = '    Australia has never had a nuclear power station. In the meantime, Australia hosts 33% of the world’s uranium ' +
    'deposits and is the world’s largest producer of uranium after Kazakhstan and Canada. With its low-cost coal and natural gas reserves, Australia has been able ' +
    'to avoid nuclear power. Since the 1950s, the Liberty Party has advocated for the development of nuclear power. And since the 1970s, anti-nuclear movements ' +
    'developed in Australia. ';

document.getElementById("america-text").innerHTML = '<h2>Nuclear power in the USA</h2>' + usaContent;
document.getElementById("china-content").innerHTML = china;
document.getElementById("japan-content").innerHTML = japan;
document.getElementById("france-content").innerHTML = france;
document.getElementById("australia-content").innerHTML = australia;
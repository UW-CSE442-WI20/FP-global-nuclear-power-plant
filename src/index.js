
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

setTimeout(function() { typeWriter("china-content", china, 0); }, 35000);

setTimeout(function() { typeWriter("france-content", france, 0); }, 35000);

setTimeout(function() { typeWriter("australia-content", australia, 0); }, 35000);

setTimeout(function() { typeWriter("japan-content", japan, 0); }, 35000);

var speed = 10;
function typeWriter(id, text, i) {
    if (i < text.length) {
        document.getElementById(id).innerHTML += text.charAt(i);
        setTimeout(function() { typeWriter(id, text, i + 1) }, speed);
    }
}


function replaceText(text) {
    document.getElementById("intro").innerHTML = text;
}

document.getElementById("intro").innerHTML = '<h1>What is nuclear power?</h1>';
setTimeout(function() { replaceText(introTitles[0]); }, 2000);
setTimeout(function() { typeWriter("intro", introContents[0], 0) }, 2000);
setTimeout(function() { replaceText(introTitles[1]); }, 6000);
setTimeout(function() { typeWriter("intro", introContents[1], 0) }, 6000);
setTimeout(function() { replaceText(introTitles[2]); }, 15000);
setTimeout(function() { typeWriter("intro", introContents[2], 0) }, 15000);
setTimeout(function() { typeWriter("intro", introContents[3], 0) }, 18000);
setTimeout(function() { typeWriter("intro", introContents[4], 0) }, 21000);
setTimeout(function() { typeWriter("intro", introContents[5], 0) }, 24000);
setTimeout(function() { replaceText(introTitles[0] + introContents[0] + introTitles[1] + introContents[1] + introTitles[2] + introContents[2]
                                + introContents[3] + introContents[4] + introContents[5]); }, 27000);


// text
var introTitles = ['<h2>What is nuclear power?</h2>', '<h2>Where does the energy come from?</h2>', '<h2>How did we develop to use nuclear energy?</h2>']; 
var introContents = ['Nuclear power is a clean and efficient energy that contributes 12 ' +
                    'percent of the energy produced in the world. It is the second largest source of low-carbon power.', 
                    'The energy comes from Uranium-236. When we fire a neutron to an uranium-235, it becomes uranium-236 ' +
                    'and that’s an unstable state that would want to split up into smaller atoms and a neutron. The process of ' +
                    'splitting up the nucleus of uranium-236 releases energy. ' +
                    'The neutron from the reaction will also collide with other uranium-235 and trigger more reactions to create more ' +
                    'energy.', ' In 1935, physicist Enrico Fermi conducted experiments that showed ' + 
                    'neutrons could split atoms. He also bombarded uranium and concluded that he created new elements. ',
                    'In 1938, German scientist Otto Hahn and Fritz Strassmann fired neutrons at uranium and later Lise Meitner figured that the split must ' +
                    'have converted to energy following E=mc^2 equation.', ' Frédéric Joliot, H. Von Halban and L. Kowarski in Paris discovered neutron multiplication ' +
                    'in uranium, proving that a nuclear chain reaction by this mechanism was indeed possible.', ' In 1942, Fermi and a group of scientists gathered at the ' +
                    'University of Chicago to develop their theories about self-sustaining reactions. The reactor they built was later ' +
                    'known as Chicago Pile-1.'
                ];

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

document.getElementById("america-text").innerHTML = '<h2>Nuclear power in the USA</h2>' + usaContent;

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
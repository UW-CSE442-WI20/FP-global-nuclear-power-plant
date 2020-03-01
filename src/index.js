

// You can require libraries
const d3 = require('d3')

// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();

// Gets included in js bundle
const data_nuclear_only = require('./country_nuclear_status.json');

// Loaded over network due to size
d3.csv('all_fuels.csv')
  .then((data) => {
    // console.log('Dynamically loaded CSV data', data);
    // Do stuff
  });

const Map = require('./map.js');
const MapInstance = new Map(data_nuclear_only);
MapInstance.createMap();

function getLightBulbs(percentage, country) {
	var stringP = percentage.toFixed(2).bold();
	document.getElementById("lightbulbs").innerHTML = '<h1 style="display:inline">' + stringP + '%</h1><p style="display:inline";> of the energy source in </p></br><h1 style="display:inline";> '
		+ country + '</h1><p style="display:inline";> is powered by nuclear energy</p></br>';
	var lightBulbs = Math.round(percentage);
	let allBulb = '';
	for (var i = 0; i < lightBulbs; i++) allBulb += '<img src="/LightBulb.png" style="width: 11%;">';
	for (var i = 0; i < 100 - lightBulbs; i++) allBulb += '<img src="/Dimbulb.44b548c1.png" style="width: 11%;">';
	document.getElementById("lightbulbs").innerHTML += allBulb;
}

function getFactories(working, inProgress, abandon) {
	document.getElementById("plants").innerHTML = '';
	let allplants = '';
	for (var i = 0; i < working; i++) allplants += '<img src="/workingPlant.png" style="width: 5%;">';
	for (var i = 0; i < inProgress; i++) allplants += '<img src="/inProgressPlant.png" style="width: 5%;">';
	for (var i = 0; i < abandon; i++) allplants += '<img src="/abandon.png" style="width: 5%;">';
	document.getElementById("plants").innerHTML = allplants;
}
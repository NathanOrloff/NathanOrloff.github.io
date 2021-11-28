

let resolution = 3; //starting resolution



let map = L.map('map').setView([40,-100], 4); //creates leaflet map

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/light-v9',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);

let hexLayer = L.layerGroup(); //layer to hold hexagons 
hexLayer.addTo(map);

/**
 * 
 * @returns current resolution based on map zoom level
 */
function getResolution(){ 
	let zoomLevel = map.getZoom();
	let res = 0;
	if(zoomLevel < 4){
		res = 2;
	}else if (zoomLevel >= 4 && zoomLevel < 6){
		res = 3;
	}else if (zoomLevel >= 6 && zoomLevel < 7){
		res = 4;
	}else if (zoomLevel >= 7 && zoomLevel < 8){
		res = 5;
	}else if (zoomLevel >= 8 && zoomLevel < 10){
		res = 6;
	}else if (zoomLevel >= 10){
		res = 7;
	}


	return res
}





let incomeData = {
	"type": "FeatureCollection",
	"features": []
}



Promise.all([
	fetch("./data/split_data/kaggle_income_avg_geo0.geojson").then(resp => resp.json().then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	})),
	fetch("./data/split_data/kaggle_income_avg_geo1.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo2.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo3.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo4.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo5.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo6.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo7.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo8.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo9.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo10.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo11.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo12.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo13.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo14.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo15.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo16.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
	fetch("./data/split_data/kaggle_income_avg_geo17.geojson").then(resp => resp.json()).then(data => {
		for(let j = 0; j < data.length; j++){
			incomeData["features"].push(data[j])
		}
	}),
]).then(function(){return incomeData}).then(data => updateMap(data, resolution))




//update the leaflet map on the end of any move
map.on('moveend', function(){
	let res = getResolution();
	hexLayer.clearLayers()
	updateMap(incomeData, res); 
})

/**
 * updates the hexagons displayed on the map
 * 
 * @param {*} data geojson data of all hexagons and the income data associated
 * @param {*} resolution the current desired hexagon granularity level
 */
function updateMap(data, resolution){

	let bbox = (map.getBounds()); //gets current view of map shown
	

	let householdIncome = crossfilter(data["features"]);
	let householdIncomeDimension = householdIncome.dimension(function(d) { return d });
	//filters by hexagons in data by resolution and by what is shown in the current map view
	let incomeByRes = householdIncomeDimension.filter(function(d) { return ((d["properties"]["Resolution"] == resolution) 
		&& (d["properties"]["Lat"] >= bbox["_southWest"]["lat"] && d["properties"]["Lat"] <= bbox["_northEast"]["lat"]) 
		&& (d["properties"]["Lon"] >= bbox["_southWest"]["lng"] && d["properties"]["Lon"] <= bbox["_northEast"]["lng"]))});

	let incomeByResValues = incomeByRes.top(Number.POSITIVE_INFINITY)
	
	
	//for the remaining hexagons, add each to the map
	for(let i = 0; i < incomeByResValues.length; i++){
		
		//sets the text shown when hexagon is clicked on
		popup = '<p>Average Income: $' + Math.round(incomeByResValues[i]["properties"]["Mean"] )  + '<br>Standard Deviation: ' +  Math.round(incomeByResValues[i]["properties"]["Stdev"]) + '</p>'
		styles = { //sets style of hexagon
			fillColor: incomeByResValues[i]["properties"]["Color"],
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.6,
		}
		
		//add to map
		L.geoJson(incomeByResValues[i], {style: styles}).bindPopup(popup).addTo(hexLayer);

		
		




	}
}




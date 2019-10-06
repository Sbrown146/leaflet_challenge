// Homework 17 Leaflet --- Scott Brown

// API_KEY is once again hard coded in.  This does not work properly.  Do not use for grading.  For an unknown reason, I cannot get the latitude and longitude to read in correctly when assigning them to a dictionary despite the syntax being exactly the same as the earthquake api.  I also cannot get the earthquake markers to toggle on and off but I knew this would happen going in as I have yet to get this feature working on any leaflet code that I have tried so far whether it is using my own code from scratch or the lecture code.  I am sure I am missing a small step somewhere.


// Marker background color function for legend
function markerBG(magnitude) {
  if (magnitude <= 1) {
    return "rgb(53, 165, 1)";
  }
  else if (magnitude <= 2) {
    return "rgb(251, 255, 0)";
  }
  else if (magnitude <= 3) {
    return "rgb(207, 211, 0)";
  }
  else if (magnitude <= 4) {
    return "rgb(221, 153, 5)";
  }
  else if (magnitude <= 5) {
    return "rgb(197, 96, 2)";
  }
  else {
    return "rgb(218, 0, 0)";
  }
};

let Place = [];
let Time = [];
let Magnitude = [];
let Latitude = [];
let Longitude = [];
let Quake_marker = [];


// Earthquake uri
let Quake_uri = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(Quake_uri, function(data){

// Get all required variables into arrays
for (let i = 0; i < data.features.length; i++){
  Place.push(data.features[i].properties.place);
  Time.push(data.features[i].properties.time);
  Magnitude.push(data.features[i].properties.mag);
  Latitude.push(data.features[i].geometry.coordinates[1]);
  Longitude.push(data.features[i].geometry.coordinates[0]);
}

// Get a dictionary to hold all arrays
for (let j = 0; j < Place.length; j++) {
  let Quake_dict = [
    {
      Place: Place[j],
      Time: Time[j],
      location: [Latitude[j], Longitude[j]],
      magnitude: Magnitude[j]
    }
  ]

// Set magnitude colors
for (let i = 0; i < Quake_dict.length; i++) {

  let color = "";
  let fill_color = "";
  if (Quake_dict[i].magnitude < 1) {
    fill_color = "rgb(53, 165, 1)";
    color = "rgb(47, 139, 4)";
  }
  else if (Quake_dict[i].magnitude < 2) {
    fill_color = "rgb(251, 255, 0)";
    color = "rgb(207, 211, 0)";
  }
  else if (Quake_dict[i].magnitude < 3) {
      fill_color = "rgb(207, 211, 0)";
      color = "rgb(189, 192, 5)";
    }
  else if (Quake_dict[i].magnitude < 4) {
    fill_color = "rgb(221, 153, 5)";
    color = "rgb(226, 110, 1)";
  }
  else if (Quake_dict[i].magnitude < 5) {
    fill_color = "rgb(197, 96, 2)";
    color = "rgb(170, 84, 3)";
  }
  else {
    fill_color = "rgb(218, 0, 0)";
    color = "rgb(173, 2, 2)";

  }

  // Displays magnitude as a dynamic marker while displaying place, time and earthquake magnitude.
  Quake_marker.push(L.circle(Quake_dict[i].location, {
    stroke: false,
    fillOpacity: 0.8,
    color: color,
    fillColor: fill_color,
    radius: Quake_dict[i].magnitude * 14000
  }).bindPopup("<h3>" + Quake_dict[i].Place + "</h3> <hr> <h4>Magnitude: " + Quake_dict[i].magnitude + "</h4>"));
  }
  }
});


// Set up to get fault line data

let fault_coordinates = [];
let fault_latitude = [];
let fault_longitude = [];
let fault_marker = [];

let fault_uri = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
d3.json(fault_uri, function (data){

  for (let i = 0; i < data.features.length; i++) {
    for (let j = 0; j < data.features[i].geometry.coordinates.length; j++) {
      fault_coordinates.push(data.features[i].geometry.coordinates[j]);
      fault_latitude.push(fault_coordinates[j][1]);
      fault_longitude.push(fault_coordinates[j][0]);
    }
  }

  // ........this does not work......
  for (let i = 0; i < fault_longitude.length; i++) {
    let fault_dict = [
      {
        location: [fault_latitude[i], fault_longitude[i]]
      }
    ]

    fault_marker.push(L.circle(fault_dict[i].location, {
      color: "orange",
      weight: 2
    }));
  }
});

// Background layers
var satellite_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2Jyb3duMTQ2IiwiYSI6ImNrMWUycThmajBhZzIzYm11bjRqMDRvamQifQ.M22-sX0fWx_QGYGZQpRDGw", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    //accessToken: API_KEY,
    id: "mapbox.satellite"
  })


var dark_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2Jyb3duMTQ2IiwiYSI6ImNrMWUycThmajBhZzIzYm11bjRqMDRvamQifQ.M22-sX0fWx_QGYGZQpRDGw", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    //accessToken: API_KEY,
    // id: "mapbox.dark"
    id: "mapbox.streets-basic"
  })

var outdoors_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2Jyb3duMTQ2IiwiYSI6ImNrMWUycThmajBhZzIzYm11bjRqMDRvamQifQ.M22-sX0fWx_QGYGZQpRDGw", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    //accessToken: API_KEY,
    id: "mapbox.outdoors"
  })


var baseMaps = {
  "Satelite": satellite_map,
  "Grayscale": dark_map,
  "Outdoors": outdoors_map
};

var earthquakes = L.layerGroup(Quake_marker);
var faults = L.layerGroup(fault_marker);


var overlayMaps = {
    "Earthquakes": earthquakes,
    "Fault Lines": faults
};

// Set initial map variable and zoom
let Quake_map = L.map("map", {
  center: [38, -100],
  zoom: 4.45,
  layers: [satellite_map, earthquakes]
});

// Declares the legend variable
var legend = L.control({
  position: 'bottomright'
});
      
// Proper formatting so that legend displays properly
legend.onAdd = function () {
var legend_div = L.DomUtil.create('div', 'Legend'),
  mag = [0, 1, 2, 3, 4, 5];
      
// Sets the color markers for each magnitude level
for (let j = 0; j < mag.length; j++) {
  legend_div.innerHTML += '<j style="background:' + markerBG(mag[j] + 1) + '"></j>  ' +  + mag[j] + (mag[j + 1] ? ' - ' + mag[j + 1] + '<br> ' :  '  +  ');
  }
  return legend_div;
};
legend.addTo(Quake_map);

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(Quake_map);


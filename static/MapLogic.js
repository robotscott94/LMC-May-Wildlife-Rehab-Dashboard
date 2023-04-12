// DECLARE VARIABLES

const countyLines = d3.json("usCounties.json");

const stateLines = d3.json("usStates.json");

const patients = d3.json("http://127.0.0.1:5001/api/patients");
// patients.then(function(x) {
//   console.log(x)
// })

const animals = d3.json("http://127.0.0.1:5001/api/animals");
// animals.then(function(x) {
//   console.log(x)
// })

const statusCodes = d3.json("http://127.0.0.1:5001/api/statuscodes");
// statusCodes.then(function(x) {
//   console.log(x)
// })

const places = d3.json("http://127.0.0.1:5001/api/locations");
// places.then(function(x) {
//   console.log(x)
// })





// Creates legend and layers, plots map and tectonic data
function createMap() {

  // Import layers
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create layer objects
  var baseMaps = {
    Street: street,
  };

  var overlayMaps = {
  };

  // Initializes map
  var myMap = L.map("map", {
    center: [36.1557, -81.8697],
    zoom: 7,
    layers: [street]
    });

  stateLines.then(function(data) {
      var counties = data.features;
      //console.log(data)
      for (i=0; i<counties.length; i++) {
          if (counties[i].geometry.coordinates.length > 1){
              counties2 = counties[i].geometry.coordinates;
              for (k =0; k < counties2.length; k++) {
                  var latlong = counties2[k][0];
                  for (let j = 0; j < latlong.length; j++) {
                      [latlong[j][0], latlong[j][1]] = [latlong[j][1], latlong[j][0]];
                  }
                  L.polyline(latlong, {
                      color: "yellow",
                      // ADD BIN COLOR SELECTOR
                  }).addTo(myMap);
              }
          } else {
          var latlong = counties[i].geometry.coordinates[0];
          for (let j = 0; j < latlong.length; j++) {
              [latlong[j][0], latlong[j][1]] = [latlong[j][1], latlong[j][0]];
          }
          L.polyline(latlong, {color: "yellow"}).addTo(myMap);
      }
      }
  })


  places.then(function(data) {
    console.log(data)
    for (i=0; i<data.length; i++){
    L.circle([data[i].location_lat, data[i].location_lon], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: "purple",
      weight: 1,
      radius: Math.sqrt(data[i].map_location_count)*500
      }).addTo(myMap).
      bindPopup(`<h4>Patient Count: ${data[i].map_location_count}</h4>
        <h4>Location: ${data[i].new_location}</h4>
      `)
      }
  })

L.control.layers(baseMaps).addTo(myMap);
}





createMap();




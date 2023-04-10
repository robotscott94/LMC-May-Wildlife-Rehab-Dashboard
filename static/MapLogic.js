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




// Replace 'path/to/your/data.csv' with the actual path to your CSV file
fetch('2022wildlifePatients.csv')
  .then(response => response.text())
  .then(csvData => {
    // Parse the CSV data
    const parsedData = Papa.parse(csvData, {
      header: true, // Set to true if your CSV has headers (column names)
      dynamicTyping: true, // Set to true to automatically convert numbers and booleans
    });
    
    var patients = parsedData.data;

    var countyArray = [];
    for (n = 0; n<patients.length; n++) {
        countyArray.push(patients[n].found_county)
    }
    //console.log(countyArray);

    // Create a Map object to store unique county names and their frequencies
    const countyFrequencies = new Map();

    // Iterate through the countyNames array
    countyArray.forEach(county => {
    // If the county is not in the map, add it with a frequency of 1
    if (!countyFrequencies.has(county)) {
        countyFrequencies.set(county, 1);
    } else {
        // If the county is already in the map, increment its frequency by 1
        countyFrequencies.set(county, countyFrequencies.get(county) + 1);
    }
    });

    // Create two arrays: one for unique county names and another for their frequencies
    const uniqueCounties = Array.from(countyFrequencies.keys());
    const frequencies = Array.from(countyFrequencies.values());

    // Log the unique county names and their frequencies
    // console.log(countyFrequencies );
    //console.log(uniqueCounties)





// Function to filter the GeoJSON data based on the unique counties array
function filterGeoJSONByCounties(geojson, uniqueCounties) {
    const filteredGeoJSON = {
      type: 'FeatureCollection',
      features: [],
    };
  
    geojson.features.forEach(feature => {
      // Assuming the county name is stored as a property named "name"
      const countyName = feature.properties.NAME;
      const state = feature.properties.STATE;
      // SC = '45' VA = '51' NC = '37', 
      if (uniqueCounties.includes(countyName)&& state === '37' ) {
        // If the county name is in the unique counties array, add the feature to the filtered GeoJSON
        filteredGeoJSON.features.push(feature);
      }
      if (countyName === 'Grayson' && state === '51' ) {
        // If the county name is in the unique counties array, add the feature to the filtered GeoJSON
        filteredGeoJSON.features.push(feature);
      }
      if (countyName === 'Greenville' && state === '45' ) {
        // If the county name is in the unique counties array, add the feature to the filtered GeoJSON
        filteredGeoJSON.features.push(feature);
      }
    });
  
    return filteredGeoJSON;
    }





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
    center: [36.1557, -80.8697],
    zoom: 7,
    layers: [street]
    });

  countyLines.then(function(data) {
      var counties = filterGeoJSONByCounties(data, uniqueCounties).features;
      console.log(counties)
      for (i=0; i<counties.length; i++) {
          var latlong = counties[i].geometry.coordinates[0];
          for (let j = 0; j < latlong.length; j++) {
              [latlong[j][0], latlong[j][1]] = [latlong[j][1], latlong[j][0]];
          }
          L.polygon(latlong, {color: "darkgreen"}).addTo(myMap).
              bindPopup(`${
              counties[i].properties.NAME
              }`);
      }
  })


  places.then(function(data) {
    console.log(data)
    for (i=0; i<data.length; i++){
    L.circle([data[i].county_lat, data[i].county_lon], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: "purple",
      weight: 1,
      radius: Math.sqrt(data[i].county_count)*1900
      }).addTo(myMap).
      bindPopup(`${
        data[i].county_count
      }`)
      }
  })

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


L.control.layers(baseMaps).addTo(myMap);
}





createMap();


})
// })
// .catch(error => {
//   console.error('Error loading CSV file:', error);
// });



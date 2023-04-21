// Define the API endpoint URL
const apiUrl = 'https://spiffy-bean-production.up.railway.app/api/animals';

// Load the data from the API endpoint
$.getJSON(apiUrl, function(data) {
  
  // Create an array to store the series data
  const seriesData = [];

  // Loop through each data item returned from the API
  data.forEach(function(item) {
    
    // Get the animal class name
    const animalClass = item.animal_class;
    
    // Get the common name and species count
    const commonName = item.common_name;
    const speciesCount = item.species_count;

    // Check if the animal class already exists in the series data
    const existingClassIndex = seriesData.findIndex(function(seriesItem) {
      return seriesItem.name === animalClass;
    });
    
    // If the animal class does not exist, add a new series data object
    if (existingClassIndex === -1) {
      seriesData.push({
        name: animalClass,
        data: [{name: commonName, value: speciesCount}]
      });
    } 
    
    // If the animal class already exists, add the common name and species count to the existing series data
    else {
      seriesData[existingClassIndex].data.push({name: commonName, value: speciesCount});
    }
    
  });
  
  // Initialize the Highcharts chart
  Highcharts.chart('bar', {

    chart: {
      type: 'packedbubble',
      height: '100%',
      backgroundColor: 'transparent'
    },
    title:{
        text: "2017 - 2023"
    },
  
    tooltip: {
      useHTML: true,
      pointFormat: '<b>{point.name}:</b> {point.value}'
    },

    plotOptions: {
      packedbubble: {
        minSize: '30%',
        maxSize: '120%',
        zMin: 0,
        zMax: 1000,
        layoutAlgorithm: {
          gravitationalConstant: 0.01,
          splitSeries: true,
          seriesInteraction: false,
          dragBetweenSeries: true,
          parentNodeLimit: true
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          filter: {
            property: 'y',
            operator: '>',
            value: 50
          },
          style: {
            color: 'black',
            textOutline: 'none',
            fontWeight: 'normal',
            fillOpacity: 0.7
          }
        }
      }
    },
  
    series: seriesData
  
  });

});

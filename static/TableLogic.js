var table = d3.select('#current-patients');
var rehabTotal = d3.select('#rehab-total');
var releaseRate = d3.select('#release-rate');

function getCommonName(species, data) {
  for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (species === element.species) {
          return element.common_name
      };
  };
};

Promise.all([patients, animals, statusCodes]).then(([patientData, animalData, statusData]) => {
  for (let index = 0; index < patientData.length; index++) {
    const element = patientData[index];
    combinedData[index]['common_name'] = getCommonName(element.species, animalData);
  };

  totalLiveAnimals = (
    statusData[1]['status_count'] +
    statusData[7]['status_count'] +
    statusData[8]['status_count'] +
    statusData[9]['status_count']
  )

  totalAnimals = (
    statusData[1]['status_count']+
    statusData[2]['status_count']+
    statusData[5]['status_count']+
    statusData[7]['status_count']+
    statusData[8]['status_count']+
    statusData[9]['status_count']
  )

  rehabTotal.text(`Total Rehabilitated Animals: ${totalLiveAnimals}`);
  releaseRate.text(`Animal Release Rate: ${
    Math.round(totalLiveAnimals/totalAnimals*100)
  }%`);

  var data = [];
  for (let index = combinedData.length - 1; index != 0; index--) {
      const element = combinedData[index];
      if (element.status === 'Reh') {
          data.push({
              "Species":element.common_name,
              "Patient ID" : element.patient_id,
              "Admission Date":element.admission_date,
              "Final Date":element.final_date,
              "Found City":element.found_city,
              "Found County":element.found_county
          });
      }
  }

  function tabulate(data, columns) {
      var thead = table.append('thead');
      var	tbody = table.append('tbody');

  
      // append the header row
      thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .text(function (column) { return column; });
  
      // create a row for each object in the data
      var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');
  
      // create a cell in each row for each column
      var cells = rows.selectAll('td')
        .data(function (row) {
          return columns.map(function (column) {
            return {column: column, value: row[column]};
          });
        })
        .enter()
        .append('td')
          .text(function (d) { return d.value; });
  
    return table;
  }
  
  // render the tables
  tabulate(data, ['Species', 'Found City', 'Found County', 'Patient ID', 'Admission Date']);
});
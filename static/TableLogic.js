// D3 selections
var table = d3.select('#current-patients');
var rehabTotal = d3.select('#rehab-total');
var releaseRate = d3.select('#release-rate');

// Function for grabing common name for a given species
function getCommonName(species, data) {
  for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (species === element.species) {
          return element.common_name
      };
  };
};

// Function for creating current-patients table
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

// Dependent on promises
Promise.all([patients, animals, statusCodes])
.then(([patientData, animalData, statusData]) => {

  // Combine common names into patient data
  for (let index = 0; index < patientData.length; index++) {
    const element = patientData[index];
    combinedData[index]['common_name'] = getCommonName(element.species, animalData);
  };

  // Calculate total rehabilitated and release rate
  totalLiveAnimals = (
    statusData[1]['status_count'] +  // Released
    statusData[7]['status_count'] +  // Transferred
    statusData[8]['status_count'] +  // Escaped
    statusData[9]['status_count']  // Permenant Resident
  );

  totalAnimals = (
    statusData[1]['status_count']+  // Released
    statusData[2]['status_count']+  // Died
    statusData[5]['status_count']+  // Euthanized
    statusData[7]['status_count']+  // Transferred
    statusData[8]['status_count']+  // Escaped
    statusData[9]['status_count']  // Permenant Resident
  );

  rehabTotal.text(`Total Rehabilitated Animals: ${totalLiveAnimals}`);
  releaseRate.text(`Animal Release Rate: ${
    Math.round(totalLiveAnimals/totalAnimals*100)
  }%`);

  // Aggregate data for current patients table
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
      };
  };
  
  // render the tables
  tabulate(data, ['Species', 'Found City', 'Found County', 'Patient ID', 'Admission Date']);
});
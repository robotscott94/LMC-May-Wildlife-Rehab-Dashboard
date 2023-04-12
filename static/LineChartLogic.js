function getMonthData(data, animalClass, year) {
    var monthData = [0,0,0,0,0,0,0,0,0,0,0,0]
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var dt = element.admission_date.split('-');
        var month = dt[1];
        if (animalClass === 'all' && year === 'All') {
            monthData[month-1] += 1;
        } else if (animalClass === 'all' && year === dt[0]) {
            monthData[month-1] += 1;
        } else if (element.animal_class === animalClass && year === 'All') {
            monthData[month-1] += 1;
        } else if (element.animal_class === animalClass && year === dt[0]) {
            monthData[month-1] += 1;
        };
    };
    return monthData
};

function getClass(species, data) {
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (species === element.species) {
            return element.animal_class
        };
    };
};

var combinedData;
var lineChart;

Promise.all([patients, animals]).then(([patientData, animalData]) => {

    combinedData = patientData
    yearList = []
    for (let index = 0; index < patientData.length; index++) {
        const element = patientData[index];
        combinedData[index]['animal_class'] = getClass(element.species, animalData);
        var dt = element.admission_date.split('-');
        var year = dt[0];
        if (!yearList.includes(year)) {
            yearList.push(year)
        }
    };

    var selYear = d3.select('#selYear');
    yearList.sort().map(year => {
        let option = selYear.append('option');
        option.text(year)
    });
    
    lineChart = Highcharts.chart('line', {
        chart: {
            backgroundColor:'#ffe5a9',
            type: 'spline'
        },
        title: {
            text: 'Patients Admitted (All)'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            accessibility: {
                description: 'Months of the year'
            }
        },
        yAxis: {
            title: {
                text: 'Number of Patients'
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            },
            gridLineColor: 'black'
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Total',
            marker: {
                symbol: 'square'
            },
            data: getMonthData(combinedData, 'all', 'All')
        }, {
            name: 'Avian',
            data: getMonthData(combinedData, 'avian', 'All')
        }, {
            name: 'Reptile',
            data: getMonthData(combinedData, 'reptile', 'All'),
            color: 'green'
        }, {
            name: 'Mammal',
            data: getMonthData(combinedData, 'mammal', 'All'),
            color: 'orange'
        }, {
            name: 'Amphibian',
            data: getMonthData(combinedData, 'amphibian', 'All'),
            color: 'grey'
        }]
    });
});

function optionChanged(year) {
    lineChart.setTitle({text: `Patients Admitted (${year})`})
    lineChart.series[0].setData(getMonthData(combinedData, 'All', year));
    lineChart.series[1].setData(getMonthData(combinedData, 'avian', year));
    lineChart.series[2].setData(getMonthData(combinedData, 'reptile', year));
    lineChart.series[3].setData(getMonthData(combinedData, 'mammal', year));
    lineChart.series[4].setData(getMonthData(combinedData, 'amphibian', year));
};
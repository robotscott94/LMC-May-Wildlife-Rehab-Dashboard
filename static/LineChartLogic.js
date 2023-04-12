function getMonthData(data, animalClass, year) {
    var monthData = [0,0,0,0,0,0,0,0,0,0,0,0]
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var dt = element.admission_date.split('-');
        var month = dt[1];
        if (animalClass === 'all' && year === 'all') {
            monthData[month-1] += 1;
        } else if (animalClass === 'all' && year === dt[0]) {
            monthData[month-1] += 1;
        } else if (element.animal_class === animalClass && year === 'all') {
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
            type: 'spline'
        },
        title: {
            text: 'Patients Admitted'
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
            }
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
            data: getMonthData(combinedData, 'all', 'all')
        }, {
            name: 'Avian',
            data: getMonthData(combinedData, 'avian', 'all')
        }, {
            name: 'Reptile',
            data: getMonthData(combinedData, 'reptile', 'all')
        }, {
            name: 'Mammal',
            data: getMonthData(combinedData, 'mammal', 'all')
        }, {
            name: 'Amphibian',
            data: getMonthData(combinedData, 'amphibian', 'all')
        }]
    });
});

function optionChanged(year) {
    lineChart.series[0].setData(getMonthData(combinedData, 'all', year));
    lineChart.series[1].setData(getMonthData(combinedData, 'avian', year));
    lineChart.series[2].setData(getMonthData(combinedData, 'reptile', year));
    lineChart.series[3].setData(getMonthData(combinedData, 'mammal', year));
    lineChart.series[4].setData(getMonthData(combinedData, 'amphibian', year));
};
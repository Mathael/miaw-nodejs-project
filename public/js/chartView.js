var labels = null;
var data = null;

$(function () {
    $("select#chart_type").on('change', function(){
        if($(this).val() == "bar"){
            setBarChart(labels, data);
        }else{
            setPieChart(labels, data);
        }
    });
});

function setBarChart(cLabels, cData){
    var chart = $('#myChart');
    if(chart) chart.remove();
    $('#chart-container').append('<canvas id="myChart" width="100" height="200"></canvas>');

    labels = cLabels;
    data = cData;

    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cLabels,
            datasets: [{
                label: '',
                data: cData,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 200, 80, 0.5)',
                    'rgba(153, 50, 113, 0.5)',
                    'rgba(149, 90, 40, 0.5)',
                    'rgba(45, 60, 200, 0.5)',
                    'rgba(20, 20, 20, 0.5)',
                    'rgba(200, 200, 200, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsiveAnimationDuration: 1000,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            legend: {
                display: false,
            }
        }
    });
}

function setPieChart(){
    jQuery("#myChart").remove();
    jQuery("#chart-container").append('<canvas id="myChart" width="100" height="300"></canvas>');

    var ctx = jQuery("#myChart");

    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: cLabels,
            datasets: [{
                label: '',
                data: cData,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 200, 80, 0.5)',
                    'rgba(153, 50, 113, 0.5)',
                    'rgba(149, 90, 40, 0.5)',
                    'rgba(45, 60, 200, 0.5)',
                    'rgba(20, 20, 20, 0.5)',
                    'rgba(200, 200, 200, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsiveAnimationDuration: 1000,
            maintainAspectRatio: false,
            legend: {
                display: true,
            }
        }
    });
}
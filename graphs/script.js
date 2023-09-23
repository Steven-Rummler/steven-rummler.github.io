window.onload = function () {
	
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    
    data: [{
      type: "bar",
      color: "#5DA6B0",
      dataPoints: [
        { y: 53_112, label: "Doctoral degree", indexLabel: '$53,112' },
        { y: 48_468, label: "Master's degree", indexLabel: '$48,468' },
        { y: 32_568, label: "Bachelor's degree", indexLabel: '$32,568' },
        { y: 25_608, label: "Associates degree", indexLabel: '$25,608' },
        { y: 17_976, label: "Undergraduate certificate", indexLabel: '$17,976' },
      ],
      indexLabelPlacement: 'inside',
      indexLabelTextAlign: 'right'
    }],

    axisX: {
      tickLength: 0,
      labelMaxWidth: 200,
      lineColor: '#ddd',
    },

    axisY: {
      minimum: 0,
      gridThickness: 0,
      labelFormatter: () => '',
      lineThickness: 0,
      tickLength: 0
    },

    dataPointWidth: 20,
  });
  chart.render();
}
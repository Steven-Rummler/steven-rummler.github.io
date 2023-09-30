const urlParams = new URLSearchParams(window.location.search);
const engine = urlParams.get('engine');
const url = engine === 'canvasjs' ? 'https://cdn.canvasjs.com/canvasjs.min.js' : 'https://cdn.jsdelivr.net/npm/apexcharts';
const callback = engine === 'canvasjs' ? renderCanvasJSChart : renderApexChart;

const script = document.createElement('script');
script.type = 'text/javascript';
script.src = url;
script.onload = callback;
document.body.appendChild(script);

function renderCanvasJSChart() {
  const urlParams = new URLSearchParams(window.location.search);
  const format = urlParams.get('format');
  const formatter = format === 'currency' ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format :
    format === 'percent' ? Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 0 }).format :
      Intl.NumberFormat('en-US').format;

  const urlData = urlParams.get('data');
  if (urlData === null) return;
  const dataPoints = urlData.split(',').map((dataPoint) => {
    const [label, y] = dataPoint.split(':');
    return { label, y: parseFloat(y), indexLabel: formatter(parseFloat(y)) };
  }).sort((a, b) => b.y - a.y);

  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,

    data: [{
      type: "bar",
      color: "#5DA6B0",
      dataPoints,
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
      maximum: format === 'percent' ? 1 : dataPoints[0].y * 1.1,
      gridThickness: format === 'percent' ? 1 : 0,
      gridColor: '#ddd',
      labelFormatter: format === 'percent' ? label => formatter(label.value) : () => '',
      lineThickness: 0,
      tickLength: 0
    },

    dataPointWidth: 20,

    toolTip: {
      enabled: false
    }
  });
  chart.render();
}

function renderApexChart() {
  const urlParams = new URLSearchParams(window.location.search);
  const format = urlParams.get('format');
  const formatter = format === 'currency' ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format :
    format === 'percent' ? Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 0 }).format :
      Intl.NumberFormat('en-US').format;

  const urlData = urlParams.get('data');
  if (urlData === null) return;
  const dataPoints = urlData.split(',').map((dataPoint) => {
    const [label, y] = dataPoint.split(':');
    return { label, y: parseFloat(y), indexLabel: formatter(parseFloat(y)) };
  });

  const chart = new ApexCharts(document.querySelector('#chartContainer'), {
    chart: {
      type: 'bar',
      height: '100%',
      width: '100%',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top'
        },
        barHeight: '60%'
      }
    },
    series: [{
      name: 'Series',
      data: dataPoints.map(({ label, y }) => ({ x: label, y }))
    }],
    colors: ['#5DA6B0'],
    xaxis: {
      labels: {
        show: format === 'percent',
        formatter
      },
      max: format === 'percent' ? 1 : dataPoints.reduce((max, next) => Math.max(max, next.y), 0) * 1.1,
      min: 0,
      tickAmount: format === 'percent' ? 5 : undefined,
      axisTicks: {
        show: false
      }
    },
    grid: {
      yaxis: {
        lines: {
          show: false
        }
      },
      xaxis: {
        lines: {
          show: format === 'percent'
        }
      }
    },
    tooltip: {
      enabled: false
    },
    dataLabels: {
      formatter,
      style: {
        colors: ['#222'],
        fontWeight: null
      },
      textAnchor: 'end',
      offsetX: 10
    },
    fill: {
      opacity: 1
    }
  });
  chart.render();
}
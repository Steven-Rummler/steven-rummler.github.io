// Extract params from URL
const params = new URLSearchParams(window.location.search);
const chart = params.get('chart');
const [engine, type] = chart.split('-');
const format = params.get('format');
const formatter = format === 'currency' ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format :
  format === 'percent' ? Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 0 }).format :
    Intl.NumberFormat('en-US').format;
const data = params.get('data').split(',').map((point) => ({ x: point.split(':')[0], y: parseFloat(point.split(':')[1]) }));
const chartJSData = data.map((point) => ({ label: point.x, y: point.y, indexLabel: formatter(point.y) }));

// Set up chart options
const apexChartsBarOptions = {
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
    data
  }],
  colors: ['#5DA6B0'],
  xaxis: {
    labels: {
      show: format === 'percent',
      formatter
    },
    max: format === 'percent' ? 1 : data.reduce((max, next) => Math.max(max, next.y), 0) * 1.1,
    min: 0,
    tickAmount: format === 'percent' ? 5 : undefined,
    axisTicks: {
      show: false
    }
  },
  grid: {
    xaxis: { lines: { show: format === 'percent' } },
    yaxis: { lines: { show: false } }
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
};
const apexChartsLineOptions = {
  chart: {
    type: 'line',
    height: '100%',
    width: '100%',
    toolbar: {
      show: false
    }
  },
  series: [{
    name: 'Series',
    data
  }],
  colors: ['#5DA6B0'],
  yaxis: {
    labels: {
      show: format === 'percent',
      formatter
    },
    max: format === 'percent' ? 1 : data.reduce((max, next) => Math.max(max, next.y), 0) * 1.1,
    min: 0,
    tickAmount: format === 'percent' ? 5 : undefined,
    axisTicks: {
      show: false
    }
  },
  grid: {
    xaxis: { lines: { show: format === 'percent' } },
    yaxis: { lines: { show: false } }
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
};
const canvasJSBarOptions = {
  animationEnabled: true,
  data: [{
    type,
    color: "#5DA6B0",
    dataPoints: chartJSData,
    indexLabelPlacement: 'inside',
    indexLabelTextAlign: 'right'
  }],
  axisX: {
    tickLength: 0,
    labelMaxWidth: 200,
    labelAngle: 0,
    lineColor: '#ddd',
  },
  axisY: {
    minimum: 0,
    maximum: format === 'percent' ? 1 : data.reduce((max, next) => Math.max(max, next.y), 0) * 1.1,
    gridThickness: format === 'percent' ? 1 : 0,
    gridColor: '#ddd',
    labelFormatter: format === 'percent' ? label => formatter(label.value) : () => '',
    lineThickness: 0,
    tickLength: 0
  },
  dataPointWidth: 20,
  toolTip: { enabled: false }
};
const canvasJSLineOptions = {
  animationEnabled: true,
  data: [{
    type,
    color: "#5DA6B0",
    dataPoints: chartJSData,
    indexLabelPlacement: 'inside',
    indexLabelTextAlign: 'right'
  }],
  axisX: {
    tickLength: 0,
    labelMaxWidth: 200,
    labelAngle: -90,
    lineColor: '#ddd',
  },
  axisY: {
    minimum: 0,
    maximum: format === 'percent' ? 1 : data.reduce((max, next) => Math.max(max, next.y), 0) * 1.1,
    gridThickness: format === 'percent' ? 1 : 0,
    gridColor: '#ddd',
    labelFormatter: format === 'percent' ? label => formatter(label.value) : () => '',
    lineThickness: 0,
    tickLength: 0
  },
  dataPointWidth: 20,
  toolTip: { enabled: false }
};

// Select engine and renderer
const url = engine === 'canvasjs' ? 'https://cdn.canvasjs.com/canvasjs.min.js' : 'https://cdn.jsdelivr.net/npm/apexcharts';
const options = {
  'apexcharts-bar': apexChartsBarOptions,
  'apexcharts-line': apexChartsLineOptions,
  'canvasjs-bar': canvasJSBarOptions,
  'canvasjs-line': canvasJSLineOptions,
}[chart];

// Append script
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = url;
script.onload = () => {
  if (engine === 'apexcharts') new ApexCharts(document.querySelector('#chartContainer'), options).render();
  if (engine === 'canvasjs') new CanvasJS.Chart("chartContainer", options).render();
}
document.body.appendChild(script);
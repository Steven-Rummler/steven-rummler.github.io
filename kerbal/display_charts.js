function display_charts() {
  // Toast UI Charts
  let chart = tui.chart;

  var theme = {
    chart: {
      fontFamily: "Verdana",
      background: {
        color: "light-green",
        opacity: 1,
      },
    },
  };
  tui.chart.registerTheme("kerbal", theme);

  let experiments_chart = document.getElementById("experiments_chart");
  let celestials_chart = document.getElementById("celestials_chart");

  experiment_data = agg_experiment_total(dataset);
  celestial_data = agg_celestial_total(dataset);

  let experiments_chart_data = {
    categories: experiment_data.map((a) => a.experiment),
    series: [
      { name: "Science Completed", data: experiment_data.map((a) => a.sci) },
      { name: "Maximum Science", data: experiment_data.map((a) => a.cap) },
    ],
  };
  let celestials_chart_data = {
    categories: celestial_data.map((a) => a.celestial),
    series: [
      { name: "Science Completed", data: celestial_data.map((a) => a.sci) },
      { name: "Maximum Science", data: celestial_data.map((a) => a.cap) },
    ],
  };

  let options = {
    theme: "kerbal",
    chart: {
      height: 500,
      width: 500,
    },
    legend: {
      align: "bottom",
      showCheckbox: false,
    },
    chartExportMenu: {
      visible: false,
    },
  };
  chart.barChart(experiments_chart, experiments_chart_data, options);

  options = {
    theme: "kerbal",
    chart: {
      height: 500,
      width: 500,
    },
    legend: {
      align: "bottom",
      showCheckbox: false,
    },
    chartExportMenu: {
      visible: false,
    },
  };
  chart.barChart(celestials_chart, celestials_chart_data, options);

  for (let c = 0; c < celestials.length; c++) {
    options = {
      theme: "kerbal",
      chart: {
        height: 500,
        width: 500,
      },
      legend: {
        align: "bottom",
        showCheckbox: false,
      },
      chartExportMenu: {
        visible: false,
      },
    };
    biome_data = agg_biome_total(dataset, c);
    let biome_chart = document.getElementById("biomes_chart_" + c);
    let biome_chart_data = {
      categories: biome_data.map((a) => a.biome),
      series: [
        { name: "Science Completed", data: biome_data.map((a) => a.sci) },
        { name: "Maximum Science", data: biome_data.map((a) => a.cap) },
      ],
    };
    chart.barChart(biome_chart, biome_chart_data, options);
  }
}

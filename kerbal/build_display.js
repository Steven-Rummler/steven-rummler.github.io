function add_tile(title, chart) {
  let results = document.querySelector("#results");
  let tile = document.createElement("div");
  tile.className = "tile";
  tile.appendChild(title);
  tile.appendChild(chart);
  results.appendChild(tile);
}

function build_display() {
  // Recommendation List

  let recommend_title = document.createElement("div");
  recommend_title.id = "recommend_title";
  recommend_title.className = "title";

  let recommendations = document.createElement("div");
  recommendations.id = "recommendations";
  recommendations.className = "chart";

  add_tile(recommend_title, recommendations);

  // Experiment Chart

  let exp_title = document.createElement("div");
  exp_title.className = "title";
  exp_title.innerText = "Science Progress by Experiment";

  let exp_chart = document.createElement("div");
  exp_chart.className = "chart";
  exp_chart.id = "experiments_chart";

  add_tile(exp_title, exp_chart);

  // Celestial Bodies Chart

  let cel_title = document.createElement("div");
  cel_title.className = "title";
  cel_title.innerText = "Science Progress by Celestial Body";

  let cel_chart = document.createElement("div");
  cel_chart.className = "chart";
  cel_chart.id = "celestials_chart";

  add_tile(cel_title, cel_chart);

  // Celestial Body Charts

  for (let c = 0; c < celestials.length; c++) {
    let title = document.createElement("div");
    title.className = "title";
    title.innerText = celestials[c];

    let chart = document.createElement("div");
    chart.id = "biomes_chart_" + c;
    chart.className = "chart";

    add_tile(title, chart);
  }
}

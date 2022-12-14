function local_science() {
  let locals = [
    "KSC",
    "Administration",
    "AstronautComplex",
    "Crawlerway",
    "FlagPole",
    "LaunchPad",
    "MissionControl",
    "R&D",
    "Runway",
    "SPH",
    "TrackingStation",
    "VAB",
  ];
  let local_data = dataset.filter(
    (d) => d.celestial == "Kerbin" && locals.includes(d.biome) && d.sci == 0
  );
  let science_left = 0;
  for (let e = 0; e < local_data.length; e++) {
    science_left += local_data[e].cap;
  }
  return science_left;
}

function next_celestial() {
  celestial_data = agg_celestial_total(dataset);
  let order = [4, 6, 5, 0, 7, 8, 3, 10, 15, 14, 9, 12, 11, 16, 13, 1, 2];
  for (let o = 0; o < order.length; o++) {
    if (celestial_data[order[o]].sci == 0) {
      return celestial_data[order[o]].celestial;
    }
  }
  return "beyond the Kerbal System, you spacefaring legend";
}

function display_recommender() {
  document.querySelector("#recommend_title").innerText =
    "Personalized Recommendations";

  let recommendations = document.querySelector("#recommendations");
  let tips = "";

  let local = local_science();
  if (local > 0) {
    tips +=
      "<p>Not in the mood for the endless vacuum of space? Not to worry! Stay nice and comfy at home by taking some time to collect the " +
      local.toFixed() +
      " science points still available around the Kerbal Space Center. Everywhere from the Crawlerway to the Flagpole has its own biome, so science away!</p>";
  }

  tips +=
    "<p>Wanting to fill in some more of that Kerbin knowledge gap? Airplanes and small rockets are the perfect vehicle for a trip to Kerbin's mountains, deserts, or frozen poles!</p>";

  tips +=
    "<p>Adventure awaits beyond Kerbin's skies! It looks like the next celestial body you should visit is " +
    next_celestial() +
    ". Safe travels!</p>";

  recommendations.innerHTML = tips;
}

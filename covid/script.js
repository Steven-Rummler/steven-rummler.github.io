fetch("https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats", {
  method: "GET",
  headers: {
    "x-rapidapi-key": "7952a1b822msh4cd1e194a35de37p1efbf4jsn3d84920cd655",
    "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
  },
})
  .then((response) => {
    response.json().then((data) => {
      // Extract and separate data
      let records = data["data"]["covid19Stats"];
      country_records = records.filter(
        (stat) => stat["city"] == null && stat["province"] == null
      );
      us_city_records = records.filter((stat) => stat["country"] == "US");
      other_local_records = records.filter(
        (stat) =>
          (stat["city"] != null || stat["province"] != null) &&
          stat["country"] != "US"
      );
      console.log(records);
      console.log(country_records);
      console.log(us_city_records);
      console.log(other_local_records);

      // Extract data for US States
      states = {};
      us_city_records.forEach((city) => {
        let state_name = city["province"];
        if (states.hasOwnProperty(state_name)) {
          states[state_name]["confirmed"] += city["confirmed"];
          states[state_name]["deaths"] += city["deaths"];
        } else if (
          state_name != "Diamond Princess" &&
          state_name != "Grand Princess" &&
          state_name != "Summer Olympics 2020" &&
          state_name != "Recovered"
        ) {
          states[state_name] = {
            confirmed: city["confirmed"],
            deaths: city["deaths"],
            type: "State",
          };
        }
      });
      console.log(states);

      // Compile country data
      countries = {};
      other_local_records.forEach((city) => {
        let country_name = city["country"];
        if (countries.hasOwnProperty(country_name)) {
          countries[country_name]["confirmed"] += city["confirmed"];
          countries[country_name]["deaths"] += city["deaths"];
        } else {
          countries[country_name] = {
            confirmed: city["confirmed"],
            deaths: city["deaths"],
            type: "Country",
          };
        }
      });
      country_records.forEach((country) => {
        let country_name = country["country"];
        if (
          !["Diamond Princess",
            "Holy See",
            "MS Zaandam",
            "Summer Olympics 2020",
            "West Bank and Gaza",
            "Antarctica",
            "Korea, North",
            "Winter Olympics 2022"].includes(country_name)
        ) {
          countries[country_name] = {
            confirmed: country["confirmed"],
            deaths: country["deaths"],
            type: "Country",
          };
        }
      });
      console.log(countries);

      // Add population data
      for (let state of Object.keys(states)) {
        if (state_pop.hasOwnProperty(state)) {
          states[state]["population"] = state_pop[state];
        } else {
          console.log("Missing population data for " + state);
        }
      }
      console.log(states);
      for (let country of Object.keys(countries)) {
        if (country_pop.hasOwnProperty(country)) {
          countries[country]["population"] = country_pop[country];
        } else {
          console.log("Missing population data for " + country);
        }
      }
      console.log(countries);

      // Merge datasets
      let locations = {
        ...states,
        ...countries,
      };
      console.log(locations);

      // Calculate Ratio Stats
      for (let location_name of Object.keys(locations)) {
        let location = locations[location_name];
        location["ratioconfirmed"] =
          (1000000 * location["confirmed"]) / location["population"];
        location["ratiodeaths"] =
          (1000000 * location["deaths"]) / location["population"];
      }
      console.log(locations);

      // Build table
      let content = $("#content");
      for (let location_name of Object.keys(locations)) {
        let location = locations[location_name];
        let row = document.createElement("tr");

        let data = document.createElement("td");
        data.innerText = location_name;
        data.classList.add("name");
        row.appendChild(data);

        data = document.createElement("td");
        data.innerText = Math.round(location["ratiodeaths"]);
        row.appendChild(data);

        data = document.createElement("td");
        data.innerText = Math.round(location["ratioconfirmed"]);
        row.appendChild(data);

        data = document.createElement("td");
        data.innerText = Math.round(location["deaths"]);
        row.appendChild(data);

        data = document.createElement("td");
        data.innerText = Math.round(location["confirmed"]);
        row.appendChild(data);

        data = document.createElement("td");
        data.innerText = Math.round(location["population"]);
        row.appendChild(data);

        row.classList.add(location["type"]);
        content.append(row);
      }

      // Format table
      $("table").DataTable({
        searching: false,
        paging: false,
        info: false,
        order: [[1, "desc"]],
        autoWidth: false,
        columnDefs: [
          { width: "20%", targets: 0 },
          { width: "16%", targets: 1 },
          { width: "16%", targets: 2 },
          { width: "16%", targets: 3 },
          { width: "16%", targets: 4 },
          { width: "16%", targets: 5 },
        ],
        fixedHeader: true,
        responsive: true,
      });
    });
  })
  .catch((err) => {
    console.error(err);
  });

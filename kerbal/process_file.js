// Read in the file and parse science data into four lists
function process_file(reader) {
  science = reader.result
    .split("name = ResearchAndDevelopment")[1]
    .split("name = VesselRecovery")[0]
    .split("@");
  let experiment = [];
  let location = [];
  let sci = [];
  let cap = [];
  let save_data = [];
  experiment.push(science[0].split(" ")[science[0].split(" ").length - 1]);
  let i;
  for (i = 1; i < science.length; i++) {
    location.push(science[i].split("\n")[0].trim());
    if (i != science.length - 1)
      experiment.push(science[i].split(" ")[science[i].split(" ").length - 1]);
    sci.push(Number(science[i].split("sci = ")[1].split("\n")[0]));
    cap.push(Number(science[i].split("cap = ")[1].split("\n")[0]));
  }

  // Transfer the save data into the master dataset

  for (i = 0; i < experiment.length; i++) {
    save_data.push({
      experiment: experiment[i],
      location: location[i],
      sci: sci[i],
      cap: cap[i],
    });
  }
  let updates = 0;
  let d, s;
  for (d = 0; d < dataset.length; d++) {
    for (s = 0; s < save_data.length; s++) {
      if (
        dataset[d].experiment === save_data[s].experiment &&
        dataset[d].location === save_data[s].location
      ) {
        updates++;
        dataset[d].sci = save_data[s].sci;
      }
    }
  }
}

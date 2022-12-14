// Takes a dataset, and returns a set with one entry for each experiment
// Output keys: experiment, location*, sci(total), cap(total), celestial*, biome*, situation*
// *blank, might include later if all the same
function agg_experiment_total(dataset) {
    var result_set = []
    for (var e = 0; e < experiments.length; e++) {
        var subset = dataset.filter(d => d.experiment === keys[experiments[e]]);
        var sci_total = 0;
        var cap_total = 0;
        for (var l = 0; l < subset.length; l++) {
            sci_total += subset[l].sci;
            cap_total += subset[l].cap;
        }
        result_set.push({
            "experiment": experiments[e], "location": "", "sci": sci_total, "cap": cap_total, "celestial": "", "biome": "", situation: ""
        });
    }
    return result_set;
}

// Takes a dataset, and returns a set with one entry for each celestial
// Output keys: experiment*, location*, sci(total), cap(total), celestial, biome*, situation*
// *blank, might include later if all the same
function agg_celestial_total(dataset) {
    var result_set = []
    for (var c = 0; c < celestials.length; c++) {
        var subset = dataset.filter(d => d.celestial === celestials[c]);
        var sci_total = 0;
        var cap_total = 0;
        for (var l = 0; l < subset.length; l++) {
            sci_total += subset[l].sci;
            cap_total += subset[l].cap;
        }
        result_set.push({
            "experiment": "", "location": "", "sci": sci_total, "cap": cap_total, "celestial": celestials[c], "biome": "", situation: ""
        });
    }
    return result_set;
}

// Takes a dataset and a celestial number, and returns a set with one entry for each biome
// Output keys: experiment*, location*, sci(total), cap(total), celestial*, biome, situation*
// *blank, might include later if all the same
function agg_biome_total(dataset, c) {
    var result_set = []
    for (var b = 0; b < biomes[c].length; b++) {
        var subset = dataset.filter(d => d.celestial === celestials[c] && d.biome === biomes[c][b]);
        var sci_total = 0;
        var cap_total = 0;
        for (var l = 0; l < subset.length; l++) {
            sci_total += subset[l].sci;
            cap_total += subset[l].cap;
        }
        result_set.push({
            "experiment": "", "location": "", "sci": sci_total, "cap": cap_total, "biome": biomes[c][b], situation: ""
        });
    }
    return result_set;
}
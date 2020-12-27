labels = ["Title", "Description", "Front End", "Back End", "Category"];
projects = [
  [
    "https://kerbal.stevenrummler.com",
    "Kerbal Science Analyzer",
    "Analyzes game files in browser, displays charts and recommendations",
    "HTML/CSS/JavaScript",
    "",
    "Personal",
  ],
  [
    "https://simplemath.stevenrummler.com",
    "Math Flash Cards",
    "Generates random simple math problems in flash card format",
    "HTML/CSS/JavaScript",
    "",
    "Personal",
  ],
  [
    "https://starwars.stevenrummler.com/",
    "Star Wars Codex",
    "Simple website with data display and management",
    "HTML/CSS/JS/Vue",
    "Node/Mongo",
    "Coursework",
  ],
  [
    "https://github.com/Steven-Rummler/FamilyMap",
    "Family Map",
    "Complete Android application with custom Java backend",
    "Android/Java",
    "Java",
    "Coursework",
  ],
  [
    "https://github.com/Steven-Rummler/QualtricsDataCompilation",
    "Survey Data Compiler",
    "Aggregates results from a group of Qualtrics surveys into summary reports",
    "",
    "Python",
    "Personal",
  ],
  [
    "https://covid.stevenrummler.com",
    "Covid Perspective",
    "Covid data showing US states and other countries in the same list",
    "HTML/CSS/Javascript",
    "",
    "Personal",
  ],
];

let thead = document.getElementById("thead");
let row = document.createElement("tr");
for (let i = 0; i < labels.length; i++) {
  let th = document.createElement("th");
  th.setAttribute("onclick", "sortTable(" + i + ")");
  th.innerText = labels[i];
  row.appendChild(th);
}
thead.appendChild(row);

let tbody = document.getElementById("tbody");
projects.forEach((project) => {
  let row = document.createElement("tr");
  row.classList.add("data");
  let link = project[0];
  for (let i = 1; i < project.length; i++) {
    let cell = document.createElement("td");
    cell.setAttribute("data-label", labels[i - 1]);
    let text = document.createElement("a");
    text.href = link;
    text.innerText = project[i];
    cell.appendChild(text);
    row.appendChild(cell);
  }
  tbody.appendChild(row);
});

const headers = table.querySelectorAll("th");
const tableBody = table.querySelector("tbody");
const rows = tableBody.querySelectorAll("tr");
const directions = Array.from(headers).map(function (header) {
  return "";
});

const sortTable = function (index) {
  // Get the current direction
  const direction = directions[index] || "asc";

  // A factor based on the direction
  const multiplier = direction === "asc" ? 1 : -1;

  // Clone the rows
  const newRows = Array.from(rows);

  // Sort rows by the content of cells
  newRows.sort(function (rowA, rowB) {
    // Get the content of cells
    const a = rowA.querySelectorAll("td")[index].firstChild.innerText;
    const b = rowB.querySelectorAll("td")[index].firstChild.innerText;

    switch (true) {
      case a > b:
        return 1 * multiplier;
      case a < b:
        return -1 * multiplier;
      case a === b:
        return 0;
    }
  });

  // Remove old rows
  [].forEach.call(rows, function (row) {
    tableBody.removeChild(row);
  });

  // Append new row
  newRows.forEach(function (newRow) {
    tableBody.appendChild(newRow);
  });

  // Reverse the direction
  directions[index] = direction === "asc" ? "desc" : "asc";
};

sortTable(0);

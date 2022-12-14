function search(order) {
  let category = document.getElementById("category").value;
  let number = document.getElementById("number").value;
  let short = document.getElementById("short").value;
  let real = document.getElementById("real").value;
  let inter = document.getElementById("inter").value;
  let yarn = document.getElementById("yarn").value;

  let data = {
    category: category,
    order: order,
    number: number,
    short: short,
    real: real,
    inter: inter,
    yarn: yarn,
  };

  fetch("https://mapping-api.stevenrummler.com", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    response.json().then((results) => {
      let rows = "";
      for (let result of results) {
        let row = "<tr>";
        for (let item of result) {
          row += "<td>" + item + "</td>";
        }
        row += "</tr>";
        rows += row;
      }
      document.getElementById("tbody").innerHTML = rows;
    });
  });
}

document
  .getElementById("short")
  .addEventListener("input", () => search("short"));
document.getElementById("real").addEventListener("input", () => search("real"));
document
  .getElementById("inter")
  .addEventListener("input", () => search("inter"));
document.getElementById("yarn").addEventListener("input", () => search("yarn"));

// const embed = 'http://localhost:5500/charts/embed.html';
const embed = 'https://stevenrummler.com/charts/embed';

const charts = ['apexcharts-bar', 'apexcharts-line', 'canvasjs-bar', 'canvasjs-line'];

let data = "Undergraduate certificate:17976,Associates degree:25608,Bachelor's degree:32568,Master's degree:48468,Doctoral degree:53112";
let format = "currency";
let height = 200;
let width = 400;

document.querySelector("#dataFormat").addEventListener("change", () => {
  const value = document.querySelector("#dataFormat").value;
  data = value.split("&format=")[0];
  format = value.split("&format=")[1];
  charts.forEach(update);
});

document.querySelector("#height").addEventListener("change", () => {
  height = document.querySelector("#height").value;
  charts.forEach(update);
});

document.querySelector("#width").addEventListener("change", () => {
  width = document.querySelector("#width").value;
  charts.forEach(update);
});

function update(id) {
  const newURL = `${embed}?chart=${id}&data=${data}&format=${format}`;
  const chart = document.querySelector(`#${id}`);
  chart.src = newURL;
  chart.height = `${height}px`;
  chart.width = `${width}px`;
  chart.parentElement.parentElement.children[1].innerText = `<iframe src="${newURL}" height="${height}px" width="${width}px" style="border: none"></iframe>`;
}

charts.forEach(update);

document.querySelector('.copy').addEventListener('click', () => {
  const code = document.querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    alert('Embed link copied to clipboard');
  });
});